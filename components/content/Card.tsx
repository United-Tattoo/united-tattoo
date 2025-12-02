import { cn } from "@/lib/utils"
import Link from "next/link"

export interface ContentCardProps {
  /** Card title */
  title: string
  /** Description text */
  description?: string
  /** Image URL */
  image?: string
  /** Image alt text */
  imageAlt?: string
  /** Link URL (makes entire card clickable) */
  href?: string
  /** Icon component (optional, replaces image) */
  icon?: React.ReactNode
  /** Additional CSS classes */
  className?: string
  /** Card variant */
  variant?: "default" | "elevated" | "outlined" | "ghost"
  /** Aspect ratio for image */
  aspectRatio?: "square" | "video" | "portrait" | "auto"
}

const variantStyles = {
  default: "bg-card border border-sage/10 shadow-sm hover:shadow-md",
  elevated: "bg-card shadow-md hover:shadow-lg",
  outlined: "bg-transparent border-2 border-sage/20 hover:border-burnt/30",
  ghost: "bg-transparent hover:bg-sand/30",
}

const aspectRatioStyles = {
  square: "aspect-square",
  video: "aspect-video",
  portrait: "aspect-[3/4]",
  auto: "",
}

/**
 * Versatile card component for content pages
 *
 * @example
 * ```tsx
 * <Card
 *   title="Custom Tattoos"
 *   description="Work with our artists to create your dream piece"
 *   image="/images/custom.jpg"
 *   href="/book"
 * />
 * ```
 */
export function ContentCard({
  title,
  description,
  image,
  imageAlt,
  href,
  icon,
  className,
  variant = "default",
  aspectRatio = "video",
}: ContentCardProps) {
  const CardWrapper = href ? Link : "div"
  const wrapperProps = href ? { href } : {}

  return (
    <CardWrapper
      {...wrapperProps}
      className={cn(
        "block group rounded-2xl overflow-hidden transition-all duration-300",
        variantStyles[variant],
        href && "cursor-pointer",
        className
      )}
    >
      {/* Image or Icon */}
      {(image || icon) && (
        <div className={cn("relative overflow-hidden", aspectRatioStyles[aspectRatio])}>
          {image ? (
            <img
              src={image}
              alt={imageAlt || title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : icon ? (
            <div className="w-full h-full flex items-center justify-center bg-sand/30">
              <div className="text-burnt">{icon}</div>
            </div>
          ) : null}
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        <h3 className="font-playfair text-xl md:text-2xl font-semibold text-ink mb-2 group-hover:text-burnt transition-colors duration-300">
          {title}
        </h3>

        {description && (
          <p className="font-grotesk text-base text-charcoal/70 leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </CardWrapper>
  )
}

