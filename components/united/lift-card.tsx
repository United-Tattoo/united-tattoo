"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface LiftCardProps extends React.HTMLAttributes<HTMLDivElement> {}

const LiftCard = React.forwardRef<HTMLDivElement, LiftCardProps>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "p-6 bg-white rounded-[12px]",
        "shadow-[var(--shadow-subtle)]",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-1 hover:shadow-[var(--shadow-bloom)]",
        "cursor-default",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
})
LiftCard.displayName = "LiftCard"

export { LiftCard }
