# Task 28 — Payment Integrity Release Gates

This checklist is a release blocker. Do not close Task 28 until every critical gate has executable evidence from the exact commit under review.

## Required gates

- [ ] Repository contains the complete application source and lockfile; no secrets or real tenant/payment data.
- [ ] Static checks and full regression suite pass on the candidate commit.
- [ ] Production build passes on the candidate commit.
- [ ] Payment confirmation requires authenticated provider evidence, a valid receipt, matching amount/phone/checkout/merchant references, and durable receipt evidence.
- [ ] STK acceptance or a query result code alone never confirms a payment.
- [ ] Callback replay, duplicate receipt, mismatched receipt, forged callback, missing callback, and reversal paths fail safely.
- [ ] Every state transition and audit event are atomic and idempotent.
- [ ] Terminal-state rules are explicit and tested; late provider results cannot silently override terminal outcomes.
- [ ] Reconciliation workers use a durable lease/claim with ownership token, expiry, safe reclaim, and stale-worker protection.
- [ ] Concurrency tests prove one winning transition and one durable status-change audit event.
- [ ] RLS policies and grants prevent anon/authenticated clients from reading or mutating payment and evidence tables.
- [ ] Security-definer RPC ownership, `search_path`, execute grants, schema privileges, and table policies are verified.
- [ ] Migration is repeatable or explicitly guarded, matches the actual baseline schema, and does not duplicate existing indexes.
- [ ] SQL migration, postflight, and concurrency suites pass on a positively identified isolated database.
- [ ] Production rollout and rollback reviewed; no live payment test or production migration used as a test.

## Current integration state

The review branch is `task28/atomic-transition-review`. The repository was initially a README-only scaffold, so the application source must be imported and checked before this checklist can be satisfied. The connected Supabase project has existing payment rows and must be treated as potentially production; it is not an approved test target.

## Fail-closed rule

A blocked or unexecuted gate is not a pass. Do not close Task 28 or unblock Tasks 29–31 until all critical gates are verified against the same candidate commit.
