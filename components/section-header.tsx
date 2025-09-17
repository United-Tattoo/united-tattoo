"use client"

import { useEffect, useRef, useState } from "react"

interface SectionHeaderProps {
  title: string
  subtitle?: string
  className?: string
}

export function SectionHeader({ title, subtitle, className = "" }: SectionHeaderProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isSticky, setIsSticky] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.1 },
    )

    const stickyObserver = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(!entry.isIntersecting)
      },
      { rootMargin: "-80px 0px 0px 0px" },
    )

    if (headerRef.current) {
      observer.observe(headerRef.current)
      stickyObserver.observe(headerRef.current)
    }

    return () => {
      observer.disconnect()
      stickyObserver.disconnect()
    }
  }, [])

  return (
    <div
      ref={headerRef}
      className={`transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
    >
      <div className={`transition-all duration-300 ${isSticky ? "scale-95" : "scale-100"}`}>
        <h2 className="font-playfair text-4xl md:text-5xl font-bold text-center mb-4">{title}</h2>
        {subtitle && <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto">{subtitle}</p>}
      </div>
    </div>
  )
}
