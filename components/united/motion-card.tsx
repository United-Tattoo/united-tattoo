import * as React from "react"
import { cn } from "@/lib/utils"

export interface MotionCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description: string
  highlight?: "burnt" | "terracotta"
}

const MotionCard = React.forwardRef<HTMLDivElement, MotionCardProps>(
  ({ className, title, description, highlight = "burnt", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("p-6 bg-white rounded-[18px]", "shadow-[var(--shadow-subtle)]", className)}
        {...props}
      >
        <strong className={cn("block", highlight === "burnt" ? "text-[var(--burnt)]" : "text-[var(--terracotta)]")}>
          {title}
        </strong>
        <p className="text-[0.9rem] mt-2 mb-0 opacity-80">{description}</p>
      </div>
    )
  },
)
MotionCard.displayName = "MotionCard"

export { MotionCard }
