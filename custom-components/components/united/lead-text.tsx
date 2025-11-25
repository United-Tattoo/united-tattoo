import * as React from "react"
import { cn } from "@/lib/utils"

export interface LeadTextProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const LeadText = React.forwardRef<HTMLParagraphElement, LeadTextProps>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn(
        "text-[clamp(0.95rem,2vw,1.3rem)] text-[rgba(31,27,23,0.75)]",
        "max-w-[54ch] leading-relaxed",
        className,
      )}
      {...props}
    />
  )
})
LeadText.displayName = "LeadText"

export { LeadText }
