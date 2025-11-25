import * as React from "react"
import { cn } from "@/lib/utils"

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, level = 2, children, ...props }, ref) => {
    const baseClasses = cn(
      "font-serif font-normal",
      level === 1 && "text-[clamp(2.5rem,5vw,3.8rem)] leading-[1.1] tracking-tight mb-5",
      level === 2 && "text-[clamp(1.9rem,4vw,3rem)] leading-[1.15] mb-4",
      level === 3 && "text-[0.95rem] font-sans font-semibold uppercase tracking-[0.2em] text-[var(--moss)] mb-3",
      level === 4 && "text-[0.85rem] font-sans font-semibold tracking-[0.2em] mb-2",
      className,
    )

    if (level === 1) {
      return (
        <h1 ref={ref} className={baseClasses} {...props}>
          {children}
        </h1>
      )
    }
    if (level === 2) {
      return (
        <h2 ref={ref} className={baseClasses} {...props}>
          {children}
        </h2>
      )
    }
    if (level === 3) {
      return (
        <h3 ref={ref} className={baseClasses} {...props}>
          {children}
        </h3>
      )
    }
    return (
      <h4 ref={ref} className={baseClasses} {...props}>
        {children}
      </h4>
    )
  },
)
Heading.displayName = "Heading"

export { Heading }
