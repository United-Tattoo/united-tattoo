/**
 * Content Component Library for United Tattoo
 *
 * Pre-built, reusable components for quickly creating marketing and content pages.
 * All components follow the United Tattoo 2026 Design System.
 *
 * @example
 * ```tsx
 * import { Hero, Section, Grid, ContentCard, CallToAction } from '@/components/content'
 *
 * export default function ServicesPage() {
 *   return (
 *     <>
 *       <Hero
 *         title="Our Services"
 *         subtitle="Professional tattoo artistry"
 *         backgroundImage="/images/hero.jpg"
 *       />
 *
 *       <Section title="What We Offer">
 *         <Grid columns={3}>
 *           <ContentCard
 *             title="Custom Tattoos"
 *             description="Work with our artists"
 *             image="/images/custom.jpg"
 *             href="/book"
 *           />
 *         </Grid>
 *       </Section>
 *
 *       <CallToAction
 *         title="Ready to get inked?"
 *         primaryAction={{ text: "Book Now", href: "/book" }}
 *         variant="gradient"
 *       />
 *     </>
 *   )
 * }
 * ```
 */

export { Section } from "./Section"
export type { SectionProps } from "./Section"

export { Hero } from "./Hero"
export type { HeroProps } from "./Hero"

export { ContentCard } from "./Card"
export type { ContentCardProps } from "./Card"

export { Grid } from "./Grid"
export type { GridProps } from "./Grid"

export { CallToAction } from "./CallToAction"
export type { CallToActionProps } from "./CallToAction"

