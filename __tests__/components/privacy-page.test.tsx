import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { PrivacyPage } from '@/components/privacy-page'

describe('PrivacyPage ShadCN UI Consistency', () => {
  it('uses standardized heading and body scales with ShadCN primitives', () => {
    render(<PrivacyPage />)

    // Verify main container uses ShadCN background tokens
    const mainContainer = document.querySelector('.min-h-screen')
    expect(mainContainer).toHaveClass('bg-background', 'text-foreground')

    // Verify heading uses consistent font classes and scale
    const mainHeading = screen.getByText('Privacy Policy')
    expect(mainHeading).toHaveClass('font-playfair', 'text-5xl', 'lg:text-7xl')

    // Verify body text uses consistent muted foreground token
    const bodyText = screen.getByText(/We respect your privacy/)
    expect(bodyText).toHaveClass('text-muted-foreground')

    // Verify no ad-hoc color classes are used
    const htmlContent = document.documentElement.innerHTML
    expect(htmlContent).not.toContain('text-white')
    expect(htmlContent).not.toContain('text-gray-300')
    expect(htmlContent).not.toContain('bg-white/5')
    expect(htmlContent).not.toContain('border-white/10')

    // Verify ShadCN design tokens are consistently used
    expect(htmlContent).toContain('text-muted-foreground')
    expect(htmlContent).toContain('bg-background')
    expect(htmlContent).toContain('text-foreground')
  })

  it('uses ShadCN primitives correctly throughout the page', () => {
    render(<PrivacyPage />)

    // Verify Alert primitive is present and properly structured
    const alert = screen.getByRole('alert')
    expect(alert).toHaveAttribute('data-slot', 'alert')

    // Verify Badge primitive is present
    const badge = screen.getByText('Last updated: 2025-09-16')
    expect(badge).toBeInTheDocument()

    // Verify Card primitives are present (multiple cards should exist)
    const cards = document.querySelectorAll('[data-slot="card"]')
    expect(cards.length).toBeGreaterThan(0)

    // Verify Card headers and content use proper ShadCN structure
    const cardHeaders = document.querySelectorAll('[data-slot="card-header"]')
    expect(cardHeaders.length).toBeGreaterThan(0)

    const cardContents = document.querySelectorAll('[data-slot="card-content"]')
    expect(cardContents.length).toBeGreaterThan(0)

    // Verify all CardContent uses muted foreground token
    const cardContentElements = document.querySelectorAll('[data-slot="card-content"]')
    cardContentElements.forEach(element => {
      expect(element).toHaveClass('text-muted-foreground')
    })
  })

  it('maintains consistent spacing and typography patterns', () => {
    render(<PrivacyPage />)

    // Verify consistent spacing classes are used
    const htmlContent = document.documentElement.innerHTML
    expect(htmlContent).toContain('space-y-3')
    expect(htmlContent).toContain('gap-6')
    expect(htmlContent).toContain('px-8')
    expect(htmlContent).toContain('lg:px-16')

    // Verify consistent text sizing
    expect(htmlContent).toContain('text-xl')
    expect(htmlContent).toContain('leading-relaxed')

    // Verify grid layout consistency
    expect(htmlContent).toContain('grid-cols-1')
    expect(htmlContent).toContain('lg:grid-cols-2')

    // Verify responsive design patterns
    expect(htmlContent).toContain('max-w-4xl')
    expect(htmlContent).toContain('max-w-6xl')
  })

  it('uses proper icon integration with ShadCN components', () => {
    render(<PrivacyPage />)

    // Verify icons are properly integrated without ad-hoc color classes
    const infoIcon = document.querySelector('.lucide-info')
    expect(infoIcon).toBeInTheDocument()

    // Verify icons use consistent sizing
    const htmlContent = document.documentElement.innerHTML
    expect(htmlContent).toContain('w-5 h-5')

    // Verify icons don't have ad-hoc color overrides
    expect(htmlContent).not.toContain('text-white')
  })

  it('applies motion classes with reduced-motion safeguard', () => {
    render(<PrivacyPage />)
    const html = document.documentElement.innerHTML
    expect(html).toContain('animate-in')
    expect(html).toContain('motion-reduce:animate-none')
  })
})
