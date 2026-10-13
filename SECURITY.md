# Security Policy

Rentpay handles payment-related workflows. Do not publish credentials, access tokens, passkeys, service-role keys, database URLs, callback secrets, real tenant data, or real payment records.

## Reporting

Do not report vulnerabilities by opening a public issue with exploit details. Contact the repository owner privately.

## Payment integrity requirements

- Never mark a payment confirmed solely because an STK request was accepted.
- Never mark a payment confirmed from a query result code alone without a verified receipt and matching payment evidence.
- Treat callbacks as untrusted until authentication, reference matching, amount matching, and idempotency checks succeed.
- Keep audit events durable and state transitions atomic.
- Do not run migrations against a database until it is positively identified as an isolated test database and its rollback plan is reviewed.
