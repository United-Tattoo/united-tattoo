"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface CalendarDay {
  day: number
  isBooked?: boolean
  isMuted?: boolean
}

export interface CalendarProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  days: CalendarDay[]
}

const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(({ className, title, days, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-[20px] p-6",
        "bg-gradient-to-br from-[rgba(242,227,208,0.98)] to-[rgba(255,247,236,0.95)]",
        "border border-[rgba(210,106,50,0.2)]",
        "shadow-[0_14px_24px_rgba(31,27,23,0.18)]",
        className,
      )}
      {...props}
    >
      {title && (
        <span className="block text-[0.75rem] font-semibold uppercase tracking-[0.3em] text-[var(--moss)] mb-4">
          {title}
        </span>
      )}
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((day, index) => (
          <div
            key={index}
            className={cn(
              "aspect-square rounded-lg flex items-center justify-center",
              "text-[0.75rem] font-medium",
              day.isBooked
                ? "bg-[var(--terracotta)] text-white shadow-[0_10px_18px_rgba(216,120,80,0.3)]"
                : "bg-[rgba(255,255,255,0.8)] border border-[rgba(210,106,50,0.2)] text-[rgba(31,27,23,0.8)]",
              day.isMuted && "opacity-40",
            )}
          >
            {day.day}
          </div>
        ))}
      </div>
    </div>
  )
})
Calendar.displayName = "Calendar"

export { Calendar }
