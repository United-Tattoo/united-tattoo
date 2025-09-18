# Brainstorming Log — United Tattoo Website Expansion

Date: 2025-09-17
Audience: Christy (owner), development team, future maintainers

Overview
This document captures the comprehensive brainstorming outputs from our planning sessions for United Tattoo’s public-facing website and internal admin/ops systems. It consolidates the four pillars we identified:
- Admin Dashboard & Artist Management
- Unified Booking & Client Management
- Public-Facing Experience
- Technical Architecture & Delivery

Goals
- Create a unified, scalable system that supports artist onboarding, portfolio management, and secure admin controls.
- Deliver a polished public site with immersive visuals, consistent design (ShadCN baseline), and robust content (education, aftercare, etc.).
- Implement a reliable booking and payment flow with client portals and calendar integration.
- Establish strong documentation, staging environments, and an approachable handoff for Christy.

Key Design & Tech Assumptions
- UI baseline: ShadCN components, aligned with homepage and /artist pages.
- Parallax layering and split-screen storytelling to achieve an oversized ecommerce-like experience.
- Asset hosting on Cloudflare R2; metadata in D1; server-side asset loading to minimize client storage.
- Context7 MCP and ShadCN MCP docs as primary sources for patterns and best practices.
- Admin users invited via email; role-based access; password onboarding; 2FA.

Brainstorming Focus Areas and Ideas

1) Admin Dashboard & Artist Management System
- User Management & Authentication
  - Invite-based onboarding with time-limited signup links.
  - Wizard-style onboarding for artists using ShadCN components.
  - Two-factor authentication (2FA) to improve security.
  - Sandbox mode to preview changes before going live.
  - Optional passwordless login fallback for convenience.

- Asset Management & Optimization
  - Manual cropping UI with grid guides; save as separate asset records.
  - Optional AI-assisted cropping suggestions that can be toggled off in settings.
  - Batch drag-and-drop portfolio uploads with progress tracking.
  - Versioning for portfolio pieces to track edits/updates.
  - Smart compression with a user-facing toggle to disable automatic aggressive compression if needed.
  - Server-side asset loading from R2, pulling per-artist asset bundles when rendering.

- Permissions & Access Controls
  - Fine-grained roles: viewer, editor (portfolio), admin (full control), owner.
  - Activity logs with audit trail visuals.
  - Emergency pause per-artist or system-wide control.
  - Customizable notification preferences per user and per role.

- Data & Security Considerations
  - Keep media assets offsite in R2; assets loaded server-side to minimize duplication.
  - Access tokens with scoped permissions for asset retrieval.
  - Basic content moderation hooks for uploaded media.

2) Unified Booking & Client Management System
- Multi-Form System
  - Smart routing to route to consultation vs. booking based on user input.
  - Appointment type taxonomy: first tattoo, cover-up, large piece, etc.
  - Automated quote estimates based on options (size, complexity, artist rate tiers).

- Client Portal
  - Account-based portal for appointment management: view, reschedule, cancel.
  - Deposits, refunds, and payment history; secure checkout with PCI-compliant flows.
  - Deposit policies clearly displayed during booking.

- Scheduling & Calendar
  - Real-time availability across artists; conflict detection.
  - Google Calendar two-way sync for artists; SMS/email reminders with opt-in controls.
  - Automated scheduling confirmations and reminders.

- Payments
  - Multi-merchant support (Stripe, PayPal) with deposit handling.
  - Secure storage of payment intents and receipts; refunds workflow.

- Notifications & Communication
  - Email and SMS channels; user preference granularity.
  - Admin notifications for new bookings, cancellations, and changes.

3) Public-Facing Website Experience
- Design System & Visual Language
  - All new pages follow the ShadCN baseline; homepage and /artist pages as references.
  - Layered parallax and split-screen interactions for hero sections and portfolios.
  - Oversized, image-forward design with heavy photography emphasis.

- Pages & Navigation
  - Improve /aftercare, /deposit, /terms, /privacy, /book to align with the visual system.
  - Smooth, consistent navigation with refined transitions.

- Search & Discovery
  - Dedicated search page with filters (style, price, availability).
  - Quick search (Ctrl+K) for artists and educational content.
  - Enhanced artist gallery with style-based filtering and interactive zooms.

- Educational Content
  - Detailed aftercare guides with visuals, progress tracking, and checklists.
  - Healing process explanations with diagrams or annotated imagery.
  - Downloadable PDFs and printable guides.

- Content Strategy
  - Rich media: more images and photography across pages, focusing on shop and artists.
  - Clear calls-to-action for bookings and consultations.

4) Technical Architecture & Delivery
- Cloudflare Integration
  - D1 for structured data; R2 for media assets; 2-way data flow with server-side rendering patterns.
  - Caching strategies to minimize data egress and optimize load times.
  - Image processing on the server (parallax-friendly, optimized delivery).

- Performance & Experience
  - Lazy loading for portfolio assets; progressive image loading for perceived speed.
  - Service workers for offline support and faster revisit performance.

- Git & Documentation
  - Git-free CMS-like experience for the owner-facing admin experience.
  - Clear README, architecture docs, changelog, and contributor guidelines.
  - Staging environment for Christy to preview progress before production.

- Delivery & Handoff
  - Repository delivered as a ready-to-merge GitHub project; Cloudflare transfer instructions documented.
  - Owner training materials focusing on non-technical management tasks.

Phased Implementation Plan (Summary)
- Phase 1: Foundation & Critical Fixes (Week 1-2)
  - Admin dashboard bug resolution, invitation flow, onboarding, basic portfolio management, R2 integration scaffold.
- Phase 2: Core Features & UX (Week 3-4)
  - Unified booking system, client portal, deposits, payments, and initial design unification.
- Phase 3: Polish & Visual Experience (Week 5-6)
  - Parallax, split-screen, advanced search, education content, staging environment.
- Phase 4: Documentation & Delivery (Week 7)
  - Documentation, git workflow, handoff, Cloudflare setup, owner training.

Risks & Mitigations
- Risk: Admin dashboard complexity and bugs
  - Mitigation: Build incremental, testable components; implement the sandbox preview and role-based testing.
- Risk: Cloudflare integration pitfalls (D1/R2)
  - Mitigation: Use MCP patterns, implement robust error handling, staging environment for preview, and strict access controls.
- Risk: Performance with rich visuals and parallax
  - Mitigation: Lazy loading, image optimization, careful asset sizing, and performance budgets.

Next Actions
- Create the initial documentation skeletons and onboarding guides.
- Start implementing Phase 1: Admin dashboard bug resolution and onboarding flow.
- Establish a staging environment workflow for Christy’s preview and handoff.

Notes
- AI cropping suggestions are optional and can be toggled off in settings with manual fallback as requested.
- All design work will follow ShadCN patterns and Context7/MCP guidance.
- Staging and documentation will be integral to a smooth handoff and maintainability.

End of planning notes. Let me know if you want me to start implementing Phase 1 tasks immediately, and I will begin with the admin dashboard on-boarding flow and the artist asset handling scaffold. If you want a specific formatting or section ordering in this document, I can adjust accordingly.
