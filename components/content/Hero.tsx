import { cn } from "@/lib/utils"
import Link from "next/link"

export interface HeroProps {
  /** Main heading */
  title: string
  /** Subtitle or description (optional) */
  subtitle?: string
  /** Background image URL */
  backgroundImage?: string
  /** Call to action button */
  cta?: {
    text: string
    href: string
    variant?: "primary" | "secondary" | "outline"
  }
  /** Secondary CTA (optional) */
  secondaryCta?: {
    text: string
    href: string
  }
  /** Additional CSS classes */
  className?: string
  /** Height variant */
  size?: "sm" | "md" | "lg" | "full"
  /** Overlay opacity (0-100) */
  overlayOpacity?: number
  /** Text alignment */
  align?: "left" | "center" | "right"
}

const sizeStyles = {
  sm: "min-h-[400px]",
  md: "min-h-[500px]",
  lg: "min-h-[600px]",
  full: "min-h-screen",
}

const alignStyles = {
  left: "text-left items-start",
  center: "text-center items-center",
  right: "text-right items-end",
}

const buttonVariants = {
  primary: "bg-burnt hover:bg-burnt/90 text-white shadow-button-primary hover:shadow-button-primary-hover",
  secondary: "bg-terracotta hover:bg-terracotta/90 text-white shadow-button-secondary hover:shadow-button-secondary-hover",
  outline: "border-2 border-white text-white hover:bg-white hover:text-ink",
}

/**
 * Full-width hero section for page headers
 *
 * @example
 * ```tsx
 * <Hero
 *   title="Welcome to United Tattoo"
 *   subtitle="Professional tattoo artistry in Fountain, CO"
 *   backgroundImage="/images/hero.jpg"
 *   cta={{ text: "Book Now", href: "/book" }}
 * />
 * ```
 */
export function Hero({
  title,
  subtitle,
  backgroundImage,
  cta,
  secondaryCta,
  className,
  size = "md",
  overlayOpacity = 50,
  align = "center",
}: HeroProps) {
  return (
    <div
      className={cn(
        "relative flex justify-center",
        sizeStyles[size],
        alignStyles[align],
        "px-4 md:px-8 lg:px-16",
        className
      )}
    >
      {/* Background image */}
      {backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-charcoal"
        style={{ opacity: overlayOpacity / 100 }}
      />

      {/* Content */}
      <div
        className={cn(
          "relative z-10 flex flex-col justify-center py-20",
          alignStyles[align],
          align === "center" && "max-w-4xl mx-auto"
        )}
      >
        <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white tracking-tight mb-6 leading-tight">
          {title}
        </h1>

        {subtitle && (
          <p className="font-grotesk text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl mb-10 leading-relaxed">
            {subtitle}
          </p>
        )}

        {(cta || secondaryCta) && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {cta && (
              <Link
                href={cta.href}
                className={cn(
                  "inline-flex items-center justify-center px-8 py-4 rounded-xl font-grotesk font-medium text-lg transition-all duration-300",
                  buttonVariants[cta.variant || "primary"]
                )}
              >
                {cta.text}
              </Link>
            )}
            {secondaryCta && (
              <Link
                href={secondaryCta.href}
                className={cn(
                  "inline-flex items-center justify-center px-8 py-4 rounded-xl font-grotesk font-medium text-lg transition-all duration-300",
                  buttonVariants.outline
                )}
              >
                {secondaryCta.text}
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

