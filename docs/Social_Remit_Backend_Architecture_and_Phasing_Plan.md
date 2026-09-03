# Social Remit / EMONI — Backend Architecture & Phasing Plan
### v1.0 — companion to the Frontend plan, the Platform Architecture Strategy v2.0, and the Consolidated Project Brief

---

## 0. Purpose & how this fits

The platform doc (v2.0) already names the backend *tech* (Node/NestJS, Mongo/Postgres, BullMQ, Redis, Kong, Kubernetes) and the Stage 1/2/3 scale runway. This document does the next layer down: it turns that stack into an **actual service design** — which services exist, what data they own, how a transfer flows through them, how the payout partners plug in, and how money is kept correct — phased against the same runway.

It is built **contract-first from the Frontend plan's §10 API surface**, so the two plans meet in the middle rather than being invented twice. Anywhere a design choice traces back to a risk already flagged in the project brief (the Falcon `Paidx` reconciliation gap, Velocity's `Payout` vs `Remittance` direction, missing webhook signatures, rate-lock expiry, undocumented SLAs), that link is called out — those risks *are* the backend requirements.

Plain-English definitions of every acronym (KYC, EDD, AML, MTO, FX, settlement, ledger, idempotency, …) are in **Appendix A**. Read that first if any term is unfamiliar; the body assumes it.

---

## 1. The money spine — the one thing a remittance backend must get right

Most of what follows is standard service design. But a money-movement platform has a single non-negotiable spine that everything else hangs off:

> **Every penny that enters, moves, or leaves the system is recorded in an immutable double-entry ledger, and every external money action is idempotent and reconciled against what the partner actually did.**

