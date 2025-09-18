# Overview
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
