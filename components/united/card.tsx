import * as React from "react"
import { cn } from "@/lib/utils"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "component" | "motion" | "scroll-step" | "sticky"
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className, variant = "default", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-[22px]",

        variant === "default" && [
          "bg-gradient-to-br from-[rgba(242,227,208,0.95)] to-[rgba(255,247,236,0.9)]",
          "border border-[rgba(122,139,139,0.2)]",
          "shadow-[0_20px_35px_rgba(31,27,23,0.1)]",
          "p-7",
        ],

        variant === "component" && [
          "bg-[rgba(255,255,255,0.88)]",
          "border border-[rgba(31,27,23,0.08)]",
          "rounded-[18px]",
          "p-6",
        ],

        variant === "motion" && [
          "bg-gradient-to-br from-[rgba(255,247,236,0.95)] to-[rgba(242,227,208,0.9)]",
          "border border-[rgba(122,139,139,0.25)]",
          "shadow-[0_12px_28px_rgba(31,27,23,0.1)]",
          "p-8 rounded-[20px]",
          "transition-all duration-300 ease-out",
          "hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(31,27,23,0.15)]",
        ],

        variant === "scroll-step" && [
          "bg-[rgba(255,255,255,0.92)]",
          "border border-[rgba(31,27,23,0.08)]",
          "shadow-[0_18px_28px_rgba(31,27,23,0.06)]",
          "rounded-[20px] p-6",
        ],

        variant === "sticky" && [
          "sticky top-8",
          "bg-[rgba(255,255,255,0.95)]",
          "border border-[rgba(31,27,23,0.12)]",
          "shadow-[0_25px_40px_rgba(31,27,23,0.08)]",
          "rounded-[22px] p-7",
        ],

        className,
      )}
      {...props}
    />
  )
})
Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex justify-between items-baseline mb-4", className)} {...props} />
  ),
)
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-[0.95rem] font-semibold uppercase tracking-[0.2em] text-[var(--moss)]", className)}
      {...props}
    />
  ),
)
CardTitle.displayName = "CardTitle"

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("", className)} {...props} />,
)
CardContent.displayName = "CardContent"

export { Card, CardHeader, CardTitle, CardContent }
