import { cn } from "@/lib/utils"

export interface SectionProps {
  /** Section title (optional) */
  title?: string
  /** Subtitle or description (optional) */
  subtitle?: string
  /** Content to render inside the section */
  children: React.ReactNode
  /** Additional CSS classes */
  className?: string
  /** ID for anchor links */
  id?: string
  /** Background variant */
  variant?: "default" | "muted" | "accent"
  /** Padding size */
  size?: "sm" | "md" | "lg" | "xl"
}

const variantStyles = {
  default: "bg-background",
  muted: "bg-sand/30",
  accent: "bg-burnt/5",
}

const sizeStyles = {
  sm: "py-8 md:py-12",
  md: "py-12 md:py-16",
  lg: "py-16 md:py-24",
  xl: "py-24 md:py-32",
}

/**
 * Reusable section wrapper for content pages
 *
 * @example
 * ```tsx
 * <Section title="Our Services" subtitle="What we offer">
 *   <Grid columns={3}>
 *     <Card title="Custom Tattoos" />
 *   </Grid>
 * </Section>
 * ```
 */
export function Section({
  title,
  subtitle,
  children,
  className,
  id,
  variant = "default",
  size = "md",
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        variantStyles[variant],
        sizeStyles[size],
        "px-4 md:px-8 lg:px-16",
        className
      )}
    >
      <div className="max-w-7xl mx-auto">
        {(title || subtitle) && (
          <div className="text-center mb-10 md:mb-16">
            {title && (
              <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-semibold text-ink tracking-tight mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="font-grotesk text-lg md:text-xl text-charcoal/70 max-w-3xl mx-auto leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  )
}

