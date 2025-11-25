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
      className="min-h-[67vh] flex items-center justify-center relative overflow-hidden bg-sage-concrete"
      data-reduced-motion={reducedMotion}
    >
      {/* Background Layer - New hero image with parallax */}
      <div
        ref={parallax.background.ref}
        className="absolute inset-0 bg-cover bg-no-repeat will-change-transform"
        style={{
          backgroundImage: "url(/UP1_00010_.png)",
          backgroundPosition: "center 35%",
          maskImage: "linear-gradient(180deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 50%, rgba(0, 0, 0, 0.6) 80%, rgba(0, 0, 0, 0) 100%)",
          WebkitMaskImage: "linear-gradient(180deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 50%, rgba(0, 0, 0, 0.6) 80%, rgba(0, 0, 0, 0) 100%)",
          ...parallax.background.style,
        }}
        aria-hidden="true"
      />

      {/* Midground Layer - Gradient overlay with subtle parallax */}
      <div
        ref={parallax.midground.ref}
        className="absolute inset-0 will-change-transform"
        style={{
          background: "linear-gradient(135deg, rgba(242, 227, 208, 0.3), rgba(255, 247, 236, 0.2))",
          ...parallax.midground.style,
        }}
        aria-hidden="true"
      />

      {/* Removed fade mask - using maskImage on background layer instead */}

      {/* Foreground Layer - Glassmorphism content card with counter-parallax */}
      <div
        ref={parallax.foreground.ref}
        className="relative z-10 text-center will-change-transform"
        style={parallax.foreground.style}
      >
        <div
          className={cn(
            "max-w-[620px] mx-auto px-8 py-12 lg:px-14 lg:py-16",
            "transition-all duration-1000",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
          style={{
            background: "rgba(242, 227, 208, 0.75)",
            backdropFilter: "blur(12px) saturate(110%)",
            WebkitBackdropFilter: "blur(12px) saturate(110%)",
            borderRadius: "24px",
            border: "1px solid rgba(36, 27, 22, 0.08)",
            boxShadow: "0 20px 40px rgba(36, 27, 22, 0.15)",
          }}
        >
          {/* Hero Title */}
          <h1
            className="font-playfair mb-4 tracking-tight leading-tight"
            style={{
              fontSize: "clamp(2.5rem, 5vw, 3.8rem)",
              lineHeight: "1.1",
              color: "#1c1915", // charcoal
            }}
          >
            UNITED TATTOO
          </h1>

          {/* Hero Subtitle */}
          <p
            className="mb-8 font-grotesk leading-loose max-w-[54ch] mx-auto"
            style={{
              fontSize: "clamp(0.95rem, 2vw, 1.3rem)",
              lineHeight: "1.65",
              color: "#4a4034", // deep-olive
            }}
          >
            Custom Tattoos in Fountain, Colorado
          </p>

          {/* CTA Button */}
          <Button
            size="lg"
            className={cn(
              "px-8 py-4 text-base font-semibold",
              "transition-all duration-200 ease-out",
              "uppercase tracking-wider font-grotesk",
              "w-full sm:w-auto"
            )}
            style={{
              letterSpacing: "0.2em",
              backgroundColor: "#b0471e",
              color: "#ffffff",
              borderRadius: "12px",
              boxShadow: "0 10px 22px rgba(176, 71, 30, 0.25)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px) scale(1.03)";
              e.currentTarget.style.boxShadow = "0 14px 28px rgba(176, 71, 30, 0.35)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "0 10px 22px rgba(176, 71, 30, 0.25)";
            }}
          >
            Book Consultation
          </Button>
        </div>
      </div>
    </section>
  )
}
