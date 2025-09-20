"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import { 
  PARALLAX_CONFIG, 
  prefersReducedMotion, 
  getParallaxDepth,
  PerformanceMonitor 
} from "@/lib/parallax-config"

interface ParallaxOptions {
  depth?: number
  disabled?: boolean
  rootMargin?: string
  threshold?: number
}

interface ParallaxReturn {
  ref: React.RefObject<HTMLDivElement>
  style: React.CSSProperties
}

/**
 * Custom hook for parallax scrolling effects
 * Respects prefers-reduced-motion and performance constraints
 */
export function useParallax(options: ParallaxOptions = {}): ParallaxReturn {
  const {
    depth = PARALLAX_CONFIG.depth.background,
    disabled = false,
    rootMargin = "0px",
    threshold = 0.1,
  } = options

  const elementRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>()
  const lastScrollY = useRef(0)
  const isInView = useRef(false)

  // Calculate effective depth based on accessibility preferences
  const effectiveDepth = getParallaxDepth(depth)
  const shouldAnimate = !disabled && !prefersReducedMotion() && effectiveDepth !== 0

  const updateTransform = useCallback(() => {
    if (!elementRef.current || !shouldAnimate || !isInView.current) return

    PerformanceMonitor.start()

    const scrollY = window.pageYOffset
    const rect = elementRef.current.getBoundingClientRect()
    const elementHeight = elementRef.current.offsetHeight
    const windowHeight = window.innerHeight

    // Calculate if element is in viewport with some buffer
    const elementTop = rect.top + scrollY
    const elementBottom = elementTop + elementHeight
    const viewportTop = scrollY
    const viewportBottom = scrollY + windowHeight

    // Only animate if element is near viewport
    if (elementBottom < viewportTop - windowHeight || elementTop > viewportBottom + windowHeight) {
      isInView.current = false
      return
    }

    // Calculate parallax offset using getBoundingClientRect().top
    let parallaxOffset = -rect.top * effectiveDepth

    // Clamp offset to avoid large translations that could push panels offscreen
    // Use element height as a reasonable bound (50% of element height)
    const maxOffset = elementHeight * 0.5
    if (parallaxOffset > maxOffset) parallaxOffset = maxOffset
    if (parallaxOffset < -maxOffset) parallaxOffset = -maxOffset

    // Apply transform using CSS custom property for better performance
    elementRef.current.style.setProperty('--parallax-offset', `${parallaxOffset}px`)

    PerformanceMonitor.end('parallax-transform')
    lastScrollY.current = scrollY
  }, [shouldAnimate, effectiveDepth])

  const throttledUpdate = useCallback(() => {
    if (rafRef.current) return

    rafRef.current = requestAnimationFrame(() => {
      updateTransform()
      rafRef.current = undefined
    })
  }, [updateTransform])

  useEffect(() => {
    if (!shouldAnimate) return

    // Initialize CSS variable to 0
    if (elementRef.current) {
      elementRef.current.style.setProperty('--parallax-offset', '0px')
    }

    // Set up intersection observer to track when element is near viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isInView.current = entry.isIntersecting
          // Only run an immediate transform if the page is already scrolled.
          // This avoids applying different initial transforms for left/right panels
          // when the page loads at the top — keeping both panels visually aligned.
          if (entry.isIntersecting && window.pageYOffset !== lastScrollY.current && window.pageYOffset !== 0) {
            updateTransform()
          }
        })
      },
      {
        rootMargin,
        threshold,
      }
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    // Set up scroll listener
    const handleScroll = () => {
      throttledUpdate()
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    // Note: initial transform update is now gated to IntersectionObserver so updates occur
    // only when the element is actually in view. CSS var is still initialized to 0px on mount.

    return () => {
      window.removeEventListener('scroll', handleScroll)
      observer.disconnect()
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [shouldAnimate, throttledUpdate, updateTransform, rootMargin, threshold])

  // Return style object with transform
  const style: React.CSSProperties = shouldAnimate
    ? {
        transform: 'translateY(var(--parallax-offset, 0px))',
        willChange: 'transform',
      }
    : {}

  return {
    ref: elementRef,
    style,
  }
}

/**
 * Hook for multi-layer parallax effects
 * Returns refs and styles for background, midground, and foreground layers
 */
export function useMultiLayerParallax(disabled = false) {
  const background = useParallax({ 
    depth: PARALLAX_CONFIG.depth.background, 
    disabled 
  })
  const midground = useParallax({ 
    depth: PARALLAX_CONFIG.depth.midground, 
    disabled 
  })
  const foreground = useParallax({ 
    depth: PARALLAX_CONFIG.depth.foreground, 
    disabled 
  })

  return {
    background,
    midground,
    foreground,
  }
}

/**
 * Hook for split-screen parallax effects
 * Returns refs and styles for left and right panels
 */
export function useSplitScreenParallax(disabled = false) {
  const leftPanel = useParallax({ 
    depth: PARALLAX_CONFIG.layers.splitScreen.leftPanel.depth, 
    disabled 
  })
  const rightPanel = useParallax({ 
    depth: PARALLAX_CONFIG.layers.splitScreen.rightPanel.depth, 
    disabled 
  })

  return {
    leftPanel,
    rightPanel,
  }
}

/**
 * Hook to detect reduced motion preference changes
 */
export function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(prefersReducedMotion())

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    
    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  return reducedMotion
}
