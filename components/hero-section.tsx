"use client"

import { useEffect, useState } from "react"

import { useFeatureFlag } from "@/components/feature-flags-provider"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const advancedNavAnimations = useFeatureFlag("ADVANCED_NAV_SCROLL_ANIMATIONS_ENABLED")

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!advancedNavAnimations) return
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [advancedNavAnimations])

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url(/united-logo-full.jpg)",
          transform: advancedNavAnimations ? `translateY(${scrollY * 0.5}px)` : undefined,
        }}
      />
      <div className="absolute inset-0 bg-black/70" />

      <div
        className="relative z-10 text-center max-w-4xl px-8"
        style={{ transform: advancedNavAnimations ? `translateY(${scrollY * -0.1}px)` : undefined }}
      >
        <div
          className={`transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 tracking-tight">UNITED TATTOO</h1>
        </div>

        <div
          className={`transition-all duration-1000 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-xl lg:text-2xl text-gray-200 mb-12 font-light">Where artistry meets precision</p>
        </div>

        <div
          className={`transition-all duration-1000 delay-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Button
            size="lg"
            className="bg-gray-50 text-gray-900 hover:bg-gray-100 px-8 py-4 text-lg font-medium rounded-lg w-full sm:w-auto"
          >
            Book Consultation
          </Button>
        </div>
      </div>
    </section>
  )
}
