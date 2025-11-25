import * as React from "react"
import { cn } from "@/lib/utils"

export interface StickySplitProps extends React.HTMLAttributes<HTMLDivElement> {
  sidebar: React.ReactNode
  sidebarClassName?: string
}

const StickySplit = React.forwardRef<HTMLDivElement, StickySplitProps>(
  ({ className, sidebar, sidebarClassName, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "grid gap-[clamp(1.5rem,4vw,4rem)]",
          "grid-cols-1 md:grid-cols-[minmax(260px,0.85fr)_minmax(320px,1fr)]",
          className,
        )}
        {...props}
      >
        <aside className={cn("md:sticky md:top-20 md:self-start", sidebarClassName)}>{sidebar}</aside>
        <div>{children}</div>
      </div>
    )
  },
)
StickySplit.displayName = "StickySplit"

export { StickySplit }
