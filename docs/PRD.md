# Product Requirements Document (PRD)
United Tattoo — Public Website, Booking, and Admin System

Version: 1.0  
Date: 2025-09-17  
Source: Consolidated from docs/brainstorming.md

1. Overview
United Tattoo is expanding both its public-facing web experience and internal admin/ops systems. This PRD defines Functional Requirements (FRs), Non-Functional Requirements (NFRs), Epics, and User Stories derived from the brainstorming notes. The goal is a unified, scalable platform for artist onboarding and portfolio management, seamless client booking and portal experiences, and a refined, image-forward public site aligned to a ShadCN-based design system and Cloudflare runtime.

Primary Objectives
- Create a unified system supporting artist onboarding, portfolio and asset management, and secure admin controls.
- Deliver a polished, immersive public site with consistent design and rich educational content.
- Implement robust booking and payment flows with a client portal and calendar integration.
- Provide strong documentation, staging workflows, and an approachable owner handoff.

Key Assumptions & Tech Baseline
- UI baseline: ShadCN components, consistent with homepage and /artist pages.
- Visual language: Oversized image-forward design; layered parallax and split-screen storytelling.
- Infra: Cloudflare D1 (structured data), R2 (media assets); server-side asset loading.
- Docs/patterns: Context7 MCP and ShadCN MCP as primary references for patterns.
- Auth: Invite-based onboarding; RBAC; 2FA; optional passwordless fallback.
- Handoff: Staging environments, clear README/architecture docs, owner training.

2. Functional Requirements (FRs)
FR-A. Admin Dashboard & Artist Management
A1. Invitations & Onboarding
- FR-A1.1: Admin can invite users (artists, staff) via time-limited signup links.
- FR-A1.2: Wizard-style onboarding for artists using ShadCN components guiding profile, portfolio, and settings.
- FR-A1.3: Optional passwordless fallback; primary path supports email+password + 2FA enrollment.
- FR-A1.4: Sandbox mode to preview changes before publishing live.

A2. Role-Based Access & Controls
- FR-A2.1: Roles: viewer, editor (portfolio), admin, owner; assignable per user.
- FR-A2.2: Permissions restrict CRUD on artists, portfolios, and settings per role.
- FR-A2.3: Emergency pause control per artist or system-wide, disabling booking or portfolio visibility.

A3. Artist Profiles & Portfolio
- FR-A3.1: CRUD for artist profiles (bio, styles, rates/tiers, links, availability indicators).
- FR-A3.2: Batch drag-and-drop portfolio upload with progress tracking.
- FR-A3.3: Manual cropping UI with grid guides; save crops as separate asset records.
- FR-A3.4: Optional AI-assisted cropping suggestions (can be disabled per settings).
- FR-A3.5: Versioning for portfolio pieces to track edits/updates.
- FR-A3.6: Portfolio piece metadata: style tags, dimensions/size class, creation date, visibility flag.

A4. Asset Management & Delivery
- FR-A4.1: Store media in R2; metadata in D1.
- FR-A4.2: Server-side asset fetching and transformation for pages; minimize client duplication.
- FR-A4.3: Configurable compression levels; toggles to disable aggressive compression per asset/group.

A5. Auditability & Notifications
- FR-A5.1: Activity logs with user, action, timestamp; filter by user/resource.
- FR-A5.2: Notification preferences per user and per role (email/SMS for key events: new booking, cancellations).
- FR-A5.3: Basic content moderation hooks for uploads (e.g., queue for review).

FR-B. Unified Booking & Client Management
B1. Booking & Consultation Forms
- FR-B1.1: Multi-form flow with smart routing: consultation vs booking based on user input.
- FR-B1.2: Appointment type taxonomy (first tattoo, cover-up, large piece, etc.) drives questions and duration.
- FR-B1.3: Automated quote estimates based on inputs: size, placement, complexity, artist tier/rate.

B2. Client Portal
- FR-B2.1: Clients can create accounts and authenticate to manage appointments.
- FR-B2.2: View upcoming/past appointments, reschedule/cancel (per policy windows).
- FR-B2.3: Payments area: view deposit history, receipts, refunds.
- FR-B2.4: Profile and preferences (email/SMS notifications opt-in/out).

B3. Scheduling & Calendars
- FR-B3.1: Real-time availability across artists with conflict detection.
- FR-B3.2: Google Calendar two-way sync for artists (per-artist toggle).
- FR-B3.3: Automated confirmations and reminders (email/SMS) per policy.

