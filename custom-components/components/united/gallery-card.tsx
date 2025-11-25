import * as React from "react"
import { cn } from "@/lib/utils"

export interface GalleryCardProps extends React.HTMLAttributes<HTMLElement> {
  src: string
  alt: string
  label: string
  aspectRatio?: string
}

const GalleryCard = React.forwardRef<HTMLElement, GalleryCardProps>(
  ({ className, src, alt, label, aspectRatio = "3/4", ...props }, ref) => {
    return (
      <figure ref={ref} className={cn("m-0 group", className)} {...props}>
        <div
          className={cn(
            "rounded-[28px] overflow-hidden mb-4",
            "shadow-[var(--shadow-lg)]",
            "transition-all duration-300 ease-out",
            "group-hover:-translate-y-1.5 group-hover:shadow-[var(--shadow-bloom)]",
          )}
          style={{ aspectRatio }}
        >
          <img
            src={src || "/placeholder.svg"}
            alt={alt}
            className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
          />
        </div>
        <figcaption className="text-[0.7rem] uppercase tracking-[0.25em] opacity-80">{label}</figcaption>
      </figure>
    )
  },
)
GalleryCard.displayName = "GalleryCard"

export { GalleryCard }
