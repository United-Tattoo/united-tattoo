import React from 'react'
import { render } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { ArtistPortfolio } from '@/components/artist-portfolio'

// Mock requestAnimationFrame / cancel
global.requestAnimationFrame = vi.fn((cb) => setTimeout(cb, 0) as unknown as number)
global.cancelAnimationFrame = vi.fn((id) => clearTimeout(id as unknown as number))

// Default matchMedia mock (no reduced motion)
const createMatchMedia = (matches: boolean) =>
  vi.fn().mockImplementation((query) => ({
    matches,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))

// Basic getBoundingClientRect mock for panels
const defaultRect = {
  top: 0,
  bottom: 800,
  left: 0,
  right: 1200,
  width: 1200,
  height: 800,
  x: 0,
  y: 0,
  toJSON: () => {},
}

describe('ArtistPortfolio Split Hero', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // default to no reduced-motion preference
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: createMatchMedia(false),
    })

    // Mock IntersectionObserver (class-like mock to satisfy TS typings)
    class MockIntersectionObserver {
      constructor(private cb?: IntersectionObserverCallback, private options?: IntersectionObserverInit) {}
      observe = vi.fn()
      unobserve = vi.fn()
      disconnect = vi.fn()
      takeRecords() { return [] }
    }
    // Assign the mock class for the test environment
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(global as any).IntersectionObserver = MockIntersectionObserver

    // Mock getBoundingClientRect for all elements
    Element.prototype.getBoundingClientRect = vi.fn(() => defaultRect)
  })

  it('initializes left/right panels with CSS var of 0 and transform style when motion allowed', () => {
    const { getByTestId } = render(<ArtistPortfolio artistId="1" />)

    const left = getByTestId('artist-left-panel')
    const right = getByTestId('artist-right-panel')

    expect(left).toBeInTheDocument()
    expect(right).toBeInTheDocument()

    // CSS var should be initialized to 0px on mount
    expect(left.style.getPropertyValue('--parallax-offset')).toBe('0px')
    expect(right.style.getPropertyValue('--parallax-offset')).toBe('0px')

    // When motion is allowed, the element should expose the translateY style (uses CSS var)
    expect(left).toHaveStyle({ transform: 'translateY(var(--parallax-offset, 0px))' })
    expect(right).toHaveStyle({ transform: 'translateY(var(--parallax-offset, 0px))' })
  })

  it('does not apply parallax transform when prefers-reduced-motion is true', () => {
    // Mock reduced motion preference
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: createMatchMedia(true),
    })

    const { getByTestId } = render(<ArtistPortfolio artistId="1" />)

    const left = getByTestId('artist-left-panel')
    const right = getByTestId('artist-right-panel')

    // With reduced motion, the hook should not add transform/willChange styles
    expect(left).not.toHaveStyle({ transform: 'translateY(var(--parallax-offset, 0px))' })
    expect(left).not.toHaveStyle({ willChange: 'transform' })

    expect(right).not.toHaveStyle({ transform: 'translateY(var(--parallax-offset, 0px))' })
    expect(right).not.toHaveStyle({ willChange: 'transform' })
  })
})
