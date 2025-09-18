# United Tattoo — Brownfield Architecture Document (Focused: Epic B — Booking & Client Management)

This document captures the CURRENT STATE of the United Tattoo codebase relevant to Booking, Consultations, Client Portal, Scheduling, and Deposits. It reflects actual patterns, gaps, technical debt, and constraints so agents can implement Epic B stories practically.

## Document Scope

Focused on areas relevant to: booking flow and consultation routing, appointments, client identity and portal surfaces, file uploads for reference images, scheduling/availability, and deposit UX.

### Change Log

| Date       | Version | Description                                   | Author           |
| ---------- | ------- | --------------------------------------------- | ---------------- |
| 2025-09-18 | 1.0     | Initial brownfield analysis (Booking focus)   | Architect Agent  |

---

## Quick Reference — Key Files and Entry Points

### Booking & Client UI
- app/book/page.tsx → mounts BookingForm
- components/booking-form.tsx → multi-step booking form (client component)
- app/deposit/page.tsx → route entry for deposit page
- components/deposit-page.tsx → deposit UX (marketing/education, no payments wired)

### Core APIs (Route Handlers)
- app/api/appointments/route.ts → GET/POST/PUT/DELETE appointments (auth required)
- app/api/users/route.ts → user listing/creation (auth required)
- app/api/upload/route.ts → file uploads to R2; can append to portfolio (auth required)

### Hooks and Data used by Booking
- hooks/use-file-upload.ts → client-side upload helper (talks to /api/upload)
- data/artists.ts → static artist directory used by BookingForm (local demo data)

### Cross-cutting
- middleware.ts → route gating policy and public route list
- lib/auth.ts → next-auth (JWT), role in token
- lib/db.ts → D1 helpers (getDB) and CRUD for domain entities; also getR2Bucket
- lib/r2-upload.ts → R2 upload manager, helpers
- lib/validations.ts → Zod schemas (forms + domain)

---

## High-Level Architecture (Booking Reality)

- Public booking page at /book renders a multi-step client-only form (components/booking-form.tsx).
- Form uses local state; no server action or API call on submit (console.log only).
- Artists list for selection is sourced from static data (data/artists.ts), not D1.
- Appointments API provides full CRUD with conflict checks, but all methods require authentication (getServerSession).
- Upload API supports uploading images (to R2) and optionally writes portfolio records when artistId provided; also requires authentication.
- Deposit page is present as content/marketing; there is no payment processing integration (Stripe/Square/Afterpay not implemented).

Implication: The live booking UX does not currently create appointments, enforce availability, or take deposits. Most of Epic B exists as scaffolding (APIs, hooks, pages) but lacks a wired end-to-end flow.

---

## Source Tree and Module Organization (Relevant)

```
app/
├── book/page.tsx               # Public booking page
├── deposit/page.tsx            # Public deposit page
├── api/
│   ├── appointments/route.ts   # Appointment CRUD (auth required)
│   ├── upload/route.ts         # File uploads to R2 (auth required)
│   └── users/route.ts          # User find/create (auth required)
components/
├── booking-form.tsx            # Client booking form (multi-step)
├── deposit-page.tsx            # Deposit UX content
hooks/
└── use-file-upload.ts          # Client upload helper (calls /api/upload)
data/
└── artists.ts                  # Static artist list used by BookingForm
lib/
├── auth.ts                     # next-auth (JWT)
├── db.ts                       # D1 access, CRUD helpers
├── r2-upload.ts                # R2 upload manager
├── validations.ts              # Zod schemas (forms/domain)
└── env.ts                      # Zod env validation (not aligned w/ D1/R2 bindings)
```

---

## Booking UI and Behavior (Actual)

File: components/booking-form.tsx

- Client component with 4 steps:
  1) Personal Info (first/last/email/phone/age; allergy flags)
  2) Artist & Scheduling (select artist, preferred date/time, alt date/time)
  3) Tattoo Details (description, size selection w/ static durations/prices, placement, reference images)
  4) Review & Deposit (summary, terms checkboxes, “Submit Booking & Pay Deposit”)
- Artist selection: uses data/artists.ts static array; selects by slug. No DB linkage.
- Scheduling:
  - Preferred date: UI Calendar control (no backend availability check).
  - Preferred time: static timeSlots array (no backend).
  - Alternative date/time: plain inputs; not used downstream.
- Submit handler: handleSubmit logs to console; does not call /api/appointments nor any server action.
- Reference Images: captured via file input; not uploaded. use-file-upload is not used by BookingForm.

