# United Tattoo Front-End Overhaul: Technical Research Report
**Date:** 2025-11-24
**Prepared for:** Nicholai (Development Lead)
**Project:** Complete design system migration and component refactoring

---

## Executive Summary

This technical research evaluates the risks, integration points, and implementation strategy for migrating the United Tattoo website from its current design system to the new 2026 sun-washed plaster aesthetic. The analysis reveals **4 critical risk areas**, **7 major integration challenges**, and provides a **phased migration roadmap** to minimize downtime and breaking changes.

**Key Findings:**
- ✅ Architecture supports incremental migration via feature flags
- 🔴 **HIGH RISK:** Animation system conflicts (Lenis, parallax, IntersectionObserver)
- 🔴 **HIGH RISK:** CSS variable naming breaking changes affect all ShadCN components
- 🟡 **MEDIUM RISK:** Calendar integration fragility with react-big-calendar
- ✅ **OPPORTUNITY:** 50KB+ bundle reduction possible after complete migration

---

## Table of Contents

1. [Current Architecture Analysis](#1-current-architecture-analysis)
2. [Design System Comparison](#2-design-system-comparison)
3. [Critical Risk Assessment](#3-critical-risk-assessment)
4. [Integration Points Analysis](#4-integration-points-analysis)
5. [Migration Strategy & Roadmap](#5-migration-strategy--roadmap)
6. [Developer Experience Journey Map](#6-developer-experience-journey-map)
7. [Testing & Validation Requirements](#7-testing--validation-requirements)
8. [Performance Considerations](#8-performance-considerations)
9. [Recommendations & Next Steps](#9-recommendations--next-steps)

---

## 1. Current Architecture Analysis

### 1.1 Technology Stack

**Framework & Runtime:**
- Next.js 14.2.33 (App Router)
- OpenNext 1.8.2 (Cloudflare Workers adapter)
- Cloudflare Workers (via Wrangler 4.37.1)

**Styling System:**
- Tailwind CSS 4.1.9 (new CSS-first approach with `@import "tailwindcss"`)
- tw-animate-css 1.3.3 (animation utilities)
- CSS Variables using `oklch()` color space
- ShadCN UI component library (Radix UI based)

**Animation Libraries:**
- @studio-freight/lenis (smooth scroll)
- framer-motion 12.23.24 (component animations)
- Custom parallax hooks (`useMultiLayerParallax`)
- IntersectionObserver-based scroll animations

**Backend Integrations:**
- Cloudflare D1 (SQLite database)
- Cloudflare R2 (file storage)
- NextAuth.js 4.24.11 (authentication with Nextcloud OAuth)
- CalDAV integration via tsdav 2.1.5

**Component Architecture:**
- 80+ TSX component files
- ShadCN UI primitives (40+ components in `/components/ui/`)
- Custom business components (booking, portfolio, admin)
- Feature flag system for progressive rollout

### 1.2 Current Design System Tokens

**Colors:** oklch() format with HSL fallbacks
```css
--primary: oklch(0.205 0 0);        /* Emerald-600 */
--secondary: oklch(0.97 0 0);       /* Emerald accent */
--background: oklch(1 0 0);         /* White */
--foreground: oklch(0.145 0 0);     /* Dark Slate Gray */
```

**Typography:**
- Primary: Source Sans 3 (--font-source-sans)
- Display: Playfair Display (--font-playfair)
- Already loaded but different weights

**Animation Timing:**
- Lenis: 1.2s duration custom easing
- Component transitions: 0.2s - 0.6s
- Scroll reveals: 0.6s ease-out
- IntersectionObserver threshold: 0.15-0.18

**Border Radius:**
- `--radius: 0.625rem` (10px)
- Variants: sm (6px), md (8px), lg (10px), xl (14px)

### 1.3 File Structure

```
app/
├── (route groups with 50+ pages)
├── globals.css (current design tokens)
├── layout.tsx (font loading, metadata)
└── ClientLayout.tsx (providers: Session, Query, Lenis, Theme, FeatureFlags)

components/
├── ui/ (40+ ShadCN components)
├── (20+ custom business components)
└── smooth-scroll-provider.tsx (Lenis integration)

lib/
├── db.ts (D1 database layer)
├── auth.ts (NextAuth + Nextcloud)
├── caldav-client.ts (CalDAV sync)
└── r2-upload.ts (R2 file handling)
```

---

## 2. Design System Comparison

### 2.1 Color Palette Migration

| Element | Current (oklch) | New Design (hex/rgb) | Migration Impact |
|---------|----------------|---------------------|------------------|
| Primary | `oklch(0.205 0 0)` | `#b0471e` (Burnt) | 🔴 **BREAKING** - All buttons |
| Secondary | `oklch(0.97 0 0)` | `#D87850` (Terracotta) | 🔴 **BREAKING** - Forms, accents |
| Background | `oklch(1 0 0)` | Gradient `#7A8B8B → #F2E3D0` | 🟡 **MAJOR** - Full page redesign |
| Text | `oklch(0.145 0 0)` | `#241b16` (Ink) | ✅ **MINOR** - Similar contrast |
| Accent | `oklch(0.97 0 0)` | `#e59863` (Rose) | 🟡 **MODERATE** - Alerts, focus states |

**CSS Variable Conflicts:**
- Current uses semantic names (`--primary`, `--secondary`)
- New design uses descriptive names (`--burnt`, `--terracotta`, `--sage`)
- ShadCN components EXPECT `--primary`, `--accent`, `--muted`, etc.
- **Solution:** Maintain both systems during migration OR remap new tokens to ShadCN expectations

### 2.2 Typography Changes

| Aspect | Current | New Design | Impact |
|--------|---------|-----------|--------|
| Display Font | Playfair Display | Playfair Display ✅ | Same font, different weights needed |
| Body Font | Source Sans 3 | Space Grotesk | 🔴 **BREAKING** - Replace across all components |
| Display Size | 5xl-7xl (clamp) | clamp(2.5rem, 5vw, 3.8rem) | ✅ **COMPATIBLE** |
| Body Size | Base 16px | 0.95rem (15.2px) | 🟡 **MINOR** - Slight reduction |
| Line Height | 1.6 | 1.6 (body), 1.1 (display) | ✅ **COMPATIBLE** |
| Letter Spacing | Normal | 0.2-0.35em (uppercase labels) | 🟡 **NEW PATTERN** |

**Font Loading:**
- Current: Source Sans 3 via `next/font/google`
- New: Space Grotesk via `next/font/google`
- **Action:** Update font import in `app/layout.tsx`, update CSS variable `--font-sans`

### 2.3 Animation System Differences

| Feature | Current | New Design | Conflict? |
|---------|---------|-----------|-----------|
| Smooth Scroll | Lenis 1.2s custom easing | Lenis implied (design uses scroll-driven) | 🟡 **Timing mismatch** |
| Parallax | Multi-layer (background/mid/foreground) | Single factor 0.12 | 🔴 **BREAKING** - Different implementation |
| Scroll Reveals | 0.6s ease-out, threshold 0.15 | 0.8s ease-out, threshold 0.18 | 🟡 **Timing change** |
| Button Hover | 0.2s, translateY(-1px) | 0.2s, scale(1.05) translateY(-1px) | ✅ **COMPATIBLE** - Enhanced |
| Stagger | 100ms (Framer Motion) | 50ms (cards), 150ms (layouts) | 🟡 **Different timing** |
| Filmstrip | ❌ Not implemented | ✅ **NEW** - Horizontal scroll on vertical scroll | 🟢 **NEW FEATURE** |

**Critical Animation Conflicts:**
1. **Lenis Configuration:** Current uses 1.2s, new design implies 0.8s transitions
2. **Parallax Hook:** `useMultiLayerParallax` incompatible with new single-factor approach
3. **IntersectionObserver:** Threshold difference (0.15 vs 0.18) changes reveal timing
4. **RequestAnimationFrame:** Multiple RAF loops (parallax, filmstrip, Lenis) could cause performance issues

### 2.4 Component Architecture Gaps

| Component | Current | New Design | Work Required |
|-----------|---------|-----------|---------------|
| Button | CVA variants (default/destructive/outline) | 3 variants (primary/secondary/ghost) | 🟡 **Remap variants** |
| Card | ShadCN default | Multiple (data-card, component-card, motion-card) | 🔴 **New components** |
| Form Inputs | ShadCN styled | Custom terracotta focus, 12px radius | 🟡 **Style override** |
| Toast | Sonner library | Custom sage/rose toasts | 🟡 **Custom styling** |
| Calendar | react-big-calendar | Custom grid with terracotta booked states | 🔴 **HIGH RISK** - Complete redesign |
| Filmstrip | ❌ None | ✅ **NEW** - Scroll-driven horizontal gallery | 🟢 **Build from scratch** |
| Hero | Parallax with overlay | Glassmorphism card, subtle parallax | 🟡 **Redesign** |

---

## 3. Critical Risk Assessment

### 3.1 HIGH RISK Areas 🔴

#### Risk 1: CSS Variable Breaking Changes
**Probability:** ⚠️ **100% (Certain)**
**Impact:** 🔴 **Critical** - Breaks all ShadCN components, forms, buttons, navigation

**Description:**
Changing `:root` CSS variables from `oklch()` to hex/rgb values will immediately break every component that references `--primary`, `--secondary`, `--accent`, etc. ShadCN components are tightly coupled to these variable names.

**Affected Systems:**
- All 40+ UI components in `/components/ui/`
- Admin dashboard (stats, calendar, file manager)
- Booking form, contact form, authentication pages
- Theme switching (dark mode)

**Mitigation Strategy:**
1. **Dual CSS System:** Create `globals-new.css` with new design tokens
2. **Scoped Application:** Use CSS class `.new-design` to scope new tokens
3. **Feature Flag Integration:** Toggle new design per-page via `useFeatureFlag("NEW_DESIGN_ENABLED")`
4. **Gradual Rollout:** Start with new pages (e.g., `/design-showcase`), migrate existing pages incrementally

**Testing Requirements:**
- Visual regression tests for all UI components
- Manual QA of forms, authentication, admin dashboards
- Cross-browser testing (Chrome, Safari, Firefox)
- Mobile responsive testing

---

#### Risk 2: Animation System Conflicts
**Probability:** ⚠️ **90% (Almost Certain)**
**Impact:** 🔴 **High** - Performance degradation, janky animations, broken scroll

**Description:**
Multiple concurrent animation systems using `requestAnimationFrame` can cause:
- Frame drops (60fps → 30fps or worse)
- Conflicting scroll behaviors (Lenis vs filmstrip vs parallax)
- Memory leaks from multiple RAF loops
- Race conditions in IntersectionObserver callbacks

**Current Animation Stack:**
```typescript
// Lenis smooth scroll (continuous RAF loop)
function raf(time: number) {
  lenis?.raf(time)
  requestAnimationFrame(raf)
}

// Parallax hook (separate RAF loop)
function updateParallax() {
  // ... parallax calculations
  requestAnimationFrame(updateParallax)
}

// New filmstrip (third RAF loop)
function updateFilmstrip() {
  // ... filmstrip scroll calculations
  requestAnimationFrame(updateFilmstrip)
}
```

**Conflict Points:**
1. Three separate RAF loops fighting for frame budget
2. Lenis duration (1.2s) vs new design timing (0.8s)
3. Parallax multi-layer vs single factor 0.12
4. IntersectionObserver threshold mismatch (0.15 vs 0.18)

**Mitigation Strategy:**
1. **Consolidate RAF Loops:** Single animation controller managing all RAF-based animations
2. **Update Lenis Config:** Reduce duration to 0.8s, use standard `ease-out` easing
3. **Rewrite Parallax Hook:** Replace `useMultiLayerParallax` with simple single-factor version
4. **Standardize IO Threshold:** Use 0.18 across all scroll reveal animations
5. **Remove Framer Motion:** Eliminate dependency, use CSS transitions/keyframes (bundle size win)

**Performance Budget:**
- Target: 60fps during scroll
- Max RAF execution time: 10ms per frame
- Lighthouse Performance score: >90

---

#### Risk 3: Calendar Integration Fragility
**Probability:** ⚠️ **70% (Likely)**
**Impact:** 🟡 **Medium** - Admin calendar breaks, appointment booking fails

**Description:**
The admin calendar (`/app/admin/calendar/page.tsx`) uses `react-big-calendar` with heavily customized CSS. New design introduces completely different calendar styling (terracotta booked states, 7-column grid, 8px radius).

**Current Implementation:**
- `react-big-calendar` CSS overrides in `globals.css`
- Custom event rendering with CalDAV sync
- Drag-and-drop functionality

**New Design Requirements:**
- 7-column grid with 0.4rem gap
- Day cells: aspect-ratio 1/1, 8px radius
- Booked state: terracotta background (#D87850), white text
- Muted state: 40% opacity for past dates

**Conflict:**
`react-big-calendar` has deep CSS coupling that may not support new design patterns without extensive overrides or forking.

**Mitigation Strategy:**
1. **Option A (Conservative):** Keep admin calendar with current design, apply new design to public-facing pages only
2. **Option B (Recommended):** Build custom calendar component using `react-day-picker` (already in dependencies) with full design control
3. **Option C (High Risk):** Completely override `react-big-calendar` CSS - high maintenance burden

**Testing Requirements:**
- CalDAV sync verification after styling changes
- Drag-and-drop functionality testing
- Appointment creation/editing flows
- Mobile calendar interaction

---

#### Risk 4: OpenNext Build & Bundle Size
**Probability:** ⚠️ **60% (Moderate)**
**Impact:** 🟡 **Medium** - Build failures, bundle budget violations, slow cold starts

**Description:**
New design includes:
- Additional texture overlays (SVG grid, radial gradients)
- Larger plaster texture images
- New font (Space Grotesk) while keeping Playfair Display
- Custom animations and keyframes

**Current Bundle Budgets (from package.json):**
```json
"budgets": {
  "TOTAL_STATIC_MAX_BYTES": 3000000,   // 3MB
  "MAX_ASSET_BYTES": 1500000            // 1.5MB
}
```

**Projected Changes:**
- **Fonts:** +40KB (Space Grotesk WOFF2)
- **CSS:** +30KB (new design tokens, custom animations)
- **Images:** +200KB (plaster textures, grain overlays)
- **JS:** -50KB (remove Framer Motion)
- **Net Change:** +220KB total

**Risks:**
- Cloudflare Workers script size limit (1MB after compression)
- Cold start performance degradation with larger bundles
- Failed CI builds if budgets exceeded

**Mitigation Strategy:**
1. **Remove Old CSS:** Delete `oklch()` system after migration complete (-50KB)
2. **Optimize Textures:** Use WebP for plaster images, CSS patterns for grain
3. **Font Subsetting:** Only include required glyphs for Space Grotesk
4. **Code Splitting:** Lazy load filmstrip component, admin calendar
5. **OpenNext Optimization:** Leverage static optimization for critical CSS inlining

---

### 3.2 MEDIUM RISK Areas 🟡

#### Risk 5: Mobile Performance - Backdrop Filters
**Probability:** 50% (Possible)
**Impact:** Medium - Janky scroll on mobile, high battery drain

**Description:**
New design uses `backdrop-filter: blur(12px) saturate(110%)` for glassmorphism effects. Backdrop filters are expensive on mobile GPUs.

**Mitigation:**
- Use `@supports (backdrop-filter: blur())` to provide fallback
- Add `will-change: backdrop-filter` only during scroll
- Implement `prefers-reduced-motion` to disable on request

---

#### Risk 6: Font Replacement Across Components
**Probability:** 40% (Possible)
**Impact:** Medium - Visual inconsistency, component-specific regressions

**Description:**
Replacing Source Sans 3 with Space Grotesk requires updating all components using `font-sans` class. Different metrics may cause layout shifts.

**Mitigation:**
- Update CSS variable: `--font-sans: var(--font-space-grotesk)`
- Visual regression testing on all pages
- Verify form input alignment, button text centering

---

#### Risk 7: Reduced Motion Support Gap
**Probability:** 30% (Unlikely but High Impact)
**Impact:** High - Accessibility violation, user discomfort

**Description:**
Current implementation has partial `prefers-reduced-motion` support. New design adds more animations (parallax, filmstrip, stagger) that need motion-reduced alternatives.

**Mitigation:**
- Implement `useReducedMotion()` hook (already exists in `use-parallax.ts`)
- Disable parallax, filmstrip scroll for reduced motion users
- Replace transitions with instant changes
- Test with system motion preferences enabled

---

## 4. Integration Points Analysis

### 4.1 NextAuth / Nextcloud OAuth
**Risk Level:** ✅ **LOW** - No visual dependencies

**Current State:**
- NextAuth.js with Nextcloud OAuth provider
- Signin page at `/app/auth/signin/page.tsx`
- Auto-provisioning based on Nextcloud groups

**Impact of Design Change:**
- Signin page needs styling update (buttons, forms, layout)
- Error page `/app/auth/error/page.tsx` needs new design
- No functional changes required

**Action Items:**
- Apply new button styles (primary variant = burnt background)
- Update form input focus states (terracotta border, 3px glow)
- Test OAuth flow end-to-end after styling

---

### 4.2 Cloudflare D1 Database
**Risk Level:** ✅ **NONE** - Zero impact

**Current State:**
- Database layer in `lib/db.ts`
- Schema in `sql/schema.sql`
- No presentation logic

**Impact of Design Change:**
- No changes required
- Purely back-end integration

---

### 4.3 Cloudflare R2 File Storage
**Risk Level:** ✅ **LOW** - Image display only

**Current State:**
- Upload API at `/app/api/upload/route.ts`
- Image processing in `lib/r2-upload.ts`
- Portfolio images, artist photos stored on R2

**Impact of Design Change:**
- Portfolio grids need new layout (filmstrip style)
- Artist cards need new image border radius (28px)
- Upload UI needs form styling updates

**Action Items:**
- Update portfolio display component with new grid system
- Apply new border radius to uploaded images
- Test upload flow with new form styling

---

### 4.4 CalDAV Sync (tsdav)
**Risk Level:** 🟡 **MEDIUM** - Calendar UI coupling

**Current State:**
- CalDAV client in `lib/caldav-client.ts`
- Bidirectional sync with Nextcloud calendars
- Calendar UI in admin dashboard

**Impact of Design Change:**
- Styling changes to calendar component (HIGH RISK - see Risk 3)
- Functional sync logic unaffected
- Event display needs new terracotta booked states

**Action Items:**
- Decide on calendar migration strategy (see Risk 3 mitigation)
- Test CalDAV sync after UI changes
- Verify event creation/editing still works

---

### 4.5 Feature Flag System
**Risk Level:** ✅ **LOW** - Actually helps migration

**Current State:**
- Feature flags in `lib/flags.ts`
- Provider in `components/feature-flags-provider.tsx`
- Already used for `ADVANCED_NAV_SCROLL_ANIMATIONS_ENABLED`

**Impact of Design Change:**
- **OPPORTUNITY:** Use flags for progressive rollout
- Add `NEW_DESIGN_ENABLED` flag for page-by-page migration
- Enable testing in production without full deployment

**Action Items:**
- Add `NEW_DESIGN_ENABLED: false` to flags
- Create scoped CSS class `.new-design` for new tokens
- Implement per-page flag checking

---

### 4.6 Deployment Pipeline (OpenNext + Wrangler)
**Risk Level:** 🟡 **MEDIUM** - Build complexity

**Current State:**
- OpenNext build: `npm run pages:build`
- Wrangler deploy: `npm run deploy`
- CI pipeline in `.gitea/workflows/`

**Impact of Design Change:**
- Larger bundle size (see Risk 4)
- Potential build timeouts with more assets
- Wrangler preview for testing staging environment

**Action Items:**
- Update CI to check new bundle budgets
- Test OpenNext build with new CSS system
- Use `npm run preview` for local testing
- Monitor Cloudflare Workers cold start times

---

## 5. Migration Strategy & Roadmap

### 5.1 Phased Approach

**Phase 1: Foundation (Week 1-2)** 🛠️
- [ ] Create `app/globals-new.css` with new design tokens
- [ ] Add Space Grotesk font import to `app/layout.tsx`
- [ ] Create `.new-design` CSS scoping class
- [ ] Add `NEW_DESIGN_ENABLED` feature flag
- [ ] Build isolated design showcase page (`/design-showcase`)
- [ ] Implement new button variants (primary/secondary/ghost)
- [ ] Create new card components (data-card, component-card)
- [ ] Build filmstrip component from design.html

**Deliverable:** Working design system showcase page with all new components

---

**Phase 2: Animation System (Week 2-3)** ⚡
- [ ] Audit all RAF loops and consolidate to single controller
- [ ] Update Lenis config to 0.8s duration, `ease-out` timing
- [ ] Rewrite `useMultiLayerParallax` to `useSingleParallax` (factor: 0.12)
- [ ] Standardize IntersectionObserver threshold to 0.18
- [ ] Remove Framer Motion dependency
- [ ] Implement filmstrip scroll-driven animation
- [ ] Add `prefers-reduced-motion` support to all animations
- [ ] Performance testing (target: 60fps scroll)

**Deliverable:** Optimized animation system with no conflicts

---

**Phase 3: Component Migration (Week 3-5)** 🎨
**Priority Order:**
1. **Public Pages First** (lowest risk)
   - [ ] New homepage hero with glassmorphism
   - [ ] Artists listing page with new grid
   - [ ] Services section with new cards
   - [ ] Contact page with new forms

2. **Booking Flow** (medium risk)
   - [ ] Booking form with new input styles
   - [ ] Artist selection with new cards
   - [ ] Confirmation page

3. **Authentication** (low risk)
   - [ ] Signin page
   - [ ] Error pages

4. **Admin Dashboard** (highest risk - do last)
   - [ ] Stats dashboard with new charts
   - [ ] Portfolio manager
   - [ ] Settings page
   - [ ] **Calendar** (decide on strategy first - see Risk 3)

**Deliverable:** All components using new design system

---

**Phase 4: Testing & Optimization (Week 5-6)** 🧪
- [ ] Visual regression testing on all pages
- [ ] E2E tests for critical flows (booking, authentication, admin)
- [ ] Cross-browser testing (Chrome, Safari, Firefox, mobile)
- [ ] Performance testing (Lighthouse, WebPageTest)
- [ ] Accessibility audit (WCAG 2.1 AA, keyboard navigation)
- [ ] Bundle size analysis (ensure < 3MB total)
- [ ] OpenNext build optimization
- [ ] Reduced motion testing

**Deliverable:** Fully tested, optimized new design

---

**Phase 5: Deployment & Monitoring (Week 6-7)** 🚀
- [ ] Deploy to staging via `npm run preview`
- [ ] QA testing in staging environment
- [ ] Gradual production rollout with feature flags
- [ ] Monitor error rates, performance metrics
- [ ] User feedback collection
- [ ] Remove old CSS system (`globals.css` cleanup)
- [ ] Remove feature flags once stable

**Deliverable:** New design live in production

---

### 5.2 Rollback Strategy

**If Critical Issues Arise:**
1. **Feature Flag Rollback:** Set `NEW_DESIGN_ENABLED = false`
2. **CSS Scoping:** Remove `.new-design` class from pages
3. **Wrangler Rollback:** `wrangler rollback` to previous deployment
4. **Database:** No schema changes = no rollback needed

**Monitoring Alerts:**
- Error rate > 1% in Cloudflare Workers logs
- Lighthouse Performance score < 80
- User complaints via support channels

---

## 6. Developer Experience Journey Map

### Stage 1: DISCOVERY & PLANNING
- **Touchpoints:** Design docs, existing codebase audit, dependency analysis
- **Actions:** Reading design.json, comparing to current globals.css, reviewing component library
- **Emotions:** 😰 Overwhelmed by scope → 🤔 Analytical about conflicts → 💡 Excited by new design
- **Pain Points:**
  - **CRITICAL:** Conflicting CSS variable names (current uses `oklch()`, new uses hex/rgb)
  - Tailwind config doesn't align with new design tokens
  - Existing Lenis smooth scroll vs. new parallax requirements
  - Framer Motion usage conflicts with new animation timing (0.8s vs current 0.6s)
- **Opportunities:**
  - Generate design tokens from design.json automatically
  - Create migration script for CSS variables
  - Build codemods for component updates

### Stage 2: FOUNDATION SETUP
- **Touchpoints:** `globals.css`, `tailwind.config.ts`, font imports, CSS variables
- **Actions:** Replacing color system, updating font stack, adding new design tokens
- **Emotions:** ⚡ Confident with clear system → 😬 Nervous about breaking changes → 🎯 Methodical
- **Pain Points:**
  - **HIGH RISK:** Changing `:root` variables breaks ALL existing components at once
  - ShadCN components expect specific variable names (`--primary`, `--accent`, etc.)
  - Playfair Display already imported but different weights needed (400, 600 vs current)
  - Space Grotesk vs Source Sans 3 - font replacement across all components
- **Opportunities:**
  - Run both old and new CSS systems in parallel during migration
  - Create fallback layer using CSS `@supports` or scoped classes
  - Use feature flags to toggle new design on per-page basis

### Stage 3: COMPONENT REFACTORING *(HIGHEST PAIN POINT)*
- **Touchpoints:** 80+ TSX files, ShadCN UI components, custom components
- **Actions:** Updating button variants, card styles, form inputs, typography classes
- **Emotions:** 😓 Tedious and repetitive → 😡 Frustration with edge cases → 🏗️ Building momentum
- **Pain Points:**
  - **BREAKING:** Button component uses CVA variants tied to old color system
  - Form inputs expect `--input` and `--ring` CSS vars (different in new system)
  - Calendar component styling completely different (new: terracotta booked states)
  - Toast notifications use `sonner` library - new design needs custom styling
  - Hero section parallax uses custom hook - conflicts with new filmstrip scroll pattern
  - Navigation scroll animations use `requestAnimationFrame` - may conflict with new Lenis setup
- **Opportunities:**
  - Create new component variants alongside old ones (e.g., `button-v2`)
  - Build Storybook/visual regression testing
  - Incremental rollout: start with new pages, migrate existing gradually

### Stage 4: ANIMATION SYSTEM MIGRATION *(HIGHEST TECHNICAL RISK)*
- **Touchpoints:** Lenis provider, parallax hooks, scroll observers, framer-motion components
- **Actions:** Updating timing functions, replacing animations, adding filmstrip scroll
- **Emotions:** 🧪 Experimental → 🐛 Debugging performance → 😌 Relief when smooth
- **Pain Points:**
  - **CRITICAL CONFLICT:** Current Lenis (1.2s duration custom easing) vs new (0.8s ease-out standard)
  - Existing parallax hook uses multi-layer system - new design uses single factor (0.12)
  - IntersectionObserver threshold differs (current: 0.15-0.18, new: 0.18 only)
  - Framer Motion stagger animations (50-100ms) vs new design (50-150ms)
  - Multiple `requestAnimationFrame` loops could cause performance degradation
  - tw-animate-css library may conflict with new custom keyframes
- **Opportunities:**
  - Consolidate all RAF loops into single animation controller
  - Remove framer-motion dependency (bundle size win)
  - Implement new filmstrip component as showcase feature
  - Performance budget improvements with simpler animations

### Stage 5: INTEGRATION TESTING
- **Touchpoints:** Admin dashboard, artist dashboard, booking forms, CalDAV calendar
- **Actions:** Testing critical user flows, verifying integrations still work
- **Emotions:** 🔍 Meticulous → 😨 Panic at broken features → 🛠️ Problem-solving mode
- **Pain Points:**
  - **HIGH RISK:** Admin calendar uses react-big-calendar with custom CSS - could break entirely
  - Booking form validation tied to form component styling
  - Artist portfolio image grids use custom masonry layout - needs redesign
  - Mobile responsive breakpoints differ (current: 720px, 1024px / new: 720px only)
  - NextAuth signin page styling breaks if not updated
- **Opportunities:**
  - E2E test suite ensures no regressions
  - Automated visual regression tests catch styling breaks
  - Feature flag rollout allows testing in production safely

### Stage 6: PERFORMANCE OPTIMIZATION
- **Touchpoints:** Bundle analysis, Lighthouse scores, animation performance
- **Actions:** Removing unused CSS, optimizing animations, lazy loading
- **Emotions:** 📊 Data-driven → 🚀 Optimizing → 🎉 Celebrating improvements
- **Pain Points:**
  - New design has larger image assets (plaster textures, grain overlays)
  - SVG grid texture in body::after could impact paint performance
  - Multiple backdrop-filter instances (blur) are expensive on mobile
  - Filmstrip with large images needs virtual scrolling or lazy loading
- **Opportunities:**
  - Remove old CSS system after migration complete (-50KB)
  - Optimize new texture overlays with CSS containment
  - Implement `will-change` hints strategically
  - Meet or beat current bundle budgets (3MB total, 1.5MB assets)

### Stage 7: DEPLOYMENT & MONITORING
- **Touchpoints:** OpenNext build, Cloudflare Workers (via Wrangler), D1 database, R2 assets, production users
- **Actions:** Staged rollout, monitoring errors, gathering feedback
- **Emotions:** 🤞 Hopeful → 👀 Vigilant → 😅 Relief when stable
- **Pain Points:**
  - **OpenNext SSR/SSG build** with new CSS bundle size
  - Cloudflare Workers cold start performance with larger static assets
  - Workers runtime limits (CPU time, memory) with new animation JS
  - Users on slow connections see FOUC (flash of unstyled content)
  - Mobile users with motion sensitivity need `prefers-reduced-motion` support
- **Opportunities:**
  - Use OpenNext static optimization for critical CSS inlining
  - Leverage Wrangler preview for testing before production deploy
  - Edge caching strategies for new design assets on R2
  - Analytics to track user engagement with new design

**Deployment Commands:**
- Build: `npm run pages:build` (OpenNext compilation)
- Preview: `npm run preview` (OpenNext local preview)
- Deploy: `npm run deploy` (Wrangler deploys to Cloudflare Workers)

### Key Insights from Journey Map

**Critical Success Factors:**
1. **Parallel CSS System** - Run old and new simultaneously during migration
2. **Feature Flags** - Page-by-page rollout reduces blast radius
3. **Animation Consolidation** - Single RAF loop prevents performance issues
4. **Component Library Versioning** - Maintain backward compatibility

**Highest Risk Areas (Prioritize These):**
1. 🔴 **Animation System Conflicts** - Lenis + parallax + filmstrip interactions
2. 🔴 **CSS Variable Breaking Changes** - ShadCN expects specific names
3. 🟡 **Calendar Integration** - react-big-calendar styling fragility
4. 🟡 **Mobile Performance** - Backdrop filters and texture overlays

**Quick Wins (Do These First):**
1. ✅ Create new design token CSS file (standalone)
2. ✅ Build new hero section as isolated component
3. ✅ Implement filmstrip on new dedicated page
4. ✅ Test reduced motion support across all animations

**Automation Opportunities:**
- CSS variable migration script
- Component prop mapping codemod
- Visual regression test suite
- Bundle size monitoring alerts

---

## 7. Testing & Validation Requirements

### 7.1 Automated Testing

**Visual Regression:**
- Tool: Playwright + Percy or Chromatic
- Coverage: All 50+ pages, 3 breakpoints (mobile, tablet, desktop)
- Baseline: Capture before migration
- Validation: <5% pixel difference tolerance

**E2E Tests (Vitest + Testing Library):**
```typescript
describe('Booking Flow - New Design', () => {
  it('allows user to book appointment with new form styles')
  it('displays terracotta focus states on form inputs')
  it('shows new toast notifications on submission')
  it('handles validation errors with new styling')
})

describe('Admin Calendar - New Design', () => {
  it('renders calendar grid with terracotta booked states')
  it('syncs with CalDAV after styling changes')
  it('allows drag-and-drop with new component')
})
```

**Performance Tests:**
- Lighthouse CI: Performance > 90, Accessibility > 95
- WebPageTest: First Contentful Paint < 1.5s
- Animation FPS: Maintain 60fps during scroll
- Bundle size: Stay under 3MB total

---

### 7.2 Manual QA Checklist

**Cross-Browser:**
- [ ] Chrome (desktop & mobile)
- [ ] Safari (macOS & iOS)
- [ ] Firefox
- [ ] Edge

**Accessibility:**
- [ ] Keyboard navigation works on all interactive elements
- [ ] Focus states visible (new rose outline)
- [ ] Screen reader testing (NVDA, VoiceOver)
- [ ] Color contrast meets WCAG AA (4.5:1 for text)
- [ ] Reduced motion preference respected

**Critical User Flows:**
- [ ] Homepage → Artists → Book Appointment
- [ ] User login via Nextcloud OAuth
- [ ] Admin dashboard access and calendar interaction
- [ ] Portfolio upload and display
- [ ] Contact form submission

**Responsive Design:**
- [ ] Sticky navigation collapses at 720px
- [ ] Hero section readable on mobile (50vh height)
- [ ] Forms stack vertically on mobile
- [ ] Filmstrip becomes horizontally scrollable

---

## 8. Performance Considerations

### 8.1 Bundle Size Optimization

**Current Baseline:**
- Total static: ~2.5MB
- Largest asset: ~800KB (hero image)

**Projected After Migration:**
- Remove Framer Motion: -50KB ✅
- Add Space Grotesk: +40KB
- New CSS system: +30KB
- Plaster textures (optimized WebP): +100KB
- **Net change:** +120KB (well under 3MB budget)

**Optimization Strategies:**
1. **Font Subsetting:** Use `next/font/google` with `subsets: ['latin']`
2. **Image Optimization:** Sharp for processing, WebP format, responsive srcsets
3. **Code Splitting:** Lazy load filmstrip, admin components
4. **Tree Shaking:** Ensure unused ShadCN components excluded
5. **CSS Purging:** Remove old `oklch()` system after migration

---

### 8.2 Runtime Performance

**Target Metrics:**
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3.5s
- Cumulative Layout Shift: < 0.1
- Animation FPS: 60fps (16.67ms/frame)

**Performance Risks:**
1. **Backdrop Filters:** Expensive on mobile - use sparingly
2. **SVG Grid Texture:** `mix-blend-mode: multiply` on fixed position
3. **Multiple RAF Loops:** Consolidate to single controller
4. **IntersectionObserver:** Batch observations with `rootMargin`

**Mitigation:**
- Use `will-change` hints strategically (only during animation)
- Implement `content-visibility: auto` for offscreen content
- Lazy load images with `loading="lazy"`
- Use CSS containment where appropriate

---

### 8.3 Cloudflare Workers Considerations

**Workers Limits:**
- Script size: 1MB (after compression)
- CPU time: 50ms (free plan)
- Memory: No hard limit (generous)

**OpenNext Optimizations:**
- Static optimization for critical CSS inlining
- Edge caching for assets on R2
- Proper cache headers for immutable assets

**Monitoring:**
- Cloudflare Analytics for origin requests
- Workers Trace Events for debugging
- Custom logging for error tracking

---

## 9. Recommendations & Next Steps

### 9.2 Strategic Decisions Needed

**Decision 1: Calendar Migration Strategy**
**Options:**
- A) Keep admin calendar with old design (conservative)
- B) Build custom calendar with `react-day-picker` (recommended)
- C) Override `react-big-calendar` CSS (high maintenance)

**Recommendation:** **Option B** - Build custom calendar
- Full design control
- Better long-term maintainability
- CalDAV sync logic remains unchanged

---

**Decision 2: Parallel CSS vs Sequential Migration**
**Options:**
- A) Dual CSS system with scoped classes (recommended)
- B) Big bang replacement (high risk)
- C) Page-by-page with separate CSS files (complex)

**Recommendation:** **Option A** - Dual CSS system
- Lowest risk approach
- Enables incremental rollout
- Easy rollback if issues arise

---

**Decision 3: Framer Motion Removal Timing**
**Options:**
- A) Remove immediately and use CSS (recommended)
- B) Keep during migration for compatibility
- C) Hybrid approach (remove from new components only)

**Recommendation:** **Option A** - Remove immediately
- 50KB bundle size savings
- Simpler animation debugging
- New design doesn't need complex motion

---

### 9.3 Success Criteria

**Technical Metrics:**
- ✅ All pages render without visual regressions
- ✅ Lighthouse Performance > 90
- ✅ Lighthouse Accessibility > 95
- ✅ Bundle size < 3MB total
- ✅ 60fps scroll performance
- ✅ All E2E tests passing
- ✅ Zero console errors in production

**Business Metrics:**
- ✅ No increase in error rates
- ✅ No increase in bounce rates
- ✅ Positive user feedback on new design
- ✅ Booking conversion rate maintained or improved

**Timeline:**
- **Phase 1-2:** 2-3 weeks (Foundation + Animation)
- **Phase 3:** 2-3 weeks (Component Migration)
- **Phase 4:** 1 week (Testing)
- **Phase 5:** 1 week (Deployment)
- **Total:** 6-7 weeks for complete migration

---

## Conclusion

The migration to the new United Tattoo design language is **technically feasible** with **moderate-to-high risk** that can be effectively mitigated through:

1. **Incremental rollout** using feature flags
2. **Parallel CSS systems** to avoid breaking changes
3. **Animation consolidation** to prevent performance issues
4. **Custom calendar component** to avoid fragile third-party styling

The **highest priority risks** to address immediately are:
1. 🔴 CSS variable breaking changes (dual system approach)
2. 🔴 Animation system conflicts (RAF consolidation)
3. 🟡 Calendar integration (custom build recommended)

---

**End of Technical Research Report**

Generated: 2025-11-24
Total Analysis Time: Comprehensive codebase audit + design system review
Risk Areas Identified: 7 (4 high, 3 medium)
Migration Timeline: 6-7 weeks
Deployment Strategy: Incremental with feature flags
