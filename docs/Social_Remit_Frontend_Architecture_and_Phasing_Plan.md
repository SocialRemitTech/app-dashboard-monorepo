# Social Remit / EMONI — Mobile Frontend Architecture & Phasing Plan
### v1.0 — companion to "Platform Architecture & Engineering Strategy v2.0" and the "Consolidated Project Brief"

---

## 0. Purpose & how this fits the existing docs

The platform architecture doc (v2.0) and the project brief cover the **backend, corridors, FX, and infrastructure** in depth. Neither covers the **client application** with the same rigour. This document fills that gap: it takes the current MVP prototype and lays out how it becomes a production-grade, modular, low-tech-debt frontend, phased against the same Stage 1 / 2 / 3 runway used everywhere else in the doc set.

It is deliberately structured so it can be read alongside the architecture outline: same *current → trigger → future* framing, same ownership/horizon tagging, same "no forced rewrites" thesis — applied to the app instead of the backend.

One naming note carried through: **EMONI** is the consumer app brand (logo, splash, `EMN-` transaction refs); **Social Remit** is the platform/company. This plan treats them as brand vs. platform and assumes the same app shell may later be re-skinned for white-label partners (Section 3.7).

---

## 1. Where the MVP is today — honest assessment

The prototype is genuinely strong on **UX and domain thinking** and genuinely weak on **engineering architecture** — which is exactly what you'd expect from an investor-grade clickable demo, and exactly the thing to fix before it becomes the real app.

### 1.1 What's good and must be preserved

- **The domain model is sound.** The KYC-status-as-single-gate rule, the three recipient scenarios (first-time / returning-existing / returning-new), progressive KYC → EDD escalation, soft-reentry, rate-lock and outage edge states — these are correct product decisions. The *logic* is good even though the *implementation* is ad hoc.
- **Screens are already decomposed into files.** `App.tsx` is only the orchestrator; the individual screens (`SendMoneyRecipientVerified`, `KYCProcessing`, `AirtimeSummary`, etc.) are separate components. That means the fix is re-architecting the *shell*, not rewriting every screen.
- **Edge states are anticipated.** `fx-refresh`, `momo-outage-gate`, `secure-release-hold`, `pay-gate-router` exist as stubs. The team already knows these states exist — they just aren't modelled yet.
- **Design language is defined.** Coral `#F45B3A`, Inter, consistent spacing/shadows. This is a design system waiting to be extracted.

### 1.2 Tech debt to pay down (with the specific evidence in the code)

| # | Issue | Evidence in `App.tsx` | Why it blocks production |
|---|---|---|---|
| 1 | **God component** | ~60 `useState` hooks + all handlers + all routing in one file | Every screen change re-renders everything; impossible to test or reason about in isolation; merge-conflict magnet |
| 2 | **Hand-rolled router** | `navigationStack` array with `pushScreen`/`popScreen`/`replaceScreen`/`resetToScreen`/`popToScreen` | Reinvents a router with no URL, no deep-linking (despite "deep-link routing" comments), no typed params, no route guards |
| 3 | **Screen params passed via global state** | `recipientData`, `amountData`, `selectedCorridor` live at the top and are read by whichever screen is mounted | Coupling + stale-state bugs. The `sendFlowKey`/`kycFlowKey` "force remount" counters are a direct symptom of this |
| 4 | **Business rules in the view layer** | `shouldRequireOccupation()`, `performSilentRiskAssessment()`, the `£900` and `£500` thresholds, promotion eligibility, corridor→currency map | Domain rules must be testable and must mirror the backend rules engine; today they're hardcoded in JSX handlers |
| 5 | **No API/data layer** | `setTimeout` for processing, `Math.random()` for "account exists", `alert`/`confirm`/`prompt` for flow control, mock `recentTransactions` in `useState` | There is no fetching, caching, retry, error handling, or offline behaviour to build on |
| 6 | **Sensitive data handled unsafely** | `savedPin` stored in plain component state; `SoftSecureReentry` compares against it client-side | The onboarding doc claims "encrypted, never stored in plain text" — the code does the opposite. This is a hard blocker for a regulated money app |
| 7 | **Delivery model hardcoded to 2 corridors / 2 methods** | recipient flow only knows `mobile-money` and `bank-transfer`, Ghana/Nigeria | The corridor sheet has 15+ countries and **cash pickup + account credit** methods with no home in the current flow |
| 8 | **No cross-cutting infrastructure** | no error boundary, analytics, feature flags, i18n system, telemetry, crash reporting | These are the things you can't retrofit cheaply once 40 screens depend on their absence |

