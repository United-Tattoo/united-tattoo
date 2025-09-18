# Project Brief: United Tattoo

Mode: Interactive
Last Updated: 2025-09-17

## Executive Summary

- Product concept: A unified, artist-powered tattoo studio platform combining a premium public website with a secure admin dashboard. Artists can self-manage profiles and portfolios; clients can discover artists, book consultations or appointments, pay deposits, and manage schedules; the studio retains fine-grained control over permissions and content.
- Primary problem: Fragmented booking, asset, and user management forces the owner to handle technical workflows, while inconsistent UX on key pages hampers conversions and brand/talent exposure.
- Target market: Tattoo enthusiasts across age ranges—from high-ticket realism clients to first-timers—especially women seeking a clean, safe, professional studio environment.
- Key value proposition: Beautiful ShadCN-led UX with immersive visuals, real-time availability and booking with deposits, client portal, two-way Google Calendar sync and notifications, and Cloudflare D1/R2-backed reliability—paired with clear documentation, staging previews, and owner-friendly operations.

## Problem Statement

Current state and pain points:
- Admin workflow is blocked by bugs in the dashboard (e.g., cannot create users), preventing artist onboarding and forcing the owner to perform or defer technical tasks.
- Fragmented processes for booking, consultations, and general inquiries create friction and confusion; there’s no unified scheduling with real-time artist availability.
- Clients cannot self-serve key actions (reschedule/cancel, deposit payments), increasing manual coordination and missed opportunities.
- Inconsistent UX and visual design on several public pages (/aftercare, /deposit, /terms, /privacy, portions of /book) undermines brand quality and conversion compared to the polished homepage and /artists pages.
- Portfolio and asset management lacks a streamlined path: artists need a simple, permissioned way to upload/crop/compress assets stored in R2, without owner involvement or Git knowledge.

Impact:
- Lost bookings and reduced conversion due to friction in forms and inconsistent UI.
- Increased owner time cost managing users, content, and schedules (non-scalable).
- Lower artist visibility and slower portfolio updates impact brand/talent exposure and revenue.
- Operational risk from manual workflows (scheduling conflicts, missed reminders).

Why existing solutions fall short:
- Generic booking tools don’t integrate deeply with artist-managed portfolios, fine-grained permissions, Cloudflare R2/D1, and studio-specific workflows.
- “No-code” CMS options do not provide the desired ShadCN-led UX, tight control over permissions, and integrated deposits/Google Calendar sync.
- Current implementation attempts exist but lack consistent functionality and maintainability in key areas.

Urgency:
- Near-term fixes unlock bookings and self-service today; a cohesive platform compounds benefits over time via better artist exposure, higher conversion, and easier operations.

## Proposed Solution

Core concept and approach:
- Deliver a ShadCN-led Next.js platform with two faces:
  1) Public site that showcases artists with immersive, oversized visuals and cohesive design across all pages.
  2) A secure admin dashboard where admins invite artists, manage permissions, and artists self-manage their profiles and portfolios stored in Cloudflare R2.
- Implement unified booking with two primary flows (consultation and direct booking), a general inquiry form, and a client portal for reschedule/cancel and deposit payments.

Key differentiators:
- First-class artist self-management (no Git required): upload/crop/compress media to R2 with audit logs and versioning; admin can pause any user or globally.
- Tight integration of booking + portfolios + permissions + Cloudflare D1/R2 + Google Calendar sync + deposits in one cohesive system.
- ShadCN consistency end-to-end for a polished, premium feel aligning with the homepage and /artists pages, including smooth parallax and split-screen experiences.

Why this will succeed:
- Reduces owner burden with invite-based onboarding, role-based access, and reliable asset pipelines; eliminates fragmented tools and manual overhead.
- Improves conversion via unified, consistent UX on critical pages (/aftercare, /deposit, /book, policies) and clear CTAs that guide users to consult or book.
- Enhances reliability with Cloudflare D1/R2, robust validation (Zod), and documented processes; staging environment provides safe preview before release.

High-level vision:
- Phase 1: Unblock user creation and implement portfolio basics.
- Phase 2: Add client portal, deposits, and Google Calendar synchronization.
- Phase 3: Deliver advanced search, educational guides, and refined parallax/split-screen visuals.
- Final phase: Documentation, staging workflows, and handoff to Christy with minimal ongoing effort required.

## Target Users

Primary User Segment: Serious collectors & premium clients
- Profile: Adults 25-55 with disposable income; professionals and enthusiasts commissioning large or complex pieces (e.g., full back realism).
- Behaviors: Research-driven, compare portfolios across styles; schedule well in advance; expect transparent pricing/deposits and reliable scheduling.
- Needs & Pain Points: Direct access to artists by style/specialty; high-quality, zoomable portfolios; streamlined booking with deposit; clear aftercare; calendar certainty and reminders.
- Goals: Commission top-tier custom work with minimal friction; confidence in cleanliness, process, and outcome.

