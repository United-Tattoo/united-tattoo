import React from 'react'
import { render, act } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { useParallax, useReducedMotion } from '@/hooks/use-parallax'

// Mock window methods
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock window properties
Object.defineProperty(window, 'pageYOffset', {
  writable: true,
  value: 0,
})

Object.defineProperty(window, 'innerHeight', {
  writable: true,
  value: 800,
})

// Mock requestAnimationFrame
global.requestAnimationFrame = vi.fn(callback => setTimeout(callback, 0))
global.cancelAnimationFrame = vi.fn(id => clearTimeout(id))

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock getBoundingClientRect
Element.prototype.getBoundingClientRect = vi.fn(() => ({
  top: 0,
  bottom: 100,
  left: 0,
  right: 100,
  width: 100,
  height: 100,
  x: 0,
  y: 0,
  toJSON: () => {},
}))

// Test component that uses the parallax hook
const TestComponent = ({ depth = 0.1, disabled = false }: { depth?: number; disabled?: boolean }) => {
  const parallax = useParallax({ depth, disabled })
  
  return (
    <div 
      ref={parallax.ref} 
      style={parallax.style}
      data-testid="parallax-element"
    >
      Test Element
    </div>
  )
}

describe('useParallax Hook', () => {
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks()
    
    // Reset window properties
    Object.defineProperty(window, 'pageYOffset', {
      writable: true,
      value: 0,
    })
    
    // Reset mock implementations
    Element.prototype.getBoundingClientRect = vi.fn(() => ({
      top: 0,
      bottom: 100,
      left: 0,
      right: 100,
      width: 100,
      height: 100,
      x: 0,
      y: 0,
      toJSON: () => {},
    }))
  })

  it('initializes CSS transform to 0 at mount', () => {
    render(<TestComponent />)
    
    const element = document.querySelector('[data-testid="parallax-element"]')
    expect(element).toBeInTheDocument()
    
    // Initially should have 0px transform via CSS variable
    expect(element).toHaveStyle({ transform: 'translateY(var(--parallax-offset, 0px))' })
  })

  it('does not apply translation until scroll occurs', () => {
    render(<TestComponent depth={0.1} />)
    
    const element = document.querySelector('[data-testid="parallax-element"]')
    expect(element).toBeInTheDocument()
    
    // Initially should have 0px transform via CSS variable
    expect(element).toHaveStyle({ transform: 'translateY(var(--parallax-offset, 0px))' })
    
    // Simulate scroll
    act(() => {
      Object.defineProperty(window, 'pageYOffset', {
        writable: true,
        value: 100,
      })
      window.dispatchEvent(new Event('scroll'))
    })
    
    // After scroll, transform should still use CSS variable
    expect(element).toHaveStyle({ transform: 'translateY(var(--parallax-offset, 0px))' })
  })

  it('respects disabled prop and does not apply transforms', () => {
    render(<TestComponent depth={0.1} disabled={true} />)
    
    const element = document.querySelector('[data-testid="parallax-element"]')
    expect(element).toBeInTheDocument()
    
    // With disabled=true, should have no transform styles
    expect(element).not.toHaveStyle({ transform: 'translateY(var(--parallax-offset, 0px))' })
    expect(element).not.toHaveStyle({ willChange: 'transform' })
  })
})

describe('useReducedMotion Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initializes with correct boolean value from prefersReducedMotion()', () => {
    // Mock matchMedia to return true for reduced motion
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })

    let reducedMotionValue: boolean
    const TestReducedMotionComponent = () => {
      reducedMotionValue = useReducedMotion()
      return <div>Test</div>
    }

    render(<TestReducedMotionComponent />)
    
    // Should be a boolean value, not a function reference
    expect(typeof reducedMotionValue).toBe('boolean')
    expect(reducedMotionValue).toBe(true)
  })

  it('disables parallax transforms when reduced motion is preferred', () => {
    // Mock matchMedia to return true for reduced motion
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })

    render(<TestComponent depth={0.1} />)
    
    const element = document.querySelector('[data-testid="parallax-element"]')
    expect(element).toBeInTheDocument()
    
    // With reduced motion, should have no transform styles
    expect(element).not.toHaveStyle({ transform: 'translateY(var(--parallax-offset, 0px))' })
    expect(element).not.toHaveStyle({ willChange: 'transform' })
  })
})