B4. Payments
- FR-B4.1: Multi-merchant gateway support (e.g., Stripe, PayPal) with deposit handling.
- FR-B4.2: Store payment intents and receipt references securely; enable refund workflows.
- FR-B4.3: Deposit policies surfaced during booking; acceptance required to proceed.

B5. Notifications & Communications
- FR-B5.1: Email and SMS channels configurable by users/admins.
- FR-B5.2: Admin notifications for new bookings, cancellations, changes.

FR-C. Public-Facing Website Experience
C1. Design System & Visuals
- FR-C1.1: All pages follow ShadCN baseline; unify typography, spacing, and components.
- FR-C1.2: Implement layered parallax and split-screen storytelling in hero and portfolio sections.
- FR-C1.3: Image-forward layouts throughout; high-quality photography emphasis.

C2. Pages & Navigation
- FR-C2.1: Improve /aftercare, /deposit, /terms, /privacy, /book for consistency and UX.
- FR-C2.2: Smooth, consistent navigation with refined transitions.
- FR-C2.3: Responsive behavior across major breakpoints with mobile-first navigation patterns.

C3. Search & Discovery
- FR-C3.1: Dedicated search page with filters (style, availability, price tier).
- FR-C3.2: Quick search (Ctrl+K) for artists and educational content.
- FR-C3.3: Enhanced artist gallery: style-based filtering and interactive zooms/lightbox.

C4. Educational Content
- FR-C4.1: Detailed aftercare guides with visuals, progress tracking, and checklists.
- FR-C4.2: Healing process explanations with diagrams or annotated imagery.
- FR-C4.3: Downloadable PDFs and printable guides.

FR-D. Technical Delivery & Handoff
D1. Cloudflare Integration & Runtime
- FR-D1.1: Use D1 for structured data and R2 for media; server-side patterns for SSR/ISR where applicable.
- FR-D1.2: Caching strategies to minimize egress and optimize load times.

D2. Performance & Offline
- FR-D2.1: Lazy loading for portfolio assets; progressive image loading.
- FR-D2.2: Service worker for offline support and faster revisits.

D3. Documentation & Staging
- FR-D3.1: Clear README, architecture docs, changelog, contributor guide.
- FR-D3.2: Staging environment for Christy to preview changes.

D4. Handoff
- FR-D4.1: Repo delivered ready-to-merge; Cloudflare transfer instructions documented.
- FR-D4.2: Owner training materials for non-technical management.

3. Non-Functional Requirements (NFRs)
NFR-Security & Privacy
- NFR-S1: Enforce invite-based onboarding; session security; 2FA required for admins/owners; optional passwordless fallback.
- NFR-S2: Role-based access controls across admin features and APIs; least-privilege defaults.
- NFR-S3: Media access via scoped tokens; no direct public RW access to R2.
- NFR-S4: Payment flows must be PCI-compliant through the chosen gateway(s); do not store raw card data.
- NFR-S5: Basic content moderation hooks for uploads; audit and traceability of changes.
- NFR-S6: Conform to privacy policy; provide clear consent for notifications.

NFR-Performance
- NFR-P1: Use SSR-friendly, server-side image processing; progressive/lazy-loading for rich media.
- NFR-P2: Apply CDN caching and optimized asset delivery to keep LCP/INP within target budgets for typical gallery pages.
- NFR-P3: Minimize egress from R2 through caching and efficient formats; favor WebP/AVIF where supported.

NFR-Reliability & Availability
- NFR-R1: Implement robust error handling and retries for R2/D1 operations; graceful degradation of images.
- NFR-R2: Eventual consistency acceptable for search indices and non-critical caches (<1 minute).
- NFR-R3: Activity logs retained per policy; include export capabilities for audits.

NFR-Usability & Accessibility
- NFR-U1: Follow ShadCN conventions for components and patterns; consistent spacing/typography.
- NFR-U2: WCAG AA baseline for color contrast, focus states, and keyboard navigation.
- NFR-U3: Responsive layouts and touch targets across breakpoints.

NFR-Observability & Ops
- NFR-O1: Centralized error tracking for client/server, with release tagging.
- NFR-O2: Structured logs; avoid logging PII beyond necessity.
- NFR-O3: Staging environment should mimic production settings for realistic previews.

