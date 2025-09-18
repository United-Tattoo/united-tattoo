# Non-Functional Requirements (NFRs)
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
