# Implementation Plan

[Overview]
Improve the mobile experience of the homepage while preserving the current desktop appearance, focusing on easier navigation and a beautiful, performant presentation.

The current homepage uses large full-screen sections, a parallax hero, and multi-column artist/service layouts that look strong on desktop. On small screens, some patterns (e.g., full-screen stacked service sections, two-column contact layout, and a top nav that hides until scrolling) reduce wayfinding and increase friction. This plan adds a mobile-first layer: a persistent bottom “Book Now” bar, a swipeable carousel for Services, stacked Contact content, and mobile visibility improvements to the top navigation—all gated behind responsive Tailwind classes (lg: variants) to ensure desktop remains unchanged.

We will leverage existing shadcn/ui primitives, the shipped Embla Carousel, and Tailwind responsive utilities. No new dependencies are required. Changes are scoped to the homepage and components it renders. All animations and transforms are limited on mobile to maintain performance and reduce jank.

[Types]  
Introduce lightweight UI types to improve clarity for mobile-only components.

- export type SectionId = "home" | "artists" | "services" | "contact"
- export interface Service {
  title: string
  description: string
  features: string[]
  price: string
  bgColor?: string
  image?: string
}
- export interface MobileBookingBarProps {
  label?: string
  href: string
  show?: boolean
}

Notes:
- The `services` data already lives inline in components/services-section.tsx; we’ll co-locate the `Service` interface in the new mobile carousel component or in that file to keep cohesion.
- SectionId is useful for navigation/active state logic if needed in future refactors.
- Props are optional and defaulted to keep components ergonomic.

[Files]
Add mobile-only components and apply responsive modifications to existing files. No deletions; all desktop code paths remain intact.

New files:
- components/mobile-booking-bar.tsx
  - Purpose: Persistent bottom CTA bar (only on small screens) linking to /book. Uses safe-area insets and elevated z-index. Hidden on lg and up.
- components/services-mobile-carousel.tsx
  - Purpose: Mobile-only swipeable carousel rendering the same services content in a compact, card-first format using shadcn/ui Carousel (Embla).
  - Accepts `services: Service[]` or imports from the same module if kept inline for a single source of truth.

Existing files to modify:
- app/page.tsx
  - Add `<MobileBookingBar />` just after `<Navigation />` so it’s globally available on the homepage. Guard with `lg:hidden`.
- components/navigation.tsx
  - Ensure the top nav is visible and interactive at the top of the page on mobile (currently hidden until scroll due to `opacity-0 pointer-events-none`).
  - Add small-screen behavior: always visible container on mobile with subtle transparent backdrop; keep existing behavior on desktop.
- components/services-section.tsx
  - Replace current mobile `lg:hidden` full-screen stack with the new mobile carousel.
  - Keep desktop split composition and scrolling experience unchanged (guard with `lg:`).
- components/contact-section.tsx
  - Convert the fixed `w-1/2` two-column layout into a stacked mobile layout (`flex-col`, `w-full lg:w-1/2`) while preserving the current desktop (`lg:flex-row`).
  - Keep brand background and parallax but dampen/limit on mobile to reduce jank.
- styles/globals.css (no structural changes required)
  - Optional: add CSS note for safe-area usage reference; final implementation will rely on inline styles/Tailwind utilities.

Files to delete or move:
- None.

Configuration updates:
- None required. Tailwind and shadcn/ui already configured. `embla-carousel-react` is present.

[Functions]
Add mobile-only components and adjust existing components with mobile-guarded branches. All changes are responsive-only to avoid altering desktop.

New functions/components:
- components/mobile-booking-bar.tsx
  - export function MobileBookingBar(props: MobileBookingBarProps): JSX.Element
  - Renders fixed bottom bar (safe-area aware) with a prominent “Book Now” button linking to /book. `className` uses `lg:hidden` to ensure desktop is unaffected.
- components/services-mobile-carousel.tsx
  - export function ServicesMobileCarousel({ services }: { services: Service[] }): JSX.Element
  - Uses shadcn/ui Carousel primitives: `Carousel`, `CarouselContent`, `CarouselItem`, `CarouselNext`, `CarouselPrevious`.
  - Card layout: service title, short copy, features, price, and a “Book Now” button. Optimized tap targets.

Modified functions/components:
- app/page.tsx (default export HomePage)
  - Insert `<MobileBookingBar />` after `<Navigation />`.
- components/navigation.tsx (export function Navigation)
  - Add `isMobile` calculation (e.g., via matchMedia or an existing `use-mobile` hook) and adjust the className logic:
    - On mobile: show nav at top by default with interactive controls (remove `pointer-events-none`/`opacity-0` at top of page).
    - On desktop: preserve current behavior and styles.
- components/services-section.tsx (export function ServicesSection)
  - Import and render `<ServicesMobileCarousel />` in a `lg:hidden` block.
  - Keep existing left menu + right scroller solely in `lg:` scope.
- components/contact-section.tsx (export function ContactSection)
  - Wrap main two columns with `flex-col lg:flex-row`; change each child to `w-full lg:w-1/2`.
  - Ensure spacing/padding on mobile is comfortable; no changes to desktop classes.

Removed functions/components:
- None. We only replace the mobile branch of Services with a carousel but keep the desktop branch untouched.

[Classes]
No class-based components. All are function components.
- New components use React function components with TypeScript props.
- No inheritance changes.

[Dependencies]
No new dependencies.
- `embla-carousel-react` already present and shadcn/ui `components/ui/carousel.tsx` is in the repo.
- No package.json updates required.

[Testing]
Targeted mobile validation across breakpoints without impacting desktop.
- Manual QA on common device widths (e.g., 360, 390, 414, 768).
- Verify:
  - Navigation is visible at top on mobile and toggles the drawer correctly.
  - Persistent bottom “Book Now” bar is present on the homepage and does not overlap footer content (safe-area works on iOS).
  - Services are swipeable; arrows and swipe gestures function; CTAs navigate to /book.
  - Contact section stacks vertically and fields remain accessible.
  - Desktop (≥ lg) remains pixel-identical to current implementation.
- Optional: lightweight React Testing Library tests for rendering/mobile-only presence toggles.
- Optional: Playwright e2e smoke for scroll, nav toggle, carousel swipe on a preview environment.

[Implementation Order]
Implement mobile-only components first, then integrate into the homepage and adjust existing sections, verifying desktop remains unchanged after each step.

1) Create components/mobile-booking-bar.tsx (persistent bottom CTA; `lg:hidden`; safe-area support).
2) Create components/services-mobile-carousel.tsx (Embla-based; card layout; `lg:hidden` wrapper usage).
3) Integrate MobileBookingBar into app/page.tsx (just after Navigation).
4) Modify components/services-section.tsx to use the new mobile carousel and keep the existing desktop implementation behind `lg:` guards. Remove/replace the current mobile `lg:hidden` full-screen stack.
5) Adjust components/contact-section.tsx to stack on mobile (`flex-col`, `w-full lg:w-1/2`) and retain current desktop layout.
6) Update components/navigation.tsx to ensure the nav is visible and interactive at top on mobile (leave desktop behavior intact).
7) QA: Verify mobile behaviors across breakpoints, then confirm desktop visual/behavioral parity.
8) Polish: Confirm safe-area, hit-target sizes, and accessible labels; check scroll-to-section offsets still correct on mobile.
