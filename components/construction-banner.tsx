"use client"

import { useEffect, useRef, useState } from "react"

export default function ConstructionBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const bannerRef = useRef<HTMLDivElement | null>(null)

  // Initialize from sessionStorage
  useEffect(() => {
    try {
      const dismissed = sessionStorage.getItem("constructionBannerDismissed") === "1"
      setIsVisible(!dismissed)
    } catch {
      // If sessionStorage is unavailable, default to showing the banner
      setIsVisible(true)
    }
  }, [])

  // Manage root class and CSS var for offset while visible
  useEffect(() => {
    const root = document.documentElement

    if (!isVisible) {
      root.classList.remove("has-site-banner")
      root.style.removeProperty("--site-banner-height")
      return
    }

    root.classList.add("has-site-banner")

    const updateBannerHeight = () => {
      const height = bannerRef.current?.offsetHeight ?? 0
      root.style.setProperty("--site-banner-height", `${height}px`)
    }

    updateBannerHeight()
    window.addEventListener("resize", updateBannerHeight)
    return () => {
      window.removeEventListener("resize", updateBannerHeight)
    }
  }, [isVisible])

  if (!isVisible) {
    return null
  }

  return (
    <div
      ref={bannerRef}
      className="fixed top-0 left-0 right-0 z-[60] bg-amber-500 text-black border-b border-amber-600"
      role="region"
      aria-label="Site announcement"
    >
      <div className="relative max-w-[1800px] mx-auto px-4 lg:px-6 py-2 text-center text-sm">
        <span className="font-semibold">🚧 Site Under Construction.</span>{" "}
        For bookings, call {" "}
        <a href="tel:17196989004" className="font-semibold underline">
          719-698-9004
        </a>
        <button
          type="button"
          onClick={() => {
            try {
              sessionStorage.setItem("constructionBannerDismissed", "1")
            } catch {
              // ignore
            }
            setIsVisible(false)
          }}
          aria-label="Dismiss announcement"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-black/80 hover:text-black hover:bg-amber-400/70 transition-colors"
        >
          &#215;
        </button>
      </div>
    </div>
  )
}