None of this is a criticism of the demo — it's the normal gap between "prove the experience" and "run other people's money through it." The rest of this document is the bridge.

---

## 2. Decision 0 — Target platform *(DECIDED)*

**Production runs on React Native.** The sender app is React Native; the MLRO / NGO / B2B / Admin dashboards stay React (web); domain logic, types, design tokens, and API contracts are shared across both via a monorepo package. This is the platform doc's own "shared core, split surface" principle, made concrete.

The current web MVP (`App.tsx`, Tailwind, `motion/react`, 390px frame) is therefore a **design + interaction reference**, not the production codebase. Screens are re-implemented in RN against the same UX; the *behaviour and domain logic* port directly, the *visual layer* does not (see the porting note below).

### 2.1 Concrete RN stack

| Concern | Choice | Rationale |
|---|---|---|
| **Runtime / tooling** | **Expo** (dev client + config plugins + prebuild), New Architecture (Fabric/TurboModules) on | Gives EAS Build/Update (OTA), while config plugins still allow every native module a fintech needs (Sumsub, cert pinning, root detection). No longer a reason to eject to bare RN |
| **Navigation** | **Expo Router** (file-based, typed routes, universal deep linking) — built on React Navigation | Typed params + deep links out of the box; replaces the hand-rolled `navigationStack` |
| **Styling** | **NativeWind** (Tailwind-for-RN) + token set | The prototype is already Tailwind; NativeWind carries the mental model and much of the class vocabulary straight over, easing the port |
| **Animation** | **Reanimated** + Gesture Handler | RN equivalent of the prototype's `motion/react`; drives the OTP/PIN micro-interactions and sheet gestures |
| **Secure storage** | **expo-secure-store** (Keychain / Keystore) | tokens/keys only; never AsyncStorage |
| **Biometrics** | **expo-local-authentication** | Face ID / fingerprint gating the secure-storage token (§3.8) |
| **Push** | **expo-notifications** (FCM / APNs) | transfer status + compliance nudges (§3.5) |
| **Monorepo** | pnpm workspaces + Turborepo | shares `/domain`, `/data`, `/config`, design tokens between RN app and web dashboards |

### 2.2 Porting note — what does *not* carry over from the prototype

The team should scope this explicitly so it isn't mistaken for a copy-paste:

- **`motion/react` → Reanimated.** All animations are re-authored. The *intent* (coral glow, box "pop", auto-advance, sheet slide) is documented in your PIN/onboarding refinement notes and ports 1:1 conceptually; the code does not.
- **DOM/CSS → RN primitives.** `div`/`h-dvh`/CSS shadows become `View`/`Text`/`Pressable` + NativeWind/token styling. `alert`/`confirm`/`prompt` (used for flow control in the MVP) have no RN equivalent and are replaced by real screens/sheets — which the architecture already wanted anyway.
- **Bottom sheets / inputs.** The `BottomSheet`, OTP, and PIN components are rebuilt on `@gorhom/bottom-sheet` + native `TextInput` with proper `secureTextEntry`, keyboard types, and secure handling.

What *does* carry over untouched: the entire `/domain` layer (KYC gate, risk thresholds, pricing, corridor registry), the `/data` contracts, the flow state machines, and the navigation *graph* — i.e. all the parts this plan treats as the real IP.

---

## 3. Target architecture

Six layers, each replaceable, each with a clear boundary. The guiding rule: **screens render, hooks orchestrate, services decide, the API layer talks to the network.** A screen should never contain a business threshold or a `fetch`.

```
┌─────────────────────────────────────────────────────────────┐
│  Presentation      screens + design-system components         │  "how it looks"
├─────────────────────────────────────────────────────────────┤
│  Navigation        typed routes, guards, deep links           │  "where you can go"
├─────────────────────────────────────────────────────────────┤
│  Flow / State       feature stores + flow state machines      │  "what step you're on"
├─────────────────────────────────────────────────────────────┤
│  Domain / Services  KYC gate, risk, FX/fee, promo, corridors  │  "what the rules say"
├─────────────────────────────────────────────────────────────┤
│  Data / API         typed client, query cache, idempotency    │  "what the server says"
├─────────────────────────────────────────────────────────────┤
│  Platform           secure storage, biometrics, push, i18n    │  "what the device offers"
└─────────────────────────────────────────────────────────────┘
```