File: app/book/page.tsx
- Presents Navigation, BookingForm, Footer. No server code.

Conclusion: Booking UI is aesthetically developed but disconnected from the appointments API and uploads.

---

## Appointments API (Scheduling Reality)

File: app/api/appointments/route.ts

- All methods require an authenticated session: getServerSession(authOptions). Unauthenticated requests receive 401.
- GET: Optional filters (start, end, artistId, status). Joins artists and users tables. Returns list with artist/client names and client email. Ordered ASC by start_time.
- POST: Validates body (local Zod schemas in this route). Performs conflict checks against overlapping times for the same artist (excludes CANCELLED and COMPLETED). Inserts record with status PENDING.
- PUT: Validates partial update, checks existence, performs conflict check on time changes, updates columns dynamically (camelCase→snake_case conversion).
- DELETE: Deletes by id; returns 404 if no rows written.

Notes:
- Using local Zod schemas (not lib/validations.ts); duplication/inconsistency risk.
- Requires auth for all calls; public booking would need either an unauthenticated create path or a separate “request/consultation” flow.
- Conflict logic present; availability table exists in DB, but route does not consult availability policies (e.g., office hours, day-of-week windows). It only checks against other appointments.

---

## Users API (Client Identity Reality)

File: app/api/users/route.ts

- Requires auth to list or create users.
- GET: can fetch all or by email.
- POST: creates user if not exists (role param required).
- No public signup endpoint for clients in this route; auth handling is via next-auth credentials or OAuth in lib/auth.ts (with dev shortcuts).

---

## Upload API (Reference Images Reality)

File: app/api/upload/route.ts

- POST: Requires auth. Validates file (size/type), uploads to R2, and can insert a portfolio image record if artistId provided (used for admin portfolio).
- DELETE: Requires auth; deletes by key (permission TODO).
- GET: Not implemented; placeholder for presigned URLs (501).
- Booking form currently doesn’t call this.

---

## Deposit Page and Payments (Reality)

File: components/deposit-page.tsx

- Marketing-focused content for deposits; provides call-to-action buttons linking back to /book.
- Mentions Square and Stripe but no actual checkout integration nor endpoints.
- Tiered/non-refundable/transferability policies documented as content.

Conclusion: No implemented payment flow, deposit capture, or backend intent storage.

---

## Data and Hooks

- data/artists.ts: static directory of artists (names, bios, images, styles). Used by BookingForm for selection; not sourced from D1 via /api/artists.
- hooks/use-file-upload.ts: generic client-side uploader used in admin flows; validates and posts to /api/upload; simulates progress; not integrated into BookingForm.

---

## Technical Debt and Known Issues (REALITY)

1) End-to-end booking is not wired
- BookingForm does not create appointments or uploads; it logs and stops. No server actions, no API call to POST /api/appointments.

2) Public vs Auth API mismatch
- All appointments and uploads endpoints require authenticated sessions. Public booking (unauthenticated) can’t call them. Missing a public “request” endpoint or lightweight auth/guest token pattern.

3) Artist sourcing mismatch
- Booking uses static data/artists.ts; Admin/DB uses D1. This will diverge and confuse users. No linkage between public selection and real artist IDs in DB.

4) Availability not enforced
- UI uses static time slots; backend only checks conflicts against existing appointments (not availability table or office hours, holidays, per-artist downtime). No service that computes valid slots.

5) Validation duplication/inconsistency
- app/api/appointments/route.ts defines Zod schemas locally; lib/validations.ts defines separate schemas. Potential drift.

6) Deposits/payments unimplemented
- No Stripe/Square integration; no intents, receipts, refunds, or deposit policy enforcement. /deposit is content only.

7) Uploads for reference images
- Booking UI captures FileList but doesn’t upload; /api/upload requires auth and primarily targets portfolio. No dedicated “client attachments” table/type or path.

8) Client portal scope
- PRD requires client accounts, visibility of appointments, reschedule/cancel. No dedicated client portal UI pages exist; middleware allows many public routes but portal not present.

9) Notifications and calendar sync
- No email/SMS notifications implemented. Google Calendar sync not implemented. No webhook/integration endpoints.

10) Env/config misalignment (as seen globally)
- Env validation requires DATABASE_URL/AWS_* while runtime uses D1/R2 bindings. R2_PUBLIC_URL missing in env validation; upload URLs may be broken externally.

