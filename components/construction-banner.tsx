"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, X, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ConstructionBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    // Check if banner was previously dismissed
    const isDismissed = localStorage.getItem("construction-banner-dismissed")
    setIsVisible(!isDismissed)
    setIsHydrated(true)
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    localStorage.setItem("construction-banner-dismissed", "true")
  }

  // Don't render anything until hydrated to avoid mismatch
  if (!isHydrated) {
    return null
  }

  if (!isVisible) {
    return null
  }

  return (
    <div className="construction-banner fixed top-0 left-0 right-0 bg-amber-500/10 border-b border-amber-500/20 backdrop-blur-sm z-[60]">
      <div className="container mx-auto px-4 h-full flex items-center">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-amber-200/90 w-full">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0" />
            <p className="text-sm font-medium">
              Website Under Construction
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-amber-300/70">•</span>
            <p className="text-sm">
              For bookings, please call:
            </p>
            <a
              href="tel:7196989004"
              className="flex items-center gap-1.5 text-sm font-semibold text-amber-300 hover:text-amber-200 transition-colors underline decoration-amber-400/30 hover:decoration-amber-300/50 underline-offset-2"
            >
              <Phone className="h-4 w-4" />
              (719) 698-9004
            </a>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="absolute right-2 top-1/2 -translate-y-1/2 sm:relative sm:right-auto sm:top-auto sm:translate-y-0 h-8 w-8 p-0 text-amber-400/70 hover:text-amber-300 hover:bg-amber-500/10"
            aria-label="Dismiss banner"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

