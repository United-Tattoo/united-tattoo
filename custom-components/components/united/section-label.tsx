import * as React from "react"
import { cn } from "@/lib/utils"

export interface SectionLabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  number?: string
}

const SectionLabel = React.forwardRef<HTMLSpanElement, SectionLabelProps>(
  ({ className, number, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "block text-[0.75rem] font-semibold uppercase tracking-[0.3em] text-[var(--moss)] mb-3",
          className,
        )}
        {...props}
      >
        {number && <>{number} • </>}
        {children}
      </span>
    )
  },
)
SectionLabel.displayName = "SectionLabel"

export { SectionLabel }