---

## Integration Points and External Dependencies

- Booking UI → Appointments API: missing integration (must be added with unauthenticated pathway or pre-authentication).
- Booking UI → Upload API: missing reference image upload; upload route requires auth.
- Booking UI → Deposit/Payments: missing payment integration.
- RBAC & auth: middleware/public routes allow /book, but the APIs behind booking operations require auth.
- Data consistency: Move artist selection to /api/artists and use DB ids, or maintain a mapping from slug→id.

---

## Development and Deployment (Relevant)

- For D1/R2 bindings in preview: use OpenNext preview (npm run preview) or npm run dev:wrangler.
- To run migrations: npm run db:migrate (wrangler d1 execute united-tattoo …).
- Ensure NEXTAUTH_* variables set per wrangler.toml env scopes; add R2_PUBLIC_URL to env for public asset URLs.

---

## Recommended Fixes and Path to Epic B MVP

Priority 1 — Wire the booking flow:
- Add a public “booking request” route handler (e.g., app/api/bookings/request/route.ts) that:
  - Accepts form payload with minimal PII.
  - Validates with zod (reuse schemas from lib/validations.ts).
  - Option A: Creates an Appointment with status PENDING and a generated CLIENT user if unauthenticated (mark as provisional).
  - Option B: Creates a ConsultationRequest record (new table) for staff triage, then creates Appointment upon approval.
  - Performs conflict/availability checks server-side. If slot infeasible, return suggestions.

- Update components/booking-form.tsx:
  - Replace console.log with a POST to the new endpoint (or /api/appointments if auth is enforced and user flow includes sign-in).
  - On success, navigate to a confirmation page with next steps (deposit/payment if required).

Priority 2 — Availability:
- Implement per-artist availability service that:
  - Uses availability table + business hours + blackout dates.
  - Produces valid 30/60-min slots for the booking UI.
  - Enforce same rules on the API.

Priority 3 — Artist data source:
- Replace data/artists.ts with a DB-backed source:
  - Fetch via /api/artists (consider a public GET path without sensitive fields).
  - Use DB id for appointments, not slug.

Priority 4 — Deposits/Payments:
- Introduce a /api/payments/intents route; select a single gateway (Stripe recommended given package.json).
- Update deposit page to initiate and confirm payment flows.
- Store deposit intent id and receipt references in D1 (extend appointments table or add payments table).
- Enforce non-refundable/transfer policies upon rescheduling/cancellation (PUT route extension).

Priority 5 — Uploads for reference images:
- Add a lightweight unauthenticated upload path issuing a one-time presigned URL or create a “booking-attachments” table to link files to a pending booking.
- If keeping /api/upload auth-only, require user creation/login in booking step 1, then allow uploads.

Priority 6 — Client portal scaffolding:
- Create /client (or /portal) pages:
  - Upcoming/past appointments view, cancellation/reschedule (within policy windows).
  - Payment history (deposit receipts).
  - Profile/preferences.
- Add corresponding API paths (or reuse /api/appointments with role-based filters).

Priority 7 — Align validations:
- Consolidate appointment schemas in lib/validations.ts and import into route handlers.
- Normalize Date handling: route accepts ISO strings, DB stores DATETIME TEXT, types map correctly.

Priority 8 — Notifications and calendar:
- Add email/SMS notifications (upon booking created/updated). Gateways TBD.
- Prepare GCal integration service (per-artist toggle), with webhooks or periodic sync.

---

## Gotchas and Practical Notes

- If continuing to require auth for /api/appointments, booking must either:
  - Prompt sign-in early (Step 1), or
  - Use a separate unauthenticated “request” path and later attach to a user after email verification.
- Ensure R2_PUBLIC_URL is configured; otherwise uploaded file URLs won’t be accessible.
- Conflict detection currently only checks against appointments; availability constraints (office hours, closed days) must be enforced separately.
- Use OpenNext preview to test D1/R2 behavior locally; plain next dev won’t expose bindings reliably.

---

## Appendix — Useful Commands

```bash
# Dev & Build
npm run dev
npm run pages:build
npm run preview
npm run deploy

# D1
npm run db:create
npm run db:migrate
npm run db:migrate:local

# Tests
npm run test
npm run test:ui
npm run test:run
npm run test:coverage
```

---

This document reflects the real system condition for Booking & Client Management, including gaps to address for an Epic B MVP. It references concrete files and provides a prioritized path to wire the end-to-end flow.
