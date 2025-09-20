import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { AftercarePage } from '@/components/aftercare-page'

describe('AftercarePage ShadCN UI Consistency', () => {
  it('uses ShadCN design tokens and primitives correctly', () => {
    render(<AftercarePage />)

    // Verify main container uses ShadCN background tokens
    const mainContainer = document.querySelector('.min-h-screen')
    expect(mainContainer).toHaveClass('bg-background', 'text-foreground')

    // Verify Tabs primitives are present
    expect(screen.getByRole('tablist')).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /general tattoo aftercare/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /transparent bandage aftercare/i })).toBeInTheDocument()

    // Verify Alert primitives are present (there are multiple alerts)
    const alerts = screen.getAllByRole('alert')
    expect(alerts.length).toBeGreaterThan(0)

    // Verify Card primitives are present (multiple cards should exist)
    const cards = document.querySelectorAll('[data-slot="card"]')
    expect(cards.length).toBeGreaterThan(0)

    // Verify no ad-hoc color classes are used (specifically no text-white)
    const htmlContent = document.documentElement.innerHTML
    expect(htmlContent).not.toContain('text-white')

    // Verify ShadCN design tokens are used
    expect(htmlContent).toContain('text-muted-foreground')
    expect(htmlContent).toContain('bg-background')
    expect(htmlContent).toContain('text-foreground')
  })

  it('uses consistent ShadCN component structure', () => {
    render(<AftercarePage />)

    // Verify TabsList has proper ShadCN structure
    const tabsList = screen.getByRole('tablist')
    expect(tabsList).toHaveClass('grid', 'w-full', 'grid-cols-2', 'bg-muted', 'border')

    // Verify Alert uses ShadCN structure with proper icon placement
    const alerts = screen.getAllByRole('alert')
    expect(alerts[0]).toHaveAttribute('data-slot', 'alert')

    // Verify Cards use proper ShadCN structure
    const cardHeaders = document.querySelectorAll('[data-slot="card-header"]')
    expect(cardHeaders.length).toBeGreaterThan(0)

    const cardContents = document.querySelectorAll('[data-slot="card-content"]')
    expect(cardContents.length).toBeGreaterThan(0)
  })

  it('maintains consistent typography and spacing scales', () => {
    render(<AftercarePage />)

    // Verify heading uses consistent font classes
    const mainHeading = screen.getByText('Tattoo Aftercare')
    expect(mainHeading).toHaveClass('font-playfair')

    // Verify muted text uses consistent token
    const mutedElements = document.querySelectorAll('.text-muted-foreground')
    expect(mutedElements.length).toBeGreaterThan(0)

    // Verify consistent spacing classes are used
    const htmlContent = document.documentElement.innerHTML
    expect(htmlContent).toContain('space-y-')
    expect(htmlContent).toContain('gap-')
    expect(htmlContent).toContain('px-8')
    expect(htmlContent).toContain('py-6') // Cards use py-6, not py-8
  })

  it('applies motion classes with reduced-motion safeguard', () => {
    render(<AftercarePage />)
    const html = document.documentElement.innerHTML
    expect(html).toContain('animate-in')
    expect(html).toContain('motion-reduce:animate-none')
  })
})
