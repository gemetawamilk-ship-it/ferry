# E-PESANTREN 360 — Vercel Login Fix

This package keeps the Google AI Studio UI and fixes Vercel API routing.

Key deployment files:
- `api/[...path].ts` — Vercel API catch-all for `/api/*`
- `vercel.json` — Vite static output + API function configuration
- `server/auth.ts` — stateless signed demo sessions suitable for serverless invocations

After pushing to GitHub, Vercel should create a new deployment automatically.
Test:
- `https://YOUR-DOMAIN/api/health`
- then login from the homepage.

For production, set `SESSION_SECRET` in Vercel Environment Variables.
