import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { HeroSection } from '@/components/hero-section'

// Mock the feature flags provider
vi.mock('@/components/feature-flags-provider', () => ({
  useFeatureFlag: vi.fn(() => true),
}))

// Mock the parallax hooks
vi.mock('@/hooks/use-parallax', () => ({
  useMultiLayerParallax: vi.fn(() => ({
    background: {
      ref: { current: null },
      style: { transform: 'translateY(0px)' },
    },
    midground: {
      ref: { current: null },
      style: { transform: 'translateY(0px)' },
    },
    foreground: {
      ref: { current: null },
      style: { transform: 'translateY(0px)' },
    },
  })),
  useReducedMotion: vi.fn(() => false),
}))

describe('HeroSection Parallax Implementation', () => {
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks()
  })

  it("renders hero section with all layers", () => {
    render(<HeroSection />)
    
    // Check for main heading
    expect(screen.getByRole("heading", { name: /united tattoo/i })).toBeInTheDocument()
    
    // Check for tagline
    expect(screen.getByText(/where artistry meets precision/i)).toBeInTheDocument()
    
    // Check for CTA button
    expect(screen.getByRole("button", { name: /book consultation/i })).toBeInTheDocument()
  })

  it('applies reduced motion data attribute when reduced motion is preferred', async () => {
    const { useReducedMotion } = await import('@/hooks/use-parallax')
    vi.mocked(useReducedMotion).mockReturnValue(true)
    
    render(<HeroSection />)
    
    const section = document.querySelector('section')
    expect(section).toHaveAttribute('data-reduced-motion', 'true')
  })

  it("has proper accessibility attributes for decorative images", () => {
    render(<HeroSection />)
    
    // Background and midground layers should be aria-hidden
    const decorativeElements = document.querySelectorAll('[aria-hidden="true"]')
    expect(decorativeElements.length).toBeGreaterThan(0)
  })

  it("uses proper semantic structure", () => {
    render(<HeroSection />)
    
    // Should have proper heading hierarchy
    const heading = screen.getByRole("heading", { name: /united tattoo/i })
    expect(heading.tagName).toBe("H1")
    
    // Should have proper section structure
    const section = document.querySelector("section")
    expect(section).toHaveAttribute("id", "home")
  })

  it("applies will-change-transform for performance optimization", () => {
    render(<HeroSection />)
    
    const transformElements = document.querySelectorAll(".will-change-transform")
    expect(transformElements.length).toBeGreaterThan(0)
  })

  it('respects feature flag for advanced animations', async () => {
    const { useFeatureFlag } = await import('@/components/feature-flags-provider')
    const { useMultiLayerParallax } = await import('@/hooks/use-parallax')
    
    // Test with feature flag disabled
    vi.mocked(useFeatureFlag).mockReturnValue(false)
    
    render(<HeroSection />)
    
    // Should pass disabled=true to parallax hook when feature flag is off
    expect(useMultiLayerParallax).toHaveBeenCalledWith(true)
  })

  it("has responsive design classes", () => {
    render(<HeroSection />)
    
    const heading = screen.getByRole("heading", { name: /united tattoo/i })
    expect(heading).toHaveClass("text-5xl", "lg:text-7xl")
    
    const tagline = screen.getByText(/where artistry meets precision/i)
    expect(tagline).toHaveClass("text-xl", "lg:text-2xl")
  })

  it("initializes parallax transforms to 0 at mount", () => {
    render(<HeroSection />)
    
    // All parallax layers should initialize with 0px transform
    const backgroundLayer = document.querySelector('[style*="translateY(0px)"]')
    const midgroundLayer = document.querySelectorAll('[style*="translateY(0px)"]')[1]
    const foregroundLayer = document.querySelectorAll('[style*="translateY(0px)"]')[2]
    
    expect(backgroundLayer).toBeInTheDocument()
    expect(midgroundLayer).toBeInTheDocument()
    expect(foregroundLayer).toBeInTheDocument()
  })

  it("disables parallax transforms when reduced motion is preferred", async () => {
    const { useReducedMotion } = await import('@/hooks/use-parallax')
    vi.mocked(useReducedMotion).mockReturnValue(true)
    
    render(<HeroSection />)
    
    // When reduced motion is preferred, parallax should be disabled
    const section = document.querySelector('section')
    expect(section).toHaveAttribute('data-reduced-motion', 'true')
  })
})
