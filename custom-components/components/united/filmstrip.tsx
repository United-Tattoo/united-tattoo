"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"

export interface FilmstripItem {
  src: string
  label: string
}

export interface FilmstripProps extends React.HTMLAttributes<HTMLDivElement> {
  items: FilmstripItem[]
  title?: string
  subtitle?: string
}

const Filmstrip = React.forwardRef<HTMLDivElement, FilmstripProps>(
  ({ className, items, title, subtitle, ...props }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const trackRef = useRef<HTMLDivElement>(null)
    const [progress, setProgress] = useState(0)

    useEffect(() => {
      const container = containerRef.current
      const track = trackRef.current
      if (!container || !track) return

      const handleScroll = () => {
        const rect = container.getBoundingClientRect()
        const viewHeight = window.innerHeight
        const containerHeight = rect.height

        let scrollProgress = -rect.top / (containerHeight - viewHeight)
        scrollProgress = Math.min(Math.max(scrollProgress, 0), 1)
        setProgress(scrollProgress)

        const trackWidth = track.scrollWidth
        const maxTranslate = trackWidth - window.innerWidth
        track.style.transform = `translateX(${-maxTranslate * scrollProgress}px)`
      }

      window.addEventListener("scroll", handleScroll, { passive: true })
      handleScroll()

      return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
      <div
        ref={(node) => {
          containerRef.current = node
          if (typeof ref === "function") ref(node)
          else if (ref) ref.current = node
        }}
        className={cn("h-[300vh] relative", className)}
        {...props}
      >
        <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">
          {(title || subtitle) && (
            <div className="text-center mb-8 px-6">
              {subtitle && (
                <span className="block text-[0.75rem] font-semibold uppercase tracking-[0.3em] text-[var(--moss)] mb-3">
                  {subtitle}
                </span>
              )}
              {title && <h2 className="font-serif text-[clamp(1.9rem,4vw,3rem)] leading-[1.15]">{title}</h2>}
            </div>
          )}

          <div ref={trackRef} className="flex gap-[clamp(1rem,2vw,2rem)] pl-[10vw] will-change-transform">
            {items.map((item, index) => (
              <div
                key={index}
                className={cn(
                  "flex-shrink-0",
                  "w-[clamp(400px,60vw,800px)] aspect-[4/5]",
                  "rounded-[32px]",
                  "bg-cover bg-center",
                  "shadow-[var(--shadow-filmic)]",
                  "relative",
                )}
                style={{ backgroundImage: `url(${item.src})` }}
              >
                <span
                  className={cn(
                    "absolute left-8 bottom-8",
                    "text-[0.75rem] uppercase tracking-[0.25em]",
                    "text-white/95",
                    "drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]",
                  )}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[200px] h-0.5 bg-[rgba(36,27,22,0.1)] rounded overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[var(--burnt)] to-[var(--rose)]"
              style={{ transform: `scaleX(${progress})`, transformOrigin: "left" }}
            />
          </div>
        </div>
      </div>
    )
  },
)
Filmstrip.displayName = "Filmstrip"

export { Filmstrip }
