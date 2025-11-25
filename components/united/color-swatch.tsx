"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface ColorSwatchProps extends React.HTMLAttributes<HTMLDivElement> {
  hex: string
  name: string
  usage: string
  bgColor?: string
}

const ColorSwatch = React.forwardRef<HTMLDivElement, ColorSwatchProps>(
  ({ className, hex, name, usage, bgColor, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-[24px] p-6 text-white min-h-[220px]",
          "flex flex-col justify-between",
          "shadow-[var(--shadow-subtle)]",
          "transition-transform duration-200 ease-out",
          "hover:scale-105",
          className,
        )}
        style={{ backgroundColor: bgColor || hex }}
        {...props}
      >
        <div>
          <strong className="text-xl font-semibold tracking-wide block">{hex}</strong>
          <span className="text-[0.9rem] opacity-90">{name}</span>
        </div>
        <span className="text-[0.75rem] uppercase tracking-[0.15em] opacity-85">{usage}</span>
      </div>
    )
  },
)
ColorSwatch.displayName = "ColorSwatch"

export { ColorSwatch }
