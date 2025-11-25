"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"

export interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  delay?: number
}

const Reveal = React.forwardRef<HTMLDivElement, RevealProps>(({ className, delay = 0, children, ...props }, ref) => {
  const elementRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => setIsVisible(true), delay)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" },
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => observer.disconnect()
  }, [delay])

  return (
    <div
      ref={(node) => {
        elementRef.current = node
        if (typeof ref === "function") ref(node)
        else if (ref) ref.current = node
      }}
      className={cn(
        "transition-all duration-[0.8s] ease-out",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[60px]",
        className,
      )}
      style={{ transitionDelay: `${delay}ms` }}
      {...props}
    >
      {children}
    </div>
  )
})
Reveal.displayName = "Reveal"

export { Reveal }