### 3.1 Module / folder structure (feature-first, not type-first)

Organise by **domain feature**, not by technical kind. Each feature owns its screens, components, hooks, store, services, and types, and exposes a small public surface.

```
/app
  /navigation            # route definitions, guards, linking config
  /features
    /auth                # signup, login, OTP, PIN, biometric, recovery, social
    /onboarding          # greeting, intent concierge, soft-reentry
    /send-money          # corridor → amount → recipient → summary → pay
    /airtime
    /wallet              # top-up
    /kyc                 # progressive KYC + EDD
    /payments            # method selection, card/open-banking/wallet/Apple/Google Pay
    /transactions        # history, detail, tracking, retry
    /rewards
    /promotions
    /compliance          # compliance/account task centre
    /menu                # profile, settings, legal, support
  /domain                # PURE business logic, no React, no network
    corridors/           # corridor + delivery-method registry (config-driven)
    kyc/                 # gating + escalation rules
    risk/                # thresholds, occupation, EDD triggers
    pricing/             # FX + fee + promo math (mirrors backend rules engine)
    money/               # Money value object, currency, rounding
  /data                  # API client, endpoints, schemas, query hooks
  /shared
    /ui                  # design system: tokens, primitives, sheets, inputs
    /platform            # secure storage, biometrics, push, network, sms
    /observability       # analytics, error tracking, feature flags, logging
    /i18n
  /config                # env, feature-flag defaults, corridor seed config
```

In the monorepo (RN app + web dashboards), `/domain`, `/data`, `/shared/ui` (tokens), and `/config` become **shared packages** consumed by both apps. That is the concrete mechanism behind "one investment, two surfaces."

### 3.2 Navigation architecture

Replace the manual stack with a real router and **typed route params** so screens stop reading shared global state.

- **App (RN):** **Expo Router** — file-based routes on top of React Navigation's native-stack, with typed params and universal deep linking, so `emoni://send?corridor=UK-GH` works (this is what the "deep-link routing" comments always intended). Auth/onboarding/send/kyc each become a route group.
- **Dashboards (web):** TanStack Router or React Router with typed routes.

Two things this buys you immediately:

1. **Route guards** replace the scattered `if (kycStatus !== 'verified')` checks. A `requiresAuth` and a `requiresKyc(level)` guard sit in the navigation layer; a screen never has to know it was gated.
2. **Params replace globals.** `send-amount` receives `{ corridor }` as a param instead of reading `selectedCorridor`. When you leave and re-enter, the param is fresh — the `sendFlowKey` remount hack disappears.

Migration is incremental (Section 5): wrap the existing stack in an adapter so old and new screens coexist during the transition.

### 3.3 State management

The single most important distinction the current code is missing: **server state vs. client state.** Today everything is client `useState`, including things the server owns (KYC status, wallet balance, transactions, promotion status). That's why the demo can't tell the truth about anything.

| State kind | Examples | Tool | Why |
|---|---|---|---|
| **Server state** | rates, transactions, recipients, KYC status, wallet balance, corridor config, fee quotes | **TanStack Query (React Query)** | caching, background refetch, retry/backoff, invalidation, offline support, request dedup — all for free |
| **Global client state** | session/auth token presence, active brand/theme, feature flags, locale | **Zustand** (small stores) | the doc's own pick; minimal boilerplate |
| **Multi-step flow state** | send-money flow, KYC/EDD flow, wallet top-up flow | **state machine (XState or a lightweight typed reducer)** | flows have explicit states, transitions, and guards — see 3.4 |
| **Ephemeral UI state** | which bottom sheet is open, input focus | local `useState` | correct where it already is |

### 3.4 The send-money flow as a state machine (worked example)

The comments in `App.tsx` already describe the send flow as a state machine — states, transitions, guards, and even edge states. Making that explicit is the highest-leverage single change, because it turns ~15 interdependent handlers into one declarative, testable definition and gives the stubbed edge states (`fx-refresh`, `momo-outage-gate`, `secure-release-hold`) a real home.