Secondary User Segment: First-timers & mainstream return clients (with emphasis on women seeking a clean, safe studio)
- Profile: Teens with guardians through 40s+; diverse backgrounds; many are women prioritizing safety, professionalism, and clear guidance.
- Behaviors: Seek reassurance and education; prefer simple, guided booking and consultation flows; value testimonials and shop photos.
- Needs & Pain Points: Clarity between consultation vs. booking; transparent policies; easy rescheduling/cancellation; accessible aftercare guides; welcoming, consistent design.
- Goals: A safe, supported first (or next) tattoo experience with a studio they trust and want to return to.

## Goals & Success Metrics

Business Objectives (SMART where possible)
- Increase successful bookings by 30% within 6 months of launch.
- Reduce owner time spent on user/content/schedule management by 50% within 3 months.
- Achieve consistent brand experience across all public pages with visual parity to homepage and /artists by initial release.
- Enable 100% of active artists to self-manage their profiles/portfolios without developer assistance within 2 months.

User Success Metrics
- Booking flow conversion rate (visit → completed booking or consultation request).
- Deposit completion rate and refund handling satisfaction.
- Client portal adoption (active users performing self-service actions).
- Time-to-first-publish for new artist portfolio updates after invite.
- Aftercare content engagement (views, completion rate, downloads).

KPIs (with definitions and targets)
- Conversion Rate (Book/Consult): target ≥ 3.5% sitewide, ≥ 5% on artist pages.
- Deposit Completion Rate: target ≥ 90% within 24 hours of initiating booking.
- Artist Self-Management Adoption: target ≥ 90% of artists active monthly in dashboard.
- Portfolio Update Latency: median ≤ 1 day from upload to live publish.
- Owner Admin Time: ≤ 2 hrs/week average on routine management after month 3.
- Calendar Sync Success: ≥ 99% successful two-way sync events.
- Notification Deliverability (Email/SMS): ≥ 98% delivery, ≤ 1% bounce.
- Performance: LCP ≤ 2.5s p75, CLS ≤ 0.1, TBT ≤ 200ms on key pages.
- Uptime: ≥ 99.9% monthly.
- Bug Regression Rate (critical): ≤ 1 per month post-stabilization.

## MVP Scope

Core Features (Must Have)
- Admin & Auth
  - Fix admin user creation; invite-based onboarding with expiring links.
  - Roles/permissions: owner, admin, artist (edit own profile/portfolio).
  - Artist self-management: name, pronouns, avatar, bio, skills.
- Portfolio & Assets
  - Image/video upload to R2 via server pipeline.
  - Manual cropping and compression UI (AI suggestions disabled by default).
  - Basic versioning (retain original + current).
- Booking & Forms
  - Consultation form and direct booking form (+ general inquiry form).
  - Deposit payments via Stripe (single-processor to reduce scope).
  - Email notifications (client + artist + admin). SMS optional for post‑MVP.
  - Calendar sync: create events on artist Google Calendar (one‑way for MVP).
  - Client portal: view appointment, reschedule/cancel, see deposit receipts.
- Public Site UX
  - Redesign /aftercare, /deposit, /terms, /privacy, /book to match ShadCN baseline and the homepage/artist aesthetic.
  - Smooth navigation/scroll consistency; image-forward sections.
- Search (Basic)
  - Quick find for artists by name/style. Full-site and Ctrl+K advanced search post‑MVP.
- Documentation & Staging
  - README, setup, release process; staging preview for Christy.

Out of Scope for MVP
- AI cropping suggestions (optional setting exists but disabled; polish later).
- Two-way Google Calendar reconciliation; advanced conflict resolution.
- SMS notifications at scale; payment plans/multi‑processor support.
- Advanced search (filters, content-wide, Ctrl+K command palette).
- Mobile app; offline mode/service worker enhancements.
- Complex refund automation/tax scenarios; analytics dashboards.

MVP Success Criteria
- Owner can invite an artist who publishes portfolio updates within 24 hours of invite.
- End-to-end booking with deposit succeeds (client → deposit → event on artist Google Cal → email confirmations).
- Redesigned pages shipped with ShadCN parity and smooth scrolling.
- Booking conversion uplift detectable vs baseline within 60 days.
- Admin routine management time ≤ 2 hrs/week by month 3.

## Post‑MVP Vision

Phase 2 Features (near term)
- Two‑way Google Calendar sync with conflict detection and graceful reconciliation.
- SMS notifications (reminders, confirmations, policy prompts) with opt‑in and per‑artist preferences.
- Enhanced search: filters (style, availability, price band), content search, and Ctrl+K command palette.
- Portfolio enhancements: collections/sets, multi‑artist features, richer video handling, and bulk editing.
- Education expansion: interactive aftercare wizard, symptom checker, printable kits, and multilingual content.

