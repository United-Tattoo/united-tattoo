"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost"
  size?: "default" | "sm" | "lg"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium uppercase tracking-[0.2em] transition-all duration-200 ease-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--rose)] focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          "rounded-[12px]",

          size === "default" && "px-6 py-4 text-[0.85rem]",
          size === "sm" && "px-4 py-3 text-[0.75rem]",
          size === "lg" && "px-8 py-5 text-[0.9rem]",

          variant === "primary" && [
            "bg-[var(--burnt)] text-white",
            "shadow-[0_10px_22px_rgba(176,71,30,0.25)]",
            "hover:-translate-y-0.5 hover:scale-[1.03]",
            "hover:shadow-[0_14px_28px_rgba(176,71,30,0.35)]",
          ],
          variant === "secondary" && [
            "bg-[var(--terracotta)] text-white",
            "shadow-[0_10px_22px_rgba(216,120,80,0.25)]",
            "hover:-translate-y-0.5 hover:scale-[1.03]",
            "hover:shadow-[0_14px_28px_rgba(216,120,80,0.35)]",
          ],
          variant === "ghost" && [
            "bg-[var(--sand)] text-[var(--ink)]",
            "border border-[rgba(31,27,23,0.2)]",
            "hover:-translate-y-0.5",
          ],

          className,
        )}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

export { Button }
