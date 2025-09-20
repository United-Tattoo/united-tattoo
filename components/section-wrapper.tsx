import * as React from "react"
import { cn } from "@/lib/utils"

type SectionWrapperProps = React.HTMLAttributes<HTMLElement>

/**
 * SectionWrapper
 * - Standardizes horizontal paddings and responsive behavior for page sections.
 * - Use this to ensure consistent px and breakpoint paddings across pages.
 *
 * Default classes:
 * - px-8 lg:px-16
 */
export function SectionWrapper({ className, children, ...props }: SectionWrapperProps) {
  return (
    <section className={cn("px-8 lg:px-16", className)} {...props}>
      {children}
    </section>
  )
}

export default SectionWrapper