```
              ┌──────────┐
              │ corridor │
              └────┬─────┘
                   ▼
              ┌──────────┐   rate quote fetched (rateId + expiry)
              │  amount  │◀──────────────────────────────┐
              └────┬─────┘                                │
                   ▼                          rate expired │ (fx-refresh)
              ┌──────────┐                                 │
              │recipient │─── cash pickup / account credit ┤  ← corridor-driven form
              └────┬─────┘                                 │
                   ▼                                       │
         guard: kycStatus === 'verified' ? ────────────────┘
            │ no                        │ yes
            ▼                           ▼
     ┌────────────┐              ┌────────────┐
     │ kyc / edd  │─────────────▶│  summary   │
     └────────────┘   verified   └─────┬──────┘
                                       ▼
                               guard: rate still valid?
                                │ no → fx-refresh   │ yes
                                                    ▼
                               guard: payout partner healthy?
                                │ no → momo-outage-gate  │ yes
                                                    ▼
                                             ┌────────────┐
                                             │  payment   │ (idempotency key minted here)
                                             └─────┬──────┘
                                                   ▼
                                   processing → (secure-release-hold?) → delivered / failed
```

Guards encode the real rules once: KYC gate, rate-lock validity (Velocity issues quote-locked rates with an expiry — the machine must re-quote when the lock lapses), payout-partner health (the outage gate), and any hold for manual release. This is also where **idempotency** is enforced — the machine mints one idempotency key per transfer attempt and reuses it on retry, so a flaky network can never double-send. That directly de-risks the Falcon `Paidx` reconciliation gap the brief flags: the client guarantees at-most-once submission from its side.

The same pattern applies to the KYC/EDD flow (progressive KYC → risk decision → EDD escalation → manual review) and wallet top-up.

### 3.5 Data / API layer

A single typed client is the only thing allowed to touch the network.

- **Contract-first types.** If the backend publishes OpenAPI, generate the client and types from it so frontend and backend can't drift. Until the backend exists, define the contract as **Zod schemas** and validate every response — this doubles as runtime safety and as the spec you hand to backend planning (Section 10).
- **Interceptors** for: attaching the auth token, silent token refresh on 401, normalising errors into a single typed error shape, attaching a **correlation ID** per request (so a support ticket maps to server logs), and attaching **idempotency keys** on all money-moving POSTs.
- **Mock server (MSW)** in front of the same contract. This is what lets the app be built and demoed *before* the backend is ready, and what keeps the "investor-grade" clickable demo alive without `setTimeout` fakery leaking into production code.
- **Offline & retry.** React Query handles caching and background retry; money-moving actions use an explicit **outbox** pattern (queue the intent, replay on reconnect, keyed by idempotency key) so a transfer initiated on the Tube completes when signal returns.
- **Status updates.** Replace the `setTimeout` processing→delivered simulation with **push (FCM/APNs) + polling fallback**. The brief notes neither MTO guarantees webhooks; the client must poll transaction status on a backoff while a transfer is in flight and reconcile against push when it arrives. Map partner status models (Falcon's 19 states incl. `Paidx`; Velocity's thin enum) to one **canonical client status** so the UI never depends on partner-specific strings.

### 3.6 Domain / services layer (pure, testable, no React)

Everything currently hardcoded in JSX moves here as pure functions with unit tests:

- **`corridors`** — a config-driven registry. A corridor is *data*: `{ country, currency, deliveryMethods[], recipientSchema per method, feeModel, limits, requiredKycLevel }`. Adding Kenya/M-Pesa or Ghana cash-pickup becomes a config entry (ideally fetched from the backend config service), not a code change. **This is the frontend expression of the platform's "plugin behind a routing engine" thesis**, and it's what makes the 15-country sheet tractable.
- **`kyc`** — the single-gate rule and progressive→EDD escalation, as a pure decision function.
- **`risk`** — thresholds (`>= £900` verification, `>= £500` occupation), high-risk-corridor list, EDD triggers. These must mirror the backend; the client copy is a UX optimisation (fail fast) and the server remains the source of truth.
- **`pricing`** — FX + fee + promo math and rounding, using a proper `Money` value object (never floats for currency). Mirrors the backend rules engine so the quote the user sees matches the quote that settles.

