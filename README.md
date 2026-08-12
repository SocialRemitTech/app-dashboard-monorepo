# Social Remit / EMONI — Monorepo

Production-grade React Native app + shared TypeScript core, built to the architecture in the
Frontend & Backend plans. Contract-first, feature-first, no shortcuts.

## Stack (Aug 2026)

- **Expo SDK 56** (RN 0.85, React 19.2, Hermes v1) — New Architecture mandatory
- **Expo Router v7** — file-based, typed routes, deep linking (replaces the MVP's hand-rolled stack)
- **NativeWind 4** + **@sr/design-tokens** — Tailwind vocabulary over a single token source
- **Reanimated 4** + Gesture Handler — animation + gestures
- **TanStack Query** (server state) · **Zustand** (client state) · **XState** (flow state machines)
- **Zod** — the wire contract; every API response validated at the boundary
- **expo-secure-store / -local-authentication / -notifications** — secure token storage, biometrics, push
- **pnpm + Turborepo** — workspace with shared packages
- Tooling: TS strict (+`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`), ESLint 9 flat, Prettier, Husky, commitlint

## Layout

```
apps/
  mobile/                 # the React Native app (Expo Router)
    app/                  # THIN route files — guards + render feature screens, no logic
      (auth)/  (app)/(tabs)/
    src/
      features/           # feature-first: auth, send-money, kyc, payments, wallet, ...
      data/               # api-client (interceptors), query-client, MSW mocks
      shared/             # ui primitives, platform (secure-store/biometrics), observability
      providers/          # provider composition
  dashboard/              # (Phase 3) React web — MLRO/NGO/B2B/Admin, same shared core
packages/
  domain/                 # PURE logic: Money, pricing/FX/margin, KYC gate, risk — unit-tested
  api-contract/           # Zod schemas = the contract-first source of truth
  design-tokens/          # brand tokens + tailwind preset
  config/                 # env (zod-validated) + feature flags
  tsconfig/ eslint-config/ # shared presets
```

## The rules that keep it clean

1. **Screens render, hooks orchestrate, services decide, the api-client talks to the network.**
   A screen never contains a business threshold or a `fetch`.
2. **Contract-first.** Build against Zod schemas + MSW; flip to the real API with no code change.
3. **Money is never a float** — `@sr/domain`'s `Money` is integer minor units + currency, currency-safe.
4. **Add a corridor = config, not code** — corridors/delivery methods are fetched data.
5. **Secrets in secure storage only**; PIN verified server-side; biometrics gate the token.

## Getting started

```bash
# 1. Scaffold native folders with SDK-correct versions (pins everything via expo install):
#    (run once inside apps/mobile the first time)
cd apps/mobile && npx create-expo-app@latest . --template blank-typescript  # if starting fresh
# — or, using this scaffold as-is —
corepack enable && pnpm install
cp apps/mobile/.env.example apps/mobile/.env       # fill API_BASE_URL etc.
pnpm --filter @sr/mobile exec expo install         # align native deps to SDK 56
pnpm --filter @sr/mobile prebuild                  # generate ios/ android/ (config plugins)
pnpm mobile                                        # start dev client

# Verify the shared core (runs anywhere, no simulator needed):
pnpm --filter @sr/domain test
```

> Native dep versions in `apps/mobile/package.json` are guidance — `expo install` resolves the exact
> SDK-56-compatible set. Never hand-pin Expo native deps; let the tool do it.


pnpm --filter @sr/mobile ios
pnpm --filter @sr/mobile android

pnpm --filter @sr/mobile prebuild
pnpm --filter @sr/mobile start

eas build --profile development --platform android 

emulator -avd Pixel_10_Pro

adb devices