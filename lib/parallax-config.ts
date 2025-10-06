/**
 * Parallax and Motion Configuration
 * Defines constraints, performance budgets, and accessibility settings
 * for parallax and split-screen hero sections
 */

export const PARALLAX_CONFIG = {
  // Performance budgets
  performance: {
    maxLayers: 3, // Maximum parallax layers to prevent performance issues
    throttleMs: 16, // ~60fps throttling for scroll events
    maxMainThreadTime: 50, // Maximum main thread time per frame (ms)
    lcpTarget: 2500, // LCP target in milliseconds
  },

  // Parallax depth settings (multipliers for scroll offset)
  depth: {
    background: 0.14, // Background moves slower (creates depth)
    midground: 0.07, // Midground elements
    foreground: -0.03, // Foreground moves slightly faster
    subtle: 0.05, // Very subtle movement for accessibility
  },

  // Scroll ranges (viewport heights)
  scrollRange: {
    mobile: 1.5, // 1.5 viewport heights on mobile
    desktop: 2.0, // 2 viewport heights on desktop
  },

  // Breakpoints
  breakpoints: {
    mobile: 768, // Below this is mobile
    tablet: 1024, // Tablet range
    desktop: 1024, // Desktop and above
  },

  // Reduced motion settings
  reducedMotion: {
    disableParallax: true, // Completely disable parallax
    useSubtleMotion: false, // Use very subtle motion instead
    fallbackTransition: 'opacity 0.3s ease', // Simple fade transitions
  },

  // Layer configuration
  layers: {
    hero: {
      background: {
        depth: 0.14,
        zIndex: 1,
        transform: 'translateY(var(--parallax-bg))',
      },
      midground: {
        depth: 0.07,
        zIndex: 2,
        transform: 'translateY(var(--parallax-mid))',
      },
      foreground: {
        depth: -0.03,
        zIndex: 3,
        transform: 'translateY(var(--parallax-fg))',
      },
    },
    splitScreen: {
      leftPanel: {
        depth: 0.04,
        zIndex: 2,
        transform: 'translateY(var(--parallax-left))',
      },
      rightPanel: {
        depth: -0.04,
        zIndex: 2,
        transform: 'translateY(var(--parallax-right))',
      },
    },
  },
} as const

/**
 * CSS Custom Properties for parallax transforms
 * These will be updated via JavaScript for smooth animations
 */
export const PARALLAX_CSS_VARS = {
  '--parallax-bg': '0px',
  '--parallax-mid': '0px',
  '--parallax-fg': '0px',
  '--parallax-left': '0px',
  '--parallax-right': '0px',
} as const

/**
 * Media query for reduced motion preference
 */
export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

/**
 * Utility to check if reduced motion is preferred
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia(REDUCED_MOTION_QUERY).matches
}

/**
 * Utility to get appropriate parallax depth based on motion preference
 */
export function getParallaxDepth(baseDepth: number): number {
  if (prefersReducedMotion()) {
    return PARALLAX_CONFIG.reducedMotion.disableParallax ? 0 : baseDepth * 0.1
  }
  return baseDepth
}

/**
 * Utility to check if device is mobile
 */
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false
  return window.innerWidth < PARALLAX_CONFIG.breakpoints.mobile
}

/**
 * Performance monitoring utilities
 */
export const PerformanceMonitor = {
  startTime: 0,
  
  start() {
    this.startTime = performance.now()
  },
  
  end(operation: string) {
    const duration = performance.now() - this.startTime
    if (duration > PARALLAX_CONFIG.performance.maxMainThreadTime) {
      console.warn(`Parallax operation "${operation}" took ${duration.toFixed(2)}ms (exceeds ${PARALLAX_CONFIG.performance.maxMainThreadTime}ms budget)`)
    }
    return duration
  },
}
