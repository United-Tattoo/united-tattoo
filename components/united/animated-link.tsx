"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface AnimatedLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {}

const AnimatedLink = React.forwardRef<HTMLAnchorElement, AnimatedLinkProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <a
        ref={ref}
        className={cn("relative inline-block text-xl pb-0.5 group", "text-[var(--ink)]", className)}
        {...props}
      >
        {children}
        <span
          className={cn(
            "absolute bottom-0 left-0 w-full h-[2px]",
            "bg-[var(--burnt)]",
            "origin-left scale-x-0",
            "transition-transform duration-300 ease-out",
            "group-hover:scale-x-100",
          )}
        />
      </a>
    )
  },
)
AnimatedLink.displayName = "AnimatedLink"

export { AnimatedLink }