Long‑term Vision (12–24 months)
- Advanced analytics: booking funnel, artist performance, portfolio engagement, no‑show insights.
- Payment improvements: payment plans for large projects, partial payments, automated refunds/credits.
- Marketing hooks: email segments for consultations vs bookings, seasonal specials, referral tracking.
- Performance & a11y excellence: continuous budgets (images, JS), WCAG AA across the site.
- The “United Experience”: signature parallax narratives per artist, curated home features, and evolving visual stories.

Expansion Opportunities
- Multi‑location support (unified brand, per‑shop artists and calendars).
- Guest artist programs with temporary access windows and portfolio highlights.
- Merch/e‑commerce pilots (limited drops, prints), integrated with booking.
- Partnerships (aftercare products, studios/events) and co‑marketing pages.
- Mobile companion or PWA for artist tools (appointments, portfolio capture on the go).

## Technical Considerations

Platform Requirements
- Target Platforms: Web (Next.js App Router); desktop/mobile browsers; responsive and touch-friendly.
- Browser/OS Support: Evergreen browsers (Chromium/WebKit/Firefox) on iOS/Android/Win/Mac; minimum iOS 15+, Android 10+ where feasible.
- Performance Requirements: LCP ≤ 2.5s p75; CLS ≤ 0.1; TBT ≤ 200ms on key pages; image budgets and lazy loading for portfolios.

Technology Preferences
- Frontend: Next.js 14 App Router, TypeScript, Tailwind + shadcn/ui, Zustand (local UI), React Query (server state).
- Backend/Runtime: Next.js server components & route handlers; server actions for same-origin auth mutations; Cloudflare Pages/Workers via OpenNext adapter.
- Auth & Security: NextAuth (Auth.js), JWT or DB sessions (documented choice); middleware for role-based guards; strict security headers (CSP nonce/hash, Referrer-Policy, X-Frame-Options, Permissions-Policy); cookies HttpOnly/Secure/SameSite=Strict; Zod validation across routes/forms/actions; rate limiting (Redis/Upstash).
- Data & Storage: Cloudflare D1 for relational data; R2 for media assets; all access via environment bindings; no direct DB connections; migrations sourced from sql/ executed via MCP; file uploads with signed URLs and server-side processing.
- Observability: OpenTelemetry for traces/metrics/logs; Sentry for exceptions & releases; log redaction for PII/secrets.
- CI/CD: Lint/typecheck/tests/build; migration dry-run; e2e (Playwright) on preview; bundle budgets; OpenNext build; Cloudflare Pages deploy; fail on type/compat errors.

Architecture Considerations
- Repository Structure: app/, components/ (ui/, custom/), lib/, hooks/, types/, sql/, docs/; no src/.
- Service Architecture: Monorepo single app; separation of concerns for admin vs public routes; route handlers for webhooks and cross-origin APIs; server actions for authed same-origin mutations.
- Integration Requirements: Google Calendar API (one-way MVP; two-way post-MVP); Stripe for deposits; Email provider (e.g., Resend/Postmark) and optional SMS (Twilio/MessageBird) post-MVP.
- Caching & Delivery: Tag-based caching with revalidateTag policy; CDN caching for static/media; image optimization strategy (Cloudflare Images or custom loader); SSR/ISR balance for artist/portfolio pages.
- Security/Compliance: Secrets via Wrangler secrets; .env.example canonical; lib/env.ts Zod schema; rate limits on auth/forms/APIs; content moderation hooks for uploads.
- Staging/Preview: Dedicated preview environments; owner-friendly staging URL; gated feature flags for risky changes.

## Constraints & Assumptions

Constraints
- Budget: Fixed/limited; prioritize MVP features that directly impact bookings, artist self‑service, and brand consistency. Advanced features (two‑way calendar, SMS at scale, advanced search) deferred post‑MVP.
- Timeline: MVP delivery target 6–8 weeks from start; phased rollout by section (admin fixes → booking/deposits → public page unification → staging).
- Resources: Primarily single developer with documentation requirements; limited owner time for reviews; artists available for onboarding/testing windows.
- Technical:
  - Cloudflare Pages/Workers, D1, and R2 are required; OpenNext adapter; no direct DB connections.
  - ShadCN design system baseline; consistency with homepage and /artists is mandatory.
  - Security/validation per project rules (CSP/headers, NextAuth, Zod, rate limiting).
  - Stripe as single payment processor for MVP; Google Calendar one‑way sync MVP.
  - No CMS for owner beyond the custom admin; no Git required for owner/artist workflows.

