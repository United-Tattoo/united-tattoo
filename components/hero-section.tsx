"use client"

import { useEffect, useState } from "react"

import { useFeatureFlag } from "@/components/feature-flags-provider"
import { Button } from "@/components/ui/button"
import { useMultiLayerParallax, useReducedMotion } from "@/hooks/use-parallax"
import { cn } from "@/lib/utils"

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  const advancedNavAnimations = useFeatureFlag("ADVANCED_NAV_SCROLL_ANIMATIONS_ENABLED")
  const reducedMotion = useReducedMotion()
  
  // Use new parallax system with proper accessibility support
  const parallax = useMultiLayerParallax(!advancedNavAnimations || reducedMotion)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section 
      id="home" 
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      data-reduced-motion={reducedMotion}
    >
      {/* Background Layer - Slowest parallax */}
      <div
        ref={parallax.background.ref}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat will-change-transform"
        style={{
          backgroundImage: "url(/united-logo-full.jpg)",
          ...parallax.background.style,
        }}
        aria-hidden="true"
      />
      
      {/* Midground Layer - Overlay with subtle parallax */}
      <div
        ref={parallax.midground.ref}
        className="absolute inset-0 bg-black/70 will-change-transform"
        style={parallax.midground.style}
        aria-hidden="true"
      />

      {/* Foreground Layer - Content with slight counter-parallax */}
      <div
        ref={parallax.foreground.ref}
        className="relative z-10 text-center max-w-4xl px-8 will-change-transform"
        style={parallax.foreground.style}
      >
        <div
          className={cn(
            "transition-all duration-1000",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <h1 className="font-playfair text-5xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
            UNITED TATTOO
          </h1>
        </div>

        <div
          className={cn(
            "transition-all duration-1000 delay-300",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <p className="text-xl lg:text-2xl text-gray-200 mb-12 font-light leading-relaxed">
            Custom Tattoos in Fountain, Colorado
          </p>
        </div>

        <div
          className={cn(
            "transition-all duration-1000 delay-500",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <Button
            size="lg"
            className="bg-gray-50 text-gray-900 hover:bg-gray-100 px-8 py-4 text-lg font-medium rounded-lg w-full sm:w-auto transition-colors"
          >
            Book Consultation
          </Button>
        </div>
      </div>
    </section>
  )
}