Because these are pure, they're the cheapest things to test and the safest to share between app and dashboards.

### 3.7 Design system & theming (multi-brand / white-label ready)

Extract the coral/Inter/spacing language into a **token set** (`color`, `type`, `space`, `radius`, `shadow`, `motion`) and a small primitive library (Button, Input, OtpInput, PinInput, BottomSheet, Card, Chip). Two payoffs:

- Consistency and a11y (focus states, contrast, dynamic type, reduced motion) are solved once.
- **White-label** becomes a runtime theme swap. The platform doc already sells multi-tenant/partner theming; the frontend delivers it by keying the token set to the active brand/partner, so an NGO or B2B partner app is a config, not a fork.

### 3.8 Security architecture (non-negotiable for a money app)

The current PIN handling is the clearest thing to fix. Target posture:

- **PIN is never persisted in JS memory or plaintext.** Entry is transient; verification happens **server-side** (or via a device-secure-enclave-derived key). Biometric unlock gates a **refresh token held in Keychain (iOS) / Keystore (Android)** — biometrics protect the token, they don't "compare a PIN." The soft-reentry test becomes a real unlock against secure storage, not a client-side string compare.
- **Secure storage** for tokens/keys via **expo-secure-store** (Keychain / Keystore), never AsyncStorage; biometric gate via **expo-local-authentication**.
- **Transport & device hardening:** TLS + certificate pinning (native, via config plugin), jailbreak/root detection (warn/limit for a regulated app), screenshot/recording prevention on PIN/KYC/summary screens (`expo-screen-capture`), session timeout + re-auth for money actions.
- **No sensitive data in logs or analytics.** PII/PAN never leave the device un-tokenised; card entry uses the PSP's hosted fields/SDK so **raw PAN never touches your code** (keeps you out of heavy PCI scope).
- Ties into the platform doc's new Security & Compliance section (3.7 there): the RBAC matrix and data-residency map should include *what the client is allowed to cache locally* per corridor.

### 3.9 Cross-cutting infrastructure

The things that are cheap now and impossible later:

| Concern | Tool direction | Why it matters here specifically |
|---|---|---|
| **Analytics / funnels** | Amplitude / Segment / Mixpanel | The whole product thesis is drop-off reduction (onboarding, send funnel). You can't optimise what you don't instrument |
| **Error / crash tracking** | Sentry | A money app's failed-transfer path must be observable in the wild |
| **Feature flags** | Statsig / LaunchDarkly / self-host | Corridor-by-corridor rollout, staged releases, A/B — directly enables the phased corridor plan |
| **i18n / l10n** | i18next / FormatJS | Greeting localisation (Akwaaba/Karibu) is already a feature; currency + corridor language must scale to 15 countries |
| **Error boundaries** | per-feature boundaries | one screen crashing must not take down a payment in progress |
| **Env / config** | typed env + remote config | dev/staging/prod separation the demo doesn't have |

---

## 4. Integration map

The frontend only ever talks to **Social Remit's own API** for corridors/MTOs — Falcon, Velocity, CSLPay, M-Pesa, Mukuru, MoneyMatch etc. all sit *behind* the backend. The client-side integrations are the device- and vendor-SDK ones:

| Integration | What it's for | Client responsibility | Boundary note | Phase |
|---|---|---|---|---|
| **Social Remit API** | everything: rates, transfers, KYC status, wallet, recipients, corridor config | typed client, idempotency, polling | source of truth; MTOs invisible to client | 0–1 |
| **Sumsub SDK** | ID verification + liveness (code already references it) | launch SDK, hand back result token; never handle raw ID images yourself | verification result verified server-side | 1 |
| **Card PSP (hosted fields/SDK)** | card payments | tokenise card via PSP UI; **raw PAN never touches app code** | keeps PCI scope minimal | 1–2 |
| **Open Banking (TrueLayer/Tink/Plaid)** | bank pay-in | launch consent flow, handle redirect/return | already stubbed as `open-banking` sheet | 1–2 |
| **Apple Pay / Google Pay** | wallet pay-in | native payment sheet → token to backend | flags already in `PaymentMethodSelection` | 2 |
| **Push (FCM / APNs)** | transfer status, compliance nudges | register token, handle foreground/background, deep-link into transaction | replaces `setTimeout` simulation | 1 |
| **SMS retriever (Android)** | OTP auto-read | auto-fill OTP boxes | pairs with existing OTP UX | 1 |
| **Biometrics (Face ID / fingerprint)** | unlock + approve | gate secure-storage token | see 3.8 | 1 |
| **Social sign-in (Google/Apple)** | signup/login (code has `SocialAuth`) | native sign-in → token to backend | account-linking handled server-side | 1–2 |
| **Analytics / Sentry / Flags** | observability | init early, no PII | see 3.9 | 0–1 |

