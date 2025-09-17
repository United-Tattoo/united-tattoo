# Security, Auth, Headers, Validation, Rate‑Limiting, Secrets

## Authentication & RBAC
- **NextAuth (Auth.js)** mandatory
- Sessions: pick JWT or DB, document choice
- Route/Server Action guards via middleware; role model documented

## Security Headers
- CSP (nonce/hash) + `Referrer-Policy: strict-origin-when-cross-origin`
- `X-Frame-Options: DENY`; `Permissions-Policy` scoped
- COOP/COEP where SharedArrayBuffer needed
- Cookies: HttpOnly, Secure, SameSite=Strict

## Validation
- **Zod everywhere** (server actions, routes, forms)
- `react-hook-form` + zod resolver

## Rate Limiting
- Redis (Upstash/self-hosted)
- Enforce on auth, forms, APIs (middleware/handlers)

## Secrets Policy
- `.env.example` is canonical list; validate at boot (`lib/env.ts` with Zod)
- Use SOPS/Age, 1Password, or Docker secrets; never commit secrets