If that spine is right, you can lose a server, retry a failed request, or get a confusing status from a partner and still always answer "where is this customer's money?" correctly. If it's wrong, you get silent ledger drift — exactly the class of bug the brief already spotted in Falcon's `Paidx` state (partner says *paid*, your books don't yet agree).

This is the **load-bearing wall** of the whole backend: the transfer saga (§4) and the MTO adapters (§5) both assume the ledger underneath them is already correct — a perfect saga on a wrong ledger just moves wrong numbers around reliably. It's also the one piece that can't be safely retrofitted, because nearly every service ends up writing to it, so its shape has to be right *before* Phase 1 feature code lands. Hence the depth here, and hence the rule that this spine ships in Phase 1, not later.

### 1.1 The core invariant

Everything below serves one property that must hold at all times, enforced by the system rather than by discipline:

> **The sum of every journal entry is always zero, and no committed entry is ever changed.**

If that holds, drift is not *unlikely* — it is *impossible*, because an unbalanced or mutated state literally cannot be written.

### 1.2 The ledger

**Double-entry, append-only.** Every money movement is written as a set of journal lines that sum to zero — a debit to where money went, a credit to where it came from. Entries are immutable: a correction is a **new reversing entry**, never an edit or delete. This is what lets the books be audited and lets any balance be re-derived by replaying history.

**Money is never a float.** Every amount is an integer in the currency's minor unit (pence, kobo, pesewa) plus an ISO currency code, wrapped in a `Money` value object that refuses cross-currency arithmetic. Floating-point rounding on money is a silent-corruption bug generator; it is banned at the type level.

**Chart of accounts (the minimum for Phase 1).** Accounts are typed and scoped; balances are derived from entries, never stored as a mutable field.

| Account | Type | Purpose |
|---|---|---|
| Pay-in Clearing (per currency) | Asset | money received from the sender, not yet allocated |
| Customer Payable (per user, per currency) | Liability | what we owe the customer / hold on their behalf |
| Fee Revenue (per currency) | Revenue | transfer fees earned |
| FX-Margin Revenue (per currency) | Revenue | the spread between the rate we source and the rate we quote |
| Partner Float · `{MTO}` (per currency) | Asset | prefunded balance held with each payout partner (BigPay GHS, Velocity NGN, …) |
| Payout Clearing (per currency) | Asset/Contra | payout submitted to a partner, not yet reconciled |
| Settlement / Suspense (per currency) | Clearing | matched-and-settled position; landing zone for reconciliation |

**Worked example — a £100 → Ghana send** (fee £2.50, quoted 17.45 GHS/GBP, sourced at 17.60). This is the exact sequence that hits the books, tied to the lifecycle in §4:

```
Step (saga state)          Debit                          Credit                          Amount
─────────────────────────────────────────────────────────────────────────────────────────────
1  FUNDS_RESERVED           Pay-in Clearing (GBP)          Customer Payable (GBP)          102.50
   (customer pay-in captured — money is in, fully owed back to the customer)

2  FUNDS_RESERVED           Customer Payable (GBP)         Fee Revenue (GBP)                 2.50
   (recognise the fee — earned the moment funds are reserved)

3  ROUTING → PAYOUT_SUBMITTED
   FX conversion:           Customer Payable (GBP)         Pay-in Clearing (GBP)           100.00
   book the margin:         Pay-in Clearing (GBP)          FX-Margin Revenue (GBP)      (the spread)
   payout leg (GHS side):   Payout Clearing (GHS)          Partner Float · BigPay (GHS)  1,745.00
   (recipient's money leaves partner float; this is why float must be monitored — §5)

4  RECONCILED               Partner Float · BigPay (GHS)   Payout Clearing (GHS)         1,745.00
   settle:                  Payout Clearing (GHS)          Settlement (GHS)              1,745.00
   (only booked once the partner's statement matches — see §1.4; this is the `Paidx` resolution)
```

Every step sums to zero. Fee and FX margin land in revenue accounts the moment they're earned. The recipient's funds move out of **partner float**, making float depletion a first-class, monitored signal rather than a surprise payout failure. And crucially, **"paid to the recipient" (end of step 3) and "settled on our books" (step 4) are different ledger states** — the system never conflates them, which is the entire answer to the drift risk.

*(The precise FX booking method — whether margin is recognised at conversion as above, or FX positions are held and revalued — is decision #2's sibling and worth a deliberate call; the invariant that the spread is captured **explicitly, never implied** holds regardless.)*

**How the invariant is enforced (Postgres, Phase 1):**

- A **balanced-transaction constraint** — entries are written only via a stored procedure / transaction that rejects any journal whose lines don't sum to zero per currency. Application code cannot write a raw entry.
- **True immutability** — `REVOKE UPDATE, DELETE` on the journal tables; append-only by permission, not by convention. Corrections are reversing entries.
- **Serializable isolation** on money-writing paths, so two concurrent operations on the same account can't interleave into an inconsistent balance.
- **Balances are computed** (materialised incrementally for read performance, but always re-derivable from entries), so a cached balance can never silently disagree with history.

### 1.3 Idempotency (two independent layers)

A retried request must never create a second transfer or a second payout. This is enforced twice, on the two boundaries that matter:

1. **Client → platform.** The app mints **one idempotency key per transfer attempt** (Frontend §3.4) and sends it as a header. The Transfer service stores the key against the request's outcome; a retry with the same key returns the **stored result** instead of re-executing. A double-tap, a flaky-network retry, or an app relaunch mid-request cannot spawn a duplicate transfer.
2. **Platform → partner.** Each `PayoutAttempt` carries its **own** partner-facing idempotency reference, so a re-submitted payout can't double-pay on the MTO side either. Where a partner's API has **no** idempotency field (a real possibility given the thin docs the brief flags), the adapter **calls `getStatus` before re-submitting** — check-then-act — so it never blindly re-sends.

The ledger is the backstop under both: journal writes are keyed to `{transferId, step}`, so even a replayed saga step cannot double-book.

### 1.4 Reconciliation — making `Paidx` a non-event

The brief's sharpest risk is Falcon's `Paidx`: the partner says *paid*, but it isn't yet debited/matched on our side. The ledger design above already separates *paid-to-recipient* from *settled-internally* (steps 3 vs 4); reconciliation is the process that closes the gap, on a schedule, with a defined outcome for every case.

- **Ingestion.** A daily (or per-cycle) job ingests each partner's settlement statement — the format and SLA of which is an explicit open question per partner (§11.5; the brief notes Falcon documents no SLA).
- **Matching.** Each payout is matched by `partnerRef + amount + currency + date` against the `Payout Clearing` entries. A clean match books step 4 (settlement) and moves the money out of clearing.
- **Breaks (the exceptions that must never be silent).** Anything that doesn't cleanly match becomes a **flagged break** with an owned resolution path, surfaced to Ops — not a number quietly absorbed:

| Break type | Meaning | Resolution |
|---|---|---|
| Partner-paid, no platform record | statement shows a payout we have no `PayoutAttempt` for | investigate (possible partner error or lost callback); do **not** auto-book |
| Platform-paid, partner-missing | we show submitted/paid, statement omits it | poll `getStatus`; if still absent past SLA, escalate |
| Amount / FX mismatch | matched ref, different amount | hold in suspense; reconcile the difference before settling |
| Duplicate | two statement lines for one payout | de-dupe against the partner idempotency ref (§1.3) |
| Stuck `Paidx` / `Processing` | partner intermediate state past threshold | timed escalation to the payout Ops queue |

- **Result:** nothing moves float or revenue to a settled state without a matched statement line. The transfer can be *paid to the customer* and *unsettled internally* at the same time — and that distinction is **visible in the ledger**, never hidden. That is the whole defence against drift.

### 1.5 Build vs. buy — resolved recommendation

**Recommendation: build on Postgres for Phase 1, behind a clean `Ledger` interface, and only if the financial invariants in §1.2 are enforced at the database level** — the balanced-transaction constraint, the `REVOKE UPDATE/DELETE` immutability, and serializable isolation on money paths. Keep every caller behind a narrow interface (`postEntry`, `getBalance`, `reverse`) so the implementation can be swapped for a purpose-built ledger (e.g. TigerBeetle, Formance) at Stage 2 with **zero caller changes**. This keeps the Phase 1 stack simple and honours the no-rewrites thesis.

**The honest caveat:** hand-rolling financial-grade invariants is the single worst place to carry a subtle bug. If the team has *any* hesitation about getting those database constraints exactly right, **adopt a purpose-built ledger from Day 1** — this is the one area where "buy" is often the safer default even at low volume. The interface boundary is what makes either choice reversible; the invariant is what makes either choice safe.

---

## 2. Service decomposition

Start as a **modular monolith** (NestJS modules with hard internal boundaries and separate schemas), not microservices. This matches the platform doc's Stage 1 "monolith-lean" and avoids distributed-systems pain before there's scale to justify it. Each module below is designed so it can be **extracted into its own service later** (Stage 2/3) without a rewrite — same boundary, different deployment.

| # | Service / module | Owns (data) | Responsibility | Extract at |
|---|---|---|---|---|
| 1 | **Identity & Auth** | users, sessions, devices, credentials | signup/login, OTP, token issue/refresh, biometric-token binding, social sign-in exchange, device registration | Stage 2 |
| 2 | **Compliance** (KYC/AML) | KYC profiles, cases, screening results, MLRO queue | KYC orchestration, EDD escalation, Sumsub result verification, AML + sanctions screening, case management | Stage 2 |
| 3 | **Corridor & Config** | corridors, delivery methods, recipient schemas, limits, fee rules, tenant config | the config registry the app consumes; versioned; multi-tenant/white-label overrides | Stage 2 |
| 4 | **Pricing / FX & Fee** | rate snapshots, quotes, fee rules, promos, margins | multi-provider rate ingestion, **quote issuance with `rateId` + expiry**, fee/limit/promo calculation | Stage 2 |
| 5 | **Recipient** | recipients, validation results | recipient CRUD, name-enquiry/validation per corridor+method | Stage 2 |
| 6 | **Transfer Orchestration** | transfers, saga state | the transfer lifecycle state machine (§4), idempotency, compensation | Stage 3 |
| 7 | **Ledger** | accounts, journal entries, balances | immutable double-entry record of every money movement | Stage 2 (carefully) |
| 8 | **Pay-in (Payments)** | payment intents, PSP tokens | card (PSP), open banking, Apple/Google Pay, wallet debit; authorise/capture | Stage 2 |
| 9 | **Payout / Routing** | payout attempts, provider health, float balances | the MTO adapter hub + intelligent routing (§5), failover, float monitoring | Stage 2 |
| 10 | **Reconciliation & Settlement** | partner statements, matches, settlement runs | ingest partner files, match against ledger, resolve `Paidx`, run T+0/1/2 settlement | Stage 3 |
| 11 | **Notification** | notification log, inbound webhook events | push/SMS/email out; **verified** inbound MTO webhook receiver | Stage 2 |
| 12 | **Wallet** | wallet balances, top-ups | customer stored-value balance, top-up (ties to Ledger) | Stage 2 |
| 13 | **Rewards / Promotions** | promo definitions, eligibility, redemptions | welcome discount, loyalty, eligibility checks | Stage 3 |
| 14 | **Read / Reporting** | denormalised read models | transaction history, dashboards, analytics feeds | Stage 3 (CQRS) |

The API Gateway (Kong, per the platform doc) sits in front; each dashboard type (MLRO / NGO / B2B / Admin) is an authorised consumer, not a separate backend.

---

## 3. Core data model (the entities that matter)

The relationships below are the minimum that keeps money correct. (Types simplified; every money field is an integer minor-unit amount + currency — **never a float**.) The full picture — all 30 entities and their cardinalities — is in the companion **`Social_Remit_ER_Diagram.mermaid`** artifact; this section narrates the parts that carry the most weight.

- **User** → has one **KycProfile** (status, level, latest screening), many **Recipients**, many **Transfers**, one **Wallet**.
- **KycProfile** — `status` (not_started / in_progress / verified / review / rejected), `level` (basic / EDD), `sourceOfFunds`, `sourceOfWealth`, screening history. This is the **single routing gate** the frontend already treats it as.
- **Corridor** — `{ from, to, currency, deliveryMethods[], recipientSchemaPerMethod, limits, feeModelRef, requiredKycLevel, tenantOverrides }`. **A corridor is data, not code** — adding Kenya/M-Pesa or Ghana cash-pickup is a config row, mirroring the frontend's config-driven registry and the platform's "plugin" thesis.
- **Quote** — `{ rateId, corridor, sendAmount, receiveAmount, fxRate, fee, margin, expiresAt }`. Immutable; the transfer references the quote it was priced on, so the price the customer saw is the price that settles.
- **Recipient** — identity + delivery details, validated per method (bank / mobile wallet / cash pickup / account credit).
- **Transfer** — the saga root: `{ id, userId, quoteId, recipientId, corridor, canonicalStatus, idempotencyKey, payInRef, payoutRef, ledgerRefs[] }`.
- **Ledger: Account + JournalEntry** — double-entry. Accounts include: customer payable, fee revenue, FX-margin revenue, partner float (one per MTO/corridor), settlement clearing. Every state change writes **balanced** journal entries; entries are append-only and never mutated.
- **PayInIntent / PayoutAttempt** — the external legs, each idempotent, each mapping partner refs back to the transfer.

---

## 4. The transfer lifecycle (server-side saga)

This is the backbone. The frontend has a *client* state machine for the UX; the backend has the **authoritative** one that actually moves money. Each step is idempotent and has a compensating action if a later step fails.

```
CREATED
  → SCREENING            (AML + sanctions in the critical path — every transfer, no exceptions)
      ├─ pass → PRICED   (quote locked: rateId + expiry captured)
      └─ flag → REVIEW   (MLRO queue) → pass → PRICED  |  reject → REJECTED
  → PAY_IN_PENDING       (authorise customer's money in; idempotency key minted)
      └─ captured → FUNDS_RESERVED   (ledger: debit customer pay-in, credit clearing)
  → ROUTING              (pick MTO by corridor+method+health+cost; check float)
  → PAYOUT_SUBMITTED     (adapter.initiatePayout, partner idempotency ref stored)
  → PAYOUT_PROCESSING    (partner working; status via webhook + polling)
  → PAID_ON_PARTNER      (partner says paid — the Falcon `Paidx` moment)
  → RECONCILED           (matched against partner statement; ledger settles float)
  → COMPLETED
```

Failure/compensation paths (the part demos skip and production can't):

- **Pay-in fails** after screening → `FAILED`, no payout attempted, nothing to unwind.
- **Payout submit fails / partner rejects / MoMo outage** → refund path: reverse the reservation, credit customer back, surface the outage (the frontend's `momo-outage-gate` / `secure-release-hold` states map here). Routing may **fail over** to an alternate provider for the same corridor+method before giving up.
- **`PAID_ON_PARTNER` but not yet `RECONCILED`** → this is the ledger-drift risk. The money is out on the partner's books but not confirmed on ours. Reconciliation (§6) closes it; until it does, the transfer is *paid to customer* but *unsettled internally*, and that distinction is visible in the ledger, never hidden.

**Idempotency everywhere it touches money:** the client sends an idempotency key on transfer initiation (Frontend §3.4); the backend reuses it so a retried request never double-charges or double-pays, and every `PayoutAttempt` carries a partner-facing idempotency ref so a retried payout submission can't double-send on the partner side either.

---

## 5. MTO adapter hub & intelligent routing

This is the literal implementation of the platform doc's "each country's payout partner is a plugin behind a central routing engine."

**One interface, many adapters.** Every payout partner implements the same contract:

```
interface PayoutProvider {
  validateRecipient(recipient, method): ValidationResult   // name-enquiry
  quoteCapabilities(corridor, method): Capability          // supported? limits?
  initiatePayout(transfer, idempotencyRef): PayoutRef
  getStatus(payoutRef): CanonicalStatus                    // pull side
  handleCallback(signedPayload): CanonicalStatus           // push side, verified
  checkFloat(): FloatBalance
}
```

Adapters to build, in corridor-priority order from the strategy sheet: **BigPay** (Ghana — wallet + bank), **Velocity** and **CSLPay** (Nigeria), **M-Pesa** (Kenya/Tanzania/DRC/Mozambique), **Mukuru** (South Africa/Zambia/Malawi — cash pickup + bank), **Pixel Innovations** (Senegal), **MoneyMatch** (India/Bangladesh/Pakistan/Sri Lanka/Indonesia — cash/account/wallet).

Each adapter absorbs the partner's quirks so the rest of the system never sees them:

- **Auth normalisation.** BigPay = bearer + IP allowlist; Velocity adds **HMAC request signing**. The adapter holds each partner's scheme; the core just calls `initiatePayout`.
- **Status enrichment.** Falcon exposes ~19 states incl. `Paidx`; Velocity's documented enum is thin (`Pending`/`Completed`). The adapter maps partner states → **one canonical status** and, for thin partners, **polls** to fill the gaps the docs don't guarantee.
- **Direction guard (Velocity).** The brief flags that Velocity's `Remittance` type moves money *out of* Nigeria while `Payout` moves it *in*. The adapter hard-codes the correct inbound endpoint and asserts direction, so the wrong-endpoint bug the brief warned about can't reach production.
- **Float awareness.** Velocity uses an NGN prefunded wallet; BigPay settles GHS-side. The adapter reports float so routing won't send a payout that would fail for insufficient partner balance, and Ops gets a top-up alert before that happens.

**The routing engine** picks a provider per `corridor + method` using: capability match → health check → float sufficiency → cost (the sheet has per-partner fees) → configured preference, with **automatic failover** to an alternate for the same corridor+method (e.g. Nigeria has both Velocity and CSLPay). Neither MTO documents a DR/failover posture — so the platform provides it at this layer, which is the backup-routing gap the brief called out.

---

## 6. Compliance flow (KYC / EDD / AML) — in the critical path

Compliance is not a side-check; **no transfer reaches payout without passing screening.** (Plain-English definitions in Appendix A.)

- **KYC** runs progressively: basic details → address → (risk-based) occupation → verification via **Sumsub** (the frontend launches the SDK; the backend **verifies the result server-side** — never trusts the client's word for it).
- **Risk decision** determines escalation. Thresholds mirror the frontend's fast-feedback copy but the **server is the source of truth**: high amount, high-risk corridor (e.g. Nigeria/Pakistan per the code), new corridor, or a sanctions hint pushes the case to **EDD** — which collects **source of funds** and **source of wealth**, and may require government ID + selfie/liveness.
- **AML + sanctions screening** sits in the transfer saga (`SCREENING` step), on **every** transfer. A hit routes to the **MLRO** review queue (a real human workflow with an audit trail), not a silent pass/fail.
- **Provenance for partners.** Falcon exposes explicit compliance states (`ComplianceChecked`/`ComplianceFailed`); Velocity supplies KYC inputs (BVN, `kycLevel`) but no compliance-specific transaction state — an open question for their team, and a reason the platform keeps its **own** compliance state rather than depending on either partner's.

Everything here is auditable and versioned, which is what the platform doc's new Security & Compliance section needs to satisfy banking/PSP and regulatory review.

---

## 7. Eventing, webhooks & async

- **Async jobs** start on **BullMQ** (Stage 1) and graduate to **Kafka** (Stage 2/3) exactly on the platform doc's trigger. Screening, payout submission, status polling, notifications, and reconciliation all run as jobs so the request path stays fast.
- **Inbound MTO webhooks are treated as untrusted.** The brief flags that *neither* partner documents webhook signature verification, and that Velocity's signing is keyed by the access token rather than an independent secret. So: the Notification service **verifies every inbound callback**, and — critically — **a webhook never moves money on its own**. It's a *hint* that triggers a **pull** (`getStatus`) which is what the ledger actually trusts. That closes the spoofing risk without depending on partner hygiene.
- **Push + polling to the customer.** Transfer status reaches the app via push (FCM/APNs) with a polling fallback, because partner webhooks aren't guaranteed.

---

## 8. Security, compliance posture & data residency

Fills the gaps the platform doc's §3.7 flagged, from the backend side:

- **Encryption:** TLS 1.3 in transit, AES-256 at rest; field-level encryption for PII and secrets in a managed vault (KMS / Secrets Manager).
- **PCI scope minimisation:** card data is **tokenised by the PSP**; the backend **never stores or sees a raw PAN**, keeping the platform in the lightest PCI-DSS tier.
- **RBAC** per service and per dashboard type (MLRO sees compliance cases; B2B partner sees only their own traffic), with least-privilege service-to-service auth (moving to mTLS/Istio at Stage 3).
- **Data residency:** Nigeria and India (and others) have data-localisation expectations. The corridor config carries a residency flag; the multi-region DB/S3 plan in the platform doc must satisfy each jurisdiction, and the client caching policy (Frontend §3.8) must agree.
- **Immutable audit log** for every compliance decision, ledger entry, and admin action.

---

## 9. API surface (fulfilling Frontend §10)

The backend serves exactly the contract the app was built against — no more, no less at Phase 1. Grouped by service:

- **Auth:** signup, login, OTP issue/verify, token issue/refresh, biometric-token binding, social sign-in exchange, device register.
- **Config:** get corridors + delivery methods + recipient schemas + limits + fees (cacheable, versioned).
- **Pricing:** create quote (`rateId` + expiry), re-quote on expiry.
- **Recipients:** create, validate (name-enquiry), list.
- **Compliance:** get KYC status, submit progressive KYC, verify Sumsub result, EDD submission, escalation state.
- **Transfers:** initiate (**idempotency key required**), get status (canonical), history, retry, receipt.
- **Pay-in:** register method, intake PSP / open-banking / Apple / Google Pay token, authorise/capture.
- **Wallet:** balance, top-up, ledger view.
- **Promotions:** eligibility, redemption state.
- **Notifications:** register push token; (internal) receive verified MTO webhook.

Contract-first: generate the OpenAPI spec and seed it from the frontend's Zod schemas so the two can't drift, then generate server types from it.

---

## 10. Phased roadmap (same Stage 1/2/3 runway)

Defined by exit criteria, not dates — calendar estimates attach once team and priority are set (same caveat as the other two docs).

### Phase 0 — Foundation *(precedes features)*
Modular-monolith skeleton (NestJS modules + per-module schema), API gateway, secrets/KMS, event bus (BullMQ), **the ledger core** (accounts + balanced journal entries), auth service, config-service seed, contract-first OpenAPI from the frontend schemas, observability (structured logs, metrics, tracing), CI/CD.
**Exit:** a request can authenticate, a quote can be issued, and a hand-crafted money movement writes balanced double-entry rows.

### Phase 1 — Ghana / BigPay end-to-end *(Stage 1)*
Auth hardened; **KYC (Sumsub) + AML/sanctions screening** in the saga; single-provider FX quotes with rate-lock; one pay-in method (open banking *or* card, PSP-tokenised); the **transfer saga** with idempotency + compensation; **BigPay payout adapter** (wallet + bank); basic reconciliation; push + polling status; the ledger recording every leg.
**Exit:** a real UK→Ghana transfer completes, screened, idempotent, fully ledgered, and reconcilable — the money spine (§1) is proven.

### Phase 2 — Breadth & resilience *(Stage 2)*
**Velocity + CSLPay (Nigeria)** with the direction guard and HMAC; **M-Pesa (Kenya)**; the **routing engine** with health checks, float monitoring, and failover; **cash-pickup + account-credit** payout types; **EDD** flow; **wallet + top-up**; reconciliation hardened to resolve `Paidx`; settlement cycles (T+0/1/2); multi-provider FX with failover; BullMQ→Kafka where volume triggers it.
**Exit:** 3–4 corridors and all four delivery types live from config; a corridor is onboarded as config + an adapter, not a core change; ledger drift is detected and reconciled, not discovered late.

### Phase 3 — Scale & platform *(Stage 3)*
Event-driven (Kafka + CQRS/DDD) where it earns its keep; multi-region + data-residency compliance; **config-driven corridor onboarding** (MoneyMatch Asia wave); **B2B API + SaaS billing**; **white-label multi-tenant** config; **ML fraud scoring** replacing interim rules; marketplace/upsell verticals; service extraction from the monolith along the boundaries set in §2.
**Exit:** a new corridor, a new B2B partner, or a white-label tenant ships from config with no core rewrite — the backend half of "50M users, no core rebuilds."

---

## 11. Open decisions for the team

1. **PSP + open-banking vendors** (pay-in side) — determines Phase 1 payment integration.
2. ~~**Ledger: build vs. buy**~~ — **resolved in §1.5:** build on Postgres for Phase 1 behind a clean `Ledger` interface *only if* the §1.2 invariants are enforced at the DB level; otherwise adopt a purpose-built ledger from Day 1. The one live sub-question is the **FX booking method** (recognise margin at conversion vs. hold and revalue FX positions) — decide before Phase 1.
3. **Screening vendor** for AML/sanctions (separate from Sumsub's IDV) — who provides the sanctions/PEP lists.
4. **Rules duplication policy** — how much pricing/risk/KYC logic the client may replicate for UX vs. always defer to server (server stays source of truth).
5. **Reconciliation inputs** — what format each MTO provides settlement statements in, and the SLA for them (the brief notes Falcon has no documented SLA; this needs direct confirmation).
6. **Data-residency map** — the definitive list of which corridors require in-country storage of what, feeding the multi-region plan.

---

## 12. Unified build sequence (frontend + backend, one roadmap)

The two plans phase in lockstep, but *within* each phase the work is dependency-ordered, not simultaneous. This section is the single "what to build in what order" view. The rule that makes it work: **build contract-first.** The API contract (OpenAPI, seeded from the frontend's Zod schemas) is agreed before feature code, so the frontend builds against a mock (MSW) while the backend builds the real services, and the two converge on the same interface instead of waiting on each other.

### 12.1 The three linchpins

Everything sequences around these:

1. **The API contract** — the unblock-everything gate. Until it's agreed, neither side can move confidently; once agreed, both move in parallel.
2. **The ledger core (§1)** — the backend long pole. It's on the critical path for anything that moves money, and it can't be retrofitted, so it starts on day one of Phase 0 and must land before the transfer saga.
3. **The config service (corridors)** — unblocks the frontend's config-driven recipient/delivery forms. Until corridors are data the client can fetch, the send flow can't be built properly for more than a hardcoded corridor.

### 12.2 Interim track (parallel, non-blocking) — the PWA demo

Separately from the production build, the **existing React prototype is wrapped as an installable PWA** for demos and stakeholder preview (see the PWA asset pack delivered alongside these docs). It is a **throwaway shell**: no shared code with the production RN app, no backend dependency (it keeps its mock data), and it must not become a maintenance burden or a second source of truth. Production remains React Native per Decision 0 (Frontend §2). Treat this as a marketing/investor artefact that happens to be installable, running in parallel with Phase 0 and retired when the RN app ships.

### 12.3 Phase 0 — Foundation (mostly parallel)

| Backend | Unblocks → Frontend | Parallel? |
|---|---|---|
| Agree **OpenAPI contract** (from FE Zod schemas) | everything downstream | **gate — do first** |
| Modular-monolith skeleton, API gateway, secrets/KMS, event bus, observability, CI | — | ∥ with FE scaffold |
| **Ledger core** (accounts + balanced entries + §1.2 invariants) | — (backend long pole) | ∥ but start day one |
| Auth service skeleton | RN auth screens can target real endpoints early | ∥ |
| Config-service seed (Ghana corridor as data) | config-driven corridor/recipient forms | ∥ |
| — | RN/Expo scaffold, module structure, design tokens, router+adapter, **API client + React Query + MSW**, secure storage, domain slice (pricing + corridors) | ∥ with BE |

**Joint exit:** contract agreed; a hand-crafted money movement writes balanced double-entry rows (BE); one screen runs end-to-end through the new router + data layer against MSW (FE); the PWA demo is installable.

### 12.4 Phase 1 — Ghana / BigPay end-to-end (serial dependency chain)

Build in this order; the frontend builds each piece against MSW first, then switches to the real endpoint as the backend lands it:

1. **Auth** (BE service ↔ FE onboarding, secure PIN/biometric) — no upstream deps, start immediately.
2. **Config → corridors** (BE) → **FE corridor + config-driven recipient forms** (incl. cash-pickup-ready schema even if GH launches wallet-first).
3. **Pricing / quote with `rateId` + expiry** (BE) → **FE amount screen + rate-lock/expiry handling** (`fx-refresh`).
4. **KYC + AML/sanctions screening + Sumsub verify** (BE) → **FE progressive KYC flow + Sumsub SDK**.
5. **Transfer saga + ledger legs + one pay-in (PSP-tokenised) + BigPay payout adapter + basic reconciliation** (BE) → **FE send-money state machine + status via push/polling**. *This is the convergence point:* the send flow only becomes truly end-to-end once the saga + ledger + payout exist; until then FE runs it on MSW.

**Joint exit:** a real UK→Ghana transfer completes — screened, idempotent, fully ledgered, reconcilable — with both sides on the real API and the send state deleted from the old `App.tsx`.

### 12.5 Phase 2 — Breadth & resilience (parallelises again by corridor/feature)

Each row is an independent-ish workstream once Phase 1's spine exists:

| Workstream | Backend | Frontend |
|---|---|---|
| Nigeria | Velocity + CSLPay adapters (direction guard, HMAC) | corridor config consumed automatically |
| Kenya | M-Pesa adapter | ″ |
| Resilience | routing engine (health, float, failover) | outage/hold states (`momo-outage-gate`, `secure-release-hold`) |
| Delivery types | cash-pickup + account-credit payout | recipient schemas for both |
| Compliance | EDD flow + case mgmt | EDD screens |
| Wallet | wallet + ledger integration | top-up flow |
| Money integrity | reconciliation hardened (`Paidx`), settlement T+0/1/2, multi-provider FX | — |

**Joint exit:** 3–4 corridors and all four delivery types live from config; a new corridor is a config PR + an adapter, not a core change.

### 12.6 Phase 3 — Scale & platform

Event-driven/CQRS where it earns its keep; multi-region + data residency; config-driven Asia corridor onboarding (MoneyMatch); B2B API + SaaS billing; white-label multi-tenant; ML fraud scoring; **the React web dashboard suite** (MLRO/NGO/B2B/Admin) on the shared core; service extraction along the §2 boundaries.

**Joint exit:** a new corridor, a new B2B partner, a white-label tenant, or a new stakeholder dashboard ships from config with no core rewrite — both halves of "50M users, no core rebuilds."

### 12.7 One-line critical path

> Contract agreed → (ledger core ∥ auth ∥ config) → quote → KYC/screening → saga+payout+reconciliation → **Ghana live** → corridors & delivery types fan out from config → scale/platform.

---

## Appendix A — Plain-English glossary

*The jargon in these docs, in normal language.*

- **KYC — "Know Your Customer."** The legal requirement to confirm a customer really is who they say they are before letting them move money — like showing your passport to open a bank account. In the app it's the name/date-of-birth/address/photo-ID step.
- **EDD — "Enhanced Due Diligence."** A deeper level of checking that kicks in when something looks higher-risk — a large amount, a risky destination, or unclear money origins. On top of basic KYC, you're asked *where this money came from* and *how you built your wealth*, sometimes with documents.
- **AML — "Anti-Money Laundering."** The whole body of rules and checks designed to stop criminals from disguising dirty money as clean. KYC and EDD are tools *inside* AML.
- **Sanctions screening.** Checking a person's name against government "do-not-deal-with" lists (terrorists, sanctioned people/countries) before sending their money. A match stops the transfer for a human to review.
- **PEP — "Politically Exposed Person."** Someone in a position (a politician, senior official) that carries higher corruption/bribery risk, so they get extra scrutiny.
- **Source of funds vs. source of wealth.** *Source of funds* = where this specific money came from (this salary, this house sale). *Source of wealth* = how you built up your overall wealth (career, business, inheritance).
- **Liveness check.** During ID verification, confirming there's a real, live person in front of the camera (blink, turn your head) rather than a photo held up to it — anti-spoofing.
- **MLRO — "Money Laundering Reporting Officer."** The specific person at a financial firm legally responsible for overseeing AML and reporting suspicious activity to the regulator. They work the review queue.
- **MTO — "Money Transfer Operator."** The local partner in the destination country that actually delivers the money to the recipient's bank or mobile wallet. BigPay in Ghana, Velocity in Nigeria.
- **Corridor.** A specific "from country → to country" money route, e.g. UK → Ghana. Each corridor has its own partners, rules, currency, and pricing.
- **FX — "Foreign Exchange."** Converting one currency to another (GBP → GHS) and the rate used to do it. **FX margin** is the small spread the platform keeps on that conversion — a revenue source.
- **Rate lock / `rateId` + expiry.** When a customer is quoted a rate, it's held ("locked") for a short window so the price can't move mid-transfer. After it expires, a fresh quote is needed.
- **Pay-in vs. payout.** *Pay-in* = taking the sender's money (card, bank, wallet). *Payout* = delivering money to the recipient via the MTO. Two different partners, two different sides.
- **PSP — "Payment Service Provider."** The company that processes the sender's card/bank payment on the pay-in side (think Stripe-style).
- **Open banking.** Paying straight from your bank account by securely authorising your bank in-app, instead of typing card numbers.
- **Prefunded wallet / float.** A pot of local currency the platform keeps parked with a payout partner so recipients can be paid instantly. If the float runs low and isn't topped up, payouts fail — so it's actively monitored.
- **Settlement / T+0, T+1, T+2.** When the money actually changes hands between the businesses behind the scenes. "T+1" means one business day after the transaction.
- **Ledger / double-entry.** The financial system of record. Every movement is written twice — where it came from and where it went — so the books always balance and you can always answer "where is this money?"
- **Reconciliation.** The back-office matching of "what we think happened" against "what the partner or bank says happened," to catch discrepancies. The `Paidx` issue is exactly a reconciliation gap: the partner says *paid*, our books don't yet agree.
- **Idempotency.** A safeguard so that if the same "send money" request is accidentally sent twice (bad signal, double-tap, retry), it only happens **once** — never a double charge or double payment.
- **SNPL — "Send Now, Pay Later."** Letting a customer send money now and pay for it slightly later — a small credit product, a potential revenue line.
- **BVN — "Bank Verification Number."** A unique ID Nigerians have across their banks; used to verify a Nigerian recipient/customer.
- **IBAN / SWIFT / ABA / IFSC.** Standard bank-account/routing identifiers used in different countries (Europe, international, US, India) to send to the right account.
- **HMAC request signing.** A way for the sender of an API request to prove the message wasn't tampered with, using a shared secret to "sign" it. Velocity uses this on top of a token.
- **Saga / compensation.** A way to run a multi-step money process where, if a later step fails, earlier steps are safely undone ("compensated") — e.g. refunding a pay-in if the payout can't be completed.
- **CQRS / DDD / Kafka / Istio.** Scale-stage engineering patterns/tools: splitting reads from writes (CQRS), modelling around business domains (DDD), a high-throughput event backbone (Kafka), and a service-to-service networking layer (Istio). All Stage 2/3 concerns, not Day 1.

---

*Companion to "Social Remit — Frontend Architecture & Phasing Plan," the "Platform Architecture & Engineering Strategy v2.0," and the "Consolidated Project Brief." Same Stage 1/2/3 runway, same no-forced-rewrites thesis — applied to the server side, and built contract-first to meet the frontend in the middle.*
