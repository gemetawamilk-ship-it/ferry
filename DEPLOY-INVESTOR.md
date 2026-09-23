# E-PESANTREN 360 — Investor Demo Deployment

## Status
This package preserves the existing Google AI Studio React/Vite UI and the Phase 1–3.5 application source.

## Important architecture note
The uploaded source contains:
- React + Vite frontend
- Express backend
- in-memory application data/session state
- no `prisma/` directory
- no Prisma/PostgreSQL dependency

Therefore this package is suitable for an **investor demonstration**, but it is NOT yet the final production SaaS database architecture.

## Run
```bash
npm install
npm run build
NODE_ENV=production npm start
```

The server listens on `PORT` (default 3000).

## Investor demo
Use the existing demo accounts shown on the login screen. The existing UI/design is intentionally preserved.

## Before public production
1. Move persistent data to PostgreSQL/Prisma.
2. Move sessions to a persistent/session-safe store.
3. Require secure production secrets.
4. Add HTTPS/reverse proxy, rate limiting, security headers and backups.