---

## 5. Tech-debt paydown / migration strategy (no big-bang rewrite)

The prototype should **not** be thrown away. Use a **strangler-fig** migration so the app keeps working (and keeps demoing) the whole way:

1. **Scaffold the new structure** (Section 3.1) *around* the existing `App.tsx`. Add the router, but implement an adapter so the old `navigationStack` and the new router coexist — screens migrate one at a time.
2. **Introduce the data layer + MSW first**, with the real contract. New screens use it; old screens keep their mock state until migrated. This also produces the API contract for backend planning.
3. **Extract the domain layer next** (pure functions + tests). Point both old and new handlers at it, so behaviour is verified identical before you move UI.
4. **Migrate flow-by-flow**, starting with **send-money** (highest value, clearest state machine). Each migrated flow deletes its slice of `App.tsx` state and its `*FlowKey` remount hack.
5. **Retire `App.tsx` last** — by the time the final flow moves, the god component is empty and deletes itself.

Rule to hold the line: **no new screen is added to the old stack.** Everything new lands in the new structure; that alone stops the debt growing while you pay it down.

---

## 6. Testing strategy

| Layer | What | Tooling |
|---|---|---|
| **Unit** | domain/services (KYC gate, risk thresholds, pricing/FX, corridor config, Money) | Vitest/Jest — fast, pure, high coverage where bugs cost money |
| **Component** | screens in isolation with mocked hooks | Testing Library |
| **Flow / integration** | state machines + happy/edge paths against MSW | machine tests + Testing Library |
| **Contract** | client schemas vs. backend OpenAPI | schema/contract tests in CI |
| **E2E** | full send/KYC/pay journeys on a device | **Detox (RN)** / Playwright (web) |
| **Visual / a11y** | design-system primitives | Storybook + snapshot + axe |

Priority order matches risk: the pure money/KYC/risk logic gets the deepest coverage; E2E covers the two or three journeys that must never break (onboard, send, pay).

---

## 7. CI/CD, release & observability

Aligns with the backend doc's GitHub Actions choice, plus mobile specifics:

- **CI:** typecheck (TS strict) → lint/format → unit/component → contract → build. Blocked merges on red.
- **Mobile build/release:** **EAS Build + EAS Update** (Expo) — OTA updates for JS-only fixes, store submission (EAS Submit) for native changes, **staged/phased rollouts** gated by feature flags. Native module changes (Sumsub, cert pinning) go through `expo prebuild` + a versioned dev client.
- **Environments:** dev / staging / prod with separate config, keys, and corridor flags.
- **Observability in prod:** Sentry (crashes/errors), analytics funnels (onboarding + send drop-off), performance (cold start, screen TTI), and a **money-flow dashboard** (initiations vs. completions vs. failures per corridor) — the client half of the observability the backend doc already plans.

---

## 8. Phased roadmap

Mapped to the same Stage 1 / 2 / 3 runway as the platform doc. Calendar estimates are deliberately omitted — like the platform doc's migration table, they should be attached once team size and priority are set. Phases are defined by **exit criteria**, not dates.

### Phase 0 — Foundation & de-risk *(precedes feature work)*
Decide Decision 0 (Section 2). Scaffold module structure, design-system tokens, TS-strict tooling, CI baseline, error boundaries, env config. Stand up the **router (with adapter)**, the **API client + React Query + MSW**, and the **observability trio** (analytics, Sentry, flags). Extract the first slice of the **domain layer** (pricing + corridors) with tests.
**Exit:** new-architecture skeleton runs alongside the prototype; one trivial screen served through the new router + data layer + flags; API contract drafted as Zod schemas.