NFR-Documentation & Handoff
- NFR-D1: Up-to-date README, architecture overview, environment setup, and runbooks.
- NFR-D2: Owner-facing guides for day-to-day tasks (invites, portfolio updates, refunds, content).

4. Epics
Epic A: Admin Dashboard & Artist Management
Description: Secure, role-based admin experience to onboard artists, manage profiles/portfolios, and control assets.
Business Value: Scales operations; reduces friction for artist content management and quality control.

Epic B: Unified Booking & Client Management
Description: Multi-form booking and consultation flows, client portal, scheduling, and payments.
Business Value: Converts demand into scheduled work efficiently while respecting policies and preferences.

Epic C: Public-Facing Website Experience
Description: Consistent ShadCN-based design system, immersive visuals, improved content and discovery.
Business Value: Enhances brand, increases engagement, and improves conversion to consultations/bookings.

Epic D: Technical Architecture & Delivery
Description: Cloudflare-first architecture, caching/optimization, performance and offline capabilities, and strong documentation.
Business Value: Reliable, fast experience with maintainable operations and smooth handoff to the owner.

5. User Stories (with Acceptance Criteria)
Legend: UT-[Epic]-[ID]
- ADM = Admin/Artist Management (Epic A)
- BKG = Booking/Client (Epic B)
- PUB = Public Website (Epic C)
- ARC = Architecture/Delivery (Epic D)

Epic A — Admin Dashboard & Artist Management
UT-ADM-01: As an admin, I can invite a new artist with a time-limited signup link.
- Given I am an admin
- When I enter the artist’s email and send an invite
- Then the artist receives a link that expires after a configured window and can register successfully

UT-ADM-02: As an artist, I can complete a wizard-style onboarding to set profile, styles, and initial portfolio.
- Given I have a valid invite
- When I follow the wizard steps (profile, styles, rates, availability)
- Then my artist profile is created and set to draft until I publish

UT-ADM-03: As an admin/owner, I can enforce 2FA for admin roles and allow optional passwordless for others.
- Given security settings are configured
- When a new admin registers
- Then they must enroll 2FA before accessing admin features

UT-ADM-04: As an editor, I can batch upload portfolio pieces with progress tracking.
- Given I have editor permissions
- When I drag-and-drop multiple images
- Then I see per-file progress and all successful uploads are linked to my portfolio

UT-ADM-05: As an editor, I can manually crop images with grid guides and save crops as separate assets.
- Given I uploaded an image
- When I open the crop tool and save
- Then a cropped asset version with metadata is created

UT-ADM-06: As an editor, I can toggle AI-assisted crop suggestions on/off at the account or workspace level.
- Given the setting is visible
- When I toggle AI suggestions off
- Then only manual cropping is suggested

UT-ADM-07: As an admin, I can manage compression settings for uploaded assets and override aggressive compression.
- Given default compression is on
- When I disable aggressive compression for a set
- Then newly processed assets use the chosen compression level

UT-ADM-08: As an admin, I can view an activity log with user, action, and timestamp to audit changes.
- Given actions were performed
- When I open the activity log
- Then I can filter by user and resource and export logs

UT-ADM-09: As an admin, I can pause an artist or globally pause the system to halt new bookings.
- Given an emergency scenario
- When I toggle pause for a specific artist or globally
- Then booking forms and availability reflect the pause with clear messaging

UT-ADM-10: As an editor, I can stage portfolio changes in a sandbox and preview before publishing live.
- Given I have draft changes
- When I open preview
- Then I see the draft state exactly as it would appear when published

Epic B — Unified Booking & Client Management
UT-BKG-01: As a visitor, I am routed to consultation vs booking based on my form inputs.
- Given I start the booking flow
- When my answers indicate uncertainty or complex needs
- Then I’m guided to a consultation request instead of direct booking

UT-BKG-02: As a visitor, I can select appointment type (first tattoo, cover-up, large piece, etc.) and see appropriate options.
- Given I’m on the booking form
- When I choose an appointment type
- Then the form adapts with relevant questions and duration estimates

UT-BKG-03: As a visitor, I can see an automated quote estimate based on size, complexity, and artist tier.
- Given I filled required fields
- When I request an estimate
- Then I see a non-binding quote and deposit requirements

UT-BKG-04: As a client, I can create an account and see my upcoming/past appointments.
- Given I signed up
- When I log in to the client portal
- Then I can view appointments and details

