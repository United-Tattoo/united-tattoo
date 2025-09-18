# Functional Requirements (FRs)
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
