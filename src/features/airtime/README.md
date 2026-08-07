# feature: airtime

Same structure as `auth` and `send-money`:
```
airtime/
  stores/     # zustand (client state) or xstate (flow state)
  api/        # TanStack Query hooks over the typed api-client
  screens/    # RN screens, rendered by thin route files in /app
  index.ts    # public surface
```
Screens are ported from the MVP prototype (visual layer re-authored in RN; domain logic reused from @sr/domain).