UT-BKG-05: As a client, I can reschedule or cancel an appointment within policy windows.
- Given I have an upcoming appointment
- When I choose reschedule/cancel within allowed times
- Then the system updates calendar and sends notifications

UT-BKG-06: As an admin, I can enable two-way Google Calendar sync per-artist.
- Given an artist connects Google Calendar
- When sync is enabled
- Then booking changes appear in their calendar and availability reflects external events

UT-BKG-07: As a client, I can pay a deposit securely and receive a receipt.
- Given a deposit is required
- When I complete checkout via supported gateway
- Then my payment intent and receipt reference are stored and visible

UT-BKG-08: As an admin, I can process a refund via the payment gateway and record it in the system.
- Given a valid refund request
- When I issue a refund
- Then the client is notified and records reflect the refund

UT-BKG-09: As an admin, I receive notifications for new bookings, cancellations, and changes.
- Given notification preferences are set
- When key events occur
- Then I receive email/SMS alerts accordingly

Epic C — Public-Facing Website Experience
UT-PUB-01: As a visitor, I experience consistent ShadCN-based UI across all pages.
- Given any site page
- When I navigate and interact
- Then spacing, typography, components, and transitions are consistent

UT-PUB-02: As a visitor, I see parallax/split-screen hero sections that are smooth and performant.
- Given I’m on the homepage or artist page
- When I scroll
- Then layered visuals and split sections animate smoothly within performance budgets

UT-PUB-03: As a visitor, I can use a dedicated search with filters (style, availability, price tier).
- Given I’m on /search
- When I apply filters
- Then artist and content results update accordingly

UT-PUB-04: As a visitor, I can use quick search (Ctrl+K) to find artists and educational content.
- Given I press Ctrl+K
- When I type a query
- Then I get navigable results for artists and key pages

UT-PUB-05: As a visitor, I can view improved aftercare content with visuals, progress tracking, and checklists.
- Given I open /aftercare
- When I read and mark steps
- Then my progress is saved locally and content is printable/PDF-downloadable

UT-PUB-06: As a visitor, I can browse artist galleries with style-based filtering and interactive zoom/lightbox.
- Given I’m on an artist page
- When I filter by style or click an image
- Then the gallery updates, and I can zoom without layout shift

Epic D — Technical Architecture & Delivery
UT-ARC-01: As a developer, I can configure Cloudflare D1/R2 and verify SSR server-side asset delivery.
- Given environment is set
- When I run the preview
- Then assets are fetched server-side and delivered via caches

UT-ARC-02: As a visitor, I benefit from progressive images and lazy loading while browsing media-heavy pages.
- Given I visit a gallery
- When images load
- Then low-res placeholders progressively upgrade without jank

UT-ARC-03: As a returning visitor, I benefit from a service worker that improves revisit speed and limited offline browsing.
- Given PWA-like capabilities
- When I revisit
- Then common assets/pages load faster and basic offline fallback is available

UT-ARC-04: As the owner, I can preview new changes on a staging environment before production.
- Given staging is deployed
- When I access the staging URL
- Then I can verify new features and content before launch

UT-ARC-05: As a maintainer, I can rely on clear docs (README, architecture, changelog) to operate and extend the system.
- Given the repository
- When a new developer onboards
- Then they can set up, run, and contribute following documented steps

6. Phasing (Reference)
- Phase 1 (Weeks 1–2): Foundations & Critical Fixes
  - Admin: invites, onboarding wizard, basic portfolio management, R2 integration scaffold (UT-ADM-01..05, 07, 10; UT-ARC-01)
- Phase 2 (Weeks 3–4): Core Features & UX
  - Booking, client portal, deposits/payments, design unification (UT-BKG-01..09; UT-PUB-01; UT-ARC-04)
- Phase 3 (Weeks 5–6): Polish & Visual Experience
  - Parallax/split-screen, search & filters, education content, service worker (UT-PUB-02..06; UT-ARC-02..03)
- Phase 4 (Week 7): Documentation & Delivery
  - Docs, handoff, training, final staging (UT-ARC-05 + wrap-ups)

7. Risks & Mitigations (Summary)
- Admin dashboard complexity/bugs → Incremental delivery, sandbox previews, RBAC testing.
- Cloudflare D1/R2 pitfalls → Follow proven patterns; robust error handling; staging validation.
- Performance with heavy visuals → Lazy loading, image optimization, prudent asset sizing, performance budgets.

End of PRD.
