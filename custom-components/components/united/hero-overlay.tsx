import * as React from "react"
import { cn } from "@/lib/utils"

export interface HeroOverlayProps extends React.HTMLAttributes<HTMLDivElement> {}

const HeroOverlay = React.forwardRef<HTMLDivElement, HeroOverlayProps>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "w-[min(620px,90vw)] p-[clamp(2rem,4vw,3.5rem)]",
        "bg-[rgba(242,227,208,0.85)]",
        "rounded-[24px]",
        "border border-[rgba(36,27,22,0.08)]",
        "shadow-[var(--shadow-lg)]",
        "backdrop-blur-[12px] backdrop-saturate-[110%]",
        "text-center",
        className,
      )}
      {...props}
    />
  )
})
HeroOverlay.displayName = "HeroOverlay"

export { HeroOverlay }
