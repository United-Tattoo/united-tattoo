"use client"

import { useEffect } from "react"
import { useLenis } from "./smooth-scroll-provider"

interface ScrollToSectionProps {
  /**
   * Offset from the top of the target element (e.g., for fixed navigation)
   */
  offset?: number
}

export function ScrollToSection({ offset = 80 }: ScrollToSectionProps = {}) {
  const lenis = useLenis()

  useEffect(() => {
    const handleAnchorClick = (e: Event) => {
      const target = e.target as HTMLElement
      
      // Find the closest anchor element (handles Next.js Link components)
      const anchor = target.closest('a[href^="#"]') as HTMLAnchorElement
      
      if (anchor) {
        e.preventDefault()
        
        const href = anchor.getAttribute("href")
        const id = href?.slice(1)
        const element = document.getElementById(id || "")

        if (element) {
          // Calculate position with offset for fixed navigation
          const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
          const offsetPosition = elementPosition - offset

          // Use Lenis scrollTo if available, otherwise fallback to window.scrollTo
          if (lenis && typeof lenis.scrollTo === "function") {
            lenis.scrollTo(offsetPosition)
          } else {
            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth",
            })
          }
        }
      }
    }

    // Add event listener with capture to ensure it runs before other handlers
    document.addEventListener("click", handleAnchorClick, true)
    
    return () => {
      document.removeEventListener("click", handleAnchorClick, true)
    }
  }, [offset, lenis]) // Added lenis to dependency array

  return null
}

// Hook for programmatic scrolling
export function useScrollToSection(offset: number = 80) {
  const lenis = useLenis()

  const scrollToSection = (targetId: string) => {
    const element = document.getElementById(targetId)
    if (!element) {
      console.warn(`Element with id "${targetId}" not found`)
      return
    }

    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
    const offsetPosition = elementPosition - offset

    // Use Lenis scrollTo if available, otherwise fallback to window.scrollTo
    if (lenis && typeof lenis.scrollTo === "function") {
      lenis.scrollTo(offsetPosition)
    } else {
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  }

  return { scrollToSection }
}
