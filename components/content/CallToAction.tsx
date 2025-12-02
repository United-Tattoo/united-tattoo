import { cn } from "@/lib/utils"
import Link from "next/link"

export interface CallToActionProps {
  /** Main heading */
  title: string
  /** Description text */
  description?: string
  /** Primary button */
  primaryAction: {
    text: string
    href: string
  }
  /** Secondary button (optional) */
  secondaryAction?: {
    text: string
    href: string
  }
  /** Additional CSS classes */
  className?: string
  /** Background variant */
  variant?: "default" | "dark" | "accent" | "gradient"
  /** Text alignment */
  align?: "left" | "center"
}

const variantStyles = {
  default: "bg-sand/50 text-ink",
  dark: "bg-charcoal text-white",
  accent: "bg-burnt/10 text-ink",
  gradient: "bg-gradient-to-r from-burnt to-terracotta text-white",
}

const buttonPrimary = {
  default: "bg-burnt hover:bg-burnt/90 text-white shadow-button-primary hover:shadow-button-primary-hover",
  dark: "bg-white hover:bg-sand text-charcoal",
  accent: "bg-burnt hover:bg-burnt/90 text-white shadow-button-primary hover:shadow-button-primary-hover",
  gradient: "bg-white hover:bg-sand text-burnt",
}

const buttonSecondary = {
  default: "border-2 border-burnt text-burnt hover:bg-burnt hover:text-white",
  dark: "border-2 border-white text-white hover:bg-white hover:text-charcoal",
  accent: "border-2 border-burnt text-burnt hover:bg-burnt hover:text-white",
  gradient: "border-2 border-white text-white hover:bg-white hover:text-burnt",
}

/**
 * Call-to-action section for prompting user action
 *
 * @example
 * ```tsx
 * <CallToAction
 *   title="Ready to get inked?"
 *   description="Book your consultation today"
 *   primaryAction={{ text: "Book Now", href: "/book" }}
 *   secondaryAction={{ text: "View Artists", href: "/artists" }}
 *   variant="gradient"
 * />
 * ```
 */
export function CallToAction({
  title,
  description,
  primaryAction,
  secondaryAction,
  className,
  variant = "default",
  align = "center",
}: CallToActionProps) {
  return (
    <div
      className={cn(
        "px-4 md:px-8 lg:px-16 py-16 md:py-24 rounded-3xl",
        variantStyles[variant],
        className
      )}
    >
      <div
        className={cn(
          "max-w-4xl mx-auto",
          align === "center" && "text-center",
          align === "left" && "text-left"
        )}
      >
        <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight mb-4">
          {title}
        </h2>

        {description && (
          <p
            className={cn(
              "font-grotesk text-lg md:text-xl leading-relaxed mb-8",
              variant === "dark" || variant === "gradient"
                ? "opacity-90"
                : "text-charcoal/70"
            )}
          >
            {description}
          </p>
        )}

        <div
          className={cn(
            "flex flex-col sm:flex-row gap-4",
            align === "center" && "justify-center",
            align === "left" && "justify-start"
          )}
        >
          <Link
            href={primaryAction.href}
            className={cn(
              "inline-flex items-center justify-center px-8 py-4 rounded-xl font-grotesk font-medium text-lg transition-all duration-300",
              buttonPrimary[variant]
            )}
          >
            {primaryAction.text}
          </Link>

          {secondaryAction && (
            <Link
              href={secondaryAction.href}
              className={cn(
                "inline-flex items-center justify-center px-8 py-4 rounded-xl font-grotesk font-medium text-lg transition-all duration-300",
                buttonSecondary[variant]
              )}
            >
              {secondaryAction.text}
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

