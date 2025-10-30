"use client"

import { useEffect, useRef } from "react"

import { useReducedMotion } from "@/hooks/use-parallax"

export function BackgroundStrata() {
  const layerRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) {
      return
    }

    const target = layerRef.current
    if (!target) {
      return
    }

    let frame = 0
    const animate = () => {
      const offset = window.scrollY * 0.08
      target.style.transform = `translate3d(0, ${offset}px, 0)`
      frame = requestAnimationFrame(animate)
    }

    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [reducedMotion])

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[230vh] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.12),transparent_55%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.08),transparent_52%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(14,11,9,0.92)_0%,rgba(14,11,9,0.75)_28%,rgba(10,8,7,0.35)_68%,transparent_100%)]" />
      <div
        ref={layerRef}
        className="h-full w-full scale-[1.04] transform-gpu transition-transform duration-1000 ease-out"
        style={{
          backgroundImage:
            "image-set(url('/assets/liberty/background-dove-wash.avif') type('image/avif'), url('/assets/liberty/background-dove-wash.webp') type('image/webp'))",
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-[420px] bg-[linear-gradient(180deg,rgba(12,10,8,0.2)_0%,rgba(12,10,8,0.65)_45%,rgba(12,10,8,1)_98%)]" />
    </div>
  )
}

