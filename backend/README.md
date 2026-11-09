# AutoStore Backend

Backend REST API untuk marketplace produk digital AutoStore. Dibangun dengan JavaScript (ES Modules), Express, PostgreSQL, dan Prisma ORM.

## Requirements
- Node.js 20+
- PostgreSQL 14+
- npm

## Setup lokal
```bash
cp .env.example .env
# Buat database PostgreSQL bernama autostore, lalu isi DATABASE_URL di .env
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

API berjalan di `http://localhost:4000`. Health check: `GET /health`.
Dokumentasi API: `http://localhost:4000/api-docs`.

## Environment
Lihat `.env.example`. Jangan commit `.env`, API key, JWT secret, callback token, atau kredensial digital stock.

## API v1
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/users/me`
- `GET /api/v1/categories`
- `GET /api/v1/products`
- `GET /api/v1/products/:slug`
- `POST /api/v1/orders` (auth)
- `GET /api/v1/orders` (auth)
- `GET /api/v1/orders/:id` (auth)
- `POST /api/v1/orders/:id/payment` (auth; payment provider adapter)
- `GET /api/v1/orders/:id/delivery` (auth; only completed orders)
- `POST /api/v1/webhooks/xendit` (Xendit callback)
- Admin product/category endpoints under `/api/v1/admin`.

## Payment integration
The Xendit adapter is deliberately isolated in `src/services/payment.service.js`. Configure the credentials and verify the exact API contract against your Xendit account/API version before production. Never trust payment status or amount from the browser. Webhook callback token validation is enabled; use HTTPS in production.

## Digital stock security
`DigitalStock.encryptedPayload` must contain application-level encrypted data. This starter does not include an encryption key-management implementation. Add envelope encryption/KMS and a secure delivery policy before importing real account credentials. Never store digital credentials in plaintext.

## Important before production
- Add refresh-token/session rotation, email verification, password reset, audit logging, and stronger admin provisioning.
- Add inventory reservation expiry worker and idempotent order/payment state transitions.
- Configure rate limits, CORS origins, HTTPS, database backups, monitoring, and secret management.
- Review consumer protection, privacy, tax, and payment-provider requirements.
- Never expose raw provider responses or encrypted stock payloads to clients.

## Collaboration
Use feature branches and pull requests. Frontend should consume `/api/v1`; keep response shapes and API changes documented in PRs.