### Phase 1 — Core money movement, production-hardened *(Stage 1 / MVP)*
Harden **auth/onboarding** (secure PIN/biometric per 3.8, session, token refresh). Migrate **send-money** to the state machine against MSW→real API. Real **Sumsub** KYC. One real pay-in method (open banking *or* card). **Ghana / BigPay** corridor live end-to-end (mobile wallet + bank), including cash-pickup-ready recipient schema even if GH launches wallet-first. **Push + polling** status; canonical status mapping. Funnel analytics on onboarding + send.
**Exit:** a real UK→Ghana transfer completes on a device, KYC-gated, idempotent, observable; `App.tsx` send state deleted.

### Phase 2 — Breadth & resilience *(Stage 2 / Growth)*
**Nigeria (Velocity + CSLPay)**, then **Kenya/M-Pesa**. **Airtime** and **wallet top-up** migrated. All pay-in methods incl. **Apple/Google Pay**. **EDD** flow. **Cash-pickup + account-credit** delivery types (needed for SA/Mukuru, India/MoneyMatch). Offline outbox + idempotency hardening. Rewards/promotions on the data layer. Full **i18n** for the next corridor wave. White-label **theming hooks** in place.
**Exit:** 3–4 corridors and all four delivery types live from config; adding a corridor is a config PR, not a code change.

### Phase 3 — Scale & platform *(Stage 3 / Enterprise)*
**Modular dashboard suite** (MLRO / NGO / B2B / Admin) on the shared core, as the platform doc specifies. Shared design-system + domain published as monorepo packages. **Config-driven flows** and runtime theming for white-label/partner apps. A/B infra, deeper RUM, and the remaining Asia corridors (MoneyMatch) onboarded as config.
**Exit:** a new white-label partner app or a new stakeholder dashboard ships from config + theme, with no core rewrite — the frontend half of "50M users, no core rebuilds."

---

## 9. Open decisions for the team

1. ~~Decision 0~~ — **settled: React Native app + React web dashboards + shared TS core** (§2).
2. **Team shape & timeline** — needed to convert the phase exit-criteria into a dated plan (same caveat the platform doc makes about engineering-week estimates).
3. **PSP + open-banking vendor choices** — determines the card/OB SDK integration in Phase 1.
4. **Backend contract ownership** — who owns the OpenAPI spec? The Zod schemas from Phase 0 can seed it, but drift control needs one owner.
5. **Client-side rules duplication policy** — how much of the risk/KYC/pricing rules may the client replicate for UX (fail-fast) vs. always defer to server? (Server stays source of truth; question is how much fast-feedback UX you buy.)
6. **Local caching vs. data residency** — which corridors forbid caching what on-device? Ties to the platform doc's data-residency map.

---

## 10. Handoff to backend planning (the bridge to the next doc)

Because the frontend is being built contract-first, this plan **produces the API surface the backend must serve** — a running start on the next piece of work. The backend plan should expect the client to require, at minimum:

- **Auth:** signup/login, OTP issue/verify, token issue/refresh, biometric-token binding, social sign-in exchange, device registration.
- **Corridor config:** the corridor/delivery-method/recipient-schema/limits/fees registry, fetchable and cacheable, so the client stays config-driven.
- **Quotes:** FX + fee quote with **`rateId` + expiry** (matches Velocity's model) and re-quote on expiry.
- **Recipients:** create/verify (name-enquiry per method), list, per-corridor identifier validation.
- **KYC/EDD:** status, progressive submission, Sumsub result verification, escalation state.
- **Transfers:** initiate (**idempotency-key required**), status (canonical, poll + push), history, retry, receipt.
- **Payments:** method registration, PSP/open-banking/Apple/Google Pay token intake.
- **Wallet:** balance, top-up, ledger.
- **Promotions & rewards:** eligibility + state.
- **Notifications:** push token registration + delivery.

Each of these maps to a Zod schema from Phase 0, so "plan the backend" starts from a concrete, client-validated contract rather than a blank page.

---

*Companion to "Social Remit — Platform Architecture & Engineering Strategy v2.0" and the "Consolidated Project Brief." Same Stage 1/2/3 runway, same ownership/horizon framing, same no-forced-rewrites thesis — applied to the client application.*