Key Assumptions
- Artists are willing and able to self‑manage portfolios (basic crop/compress via UI) after invite.
- Clients accept deposits during booking and will use the portal for self‑service changes.
- Each artist can provide/authorize a Google account for calendar integration.
- Email provider (e.g., Resend/Postmark) is available with verified domain; optional SMS later.
- Staging/preview environment access is acceptable for owner reviews before release.
- Documentation will be sufficient for future maintainers without creator involvement.
- Performance and accessibility budgets can be met alongside rich imagery/parallax designs.
- Legal/policy pages (/terms, /privacy) content will be provided/approved by the studio.

## Risks & Open Questions

Key Risks
- Admin dashboard regressions delaying onboarding; complex role/permission edge cases.
- Calendar sync issues (API quotas, timezones, two-way conflicts post-MVP) causing missed/duplicate events.
- R2 storage growth and egress costs if media optimization/policies aren’t enforced.
- Auth/session and state complexity (NextAuth, SSR/ISR, client cache) leading to subtle bugs.
- Payment disputes/refunds edge cases; policy misalignment causing chargebacks.
- Notification deliverability (email/SMS) and spam compliance.
- Accessibility/performance regressions with heavy imagery and parallax effects.
- Data consistency/race conditions between booking, payments, and calendar creation.

Open Questions
- Deposit policy specifics (amounts, non-refundable conditions, refund windows).
- Cancellation/rescheduling rules (cutoffs, fees, limits per client).
- Stripe configuration (connected account vs single account; geo/legal constraints).
- Email provider preference (Resend/Postmark) and SMS vendor (Twilio/MessageBird) timing.
- Artist Google account availability and access model (shared vs per-artist).
- Staging domain and access model for Christy reviews.
- Legal copy for /terms and /privacy and any HIPAA/age-related consent needs.
- Content moderation thresholds for portfolio uploads (NSFW boundaries, approvals).

Areas Needing Further Research
- Cloudflare D1 patterns at scale (indexes, migration strategy, transactional semantics).
- Best-practice NextAuth session model (JWT vs DB) for this app’s constraints.
- R2 cost optimization: formats, compression levels, responsive variants, caching TTLs.
- Stripe deposit flows for services (payment intents, partial refunds, disputes).
- Google Calendar API scopes/quotas and conflict resolution strategies.
- ShadCN patterns for parallax/scroll with a11y/perf considerations.
- Context7-validated search patterns for scalable artist/content discovery.

## Appendices

A. Research Summary
- Brainstorming outputs consolidated in docs/brainstorming.md (admin/portfolio, booking/portal, public UX, technical architecture).
- Current repo docs informing direction: docs/Architecture.md, docs/ui-architecture.md, docs/PRD.md.
- Existing implementation constraints and rules: .clinerules/* (auth, Cloudflare, shadcn/ui, CI/CD, testing).

B. Stakeholder Input
- Owner (Christy) priorities:
  - Increase bookings and brand/talent exposure.
  - Single, unified system where artists self-manage; owner avoids Git/technical workflows.
  - Clean, safe, welcoming brand experience across all pages.
  - Staging previews and strong documentation for long-term maintainability.
- Target audience emphasis:
  - Serious collectors and premium clients.
  - First-timers (particularly women) seeking a safe, professional studio.

C. References
- Internal: docs/brainstorming.md, docs/Architecture.md, docs/ui-architecture.md, docs/PRD.md.
- Project standards: .clinerules/*
- Templates: .bmad-core/templates/project-brief-tmpl.yaml (basis for this brief).

## Next Steps

Immediate Actions
1) Admin/Users: Diagnose and fix admin user creation bug; implement invite-based onboarding (expiring links) and roles (owner/admin/artist).
2) Assets: Establish R2 upload pipeline with server-side processing; build manual crop/compress UI; basic versioning.
3) Booking Foundations: Implement consultation, booking, and general inquiry forms; wire Stripe deposits; send email confirmations.
4) Calendar MVP: One-way event creation on artist Google Calendar after successful deposit; simple conflict checks.
5) Public UX Unification: Redesign /aftercare, /deposit, /terms, /privacy, /book to match ShadCN baseline and homepage/artist aesthetic; smooth scrolling.
6) Staging: Create preview workflow and owner-accessible staging URL; enable feature flags for risky changes.
7) Documentation: Draft README, setup guide, environment/secrets, deployment steps, and CHANGELOG structure.

PM Handoff
This Project Brief provides the context for United Tattoo. Proceed to PRD generation using docs/PRD.md as the working artifact. Validate scope vs. MVP, document acceptance criteria for Phase 1 epics (Admin/Users, Assets, Booking, Calendar, Public UX, Staging/Docs), and prepare a release plan with checkpoints and success metrics.
