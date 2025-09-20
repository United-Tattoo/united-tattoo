import React from 'react'
import { renderToString } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { ArtistsSection } from '@/components/artists-section'
import { FeatureFlagsProvider } from '@/components/feature-flags-provider'
import { FLAG_DEFAULTS } from '@/lib/flags'

const disabledAnimationFlags = {
  ...FLAG_DEFAULTS,
  ADVANCED_NAV_SCROLL_ANIMATIONS_ENABLED: false,
} as typeof FLAG_DEFAULTS

describe('ArtistsSection static fallback when animations disabled', () => {
  it('renders cards visible without animation classes', () => {
    const html = renderToString(
      <FeatureFlagsProvider value={disabledAnimationFlags}>
        <ArtistsSection />
      </FeatureFlagsProvider>,
    )

    expect(html).not.toContain('opacity-0 translate-y-8')
    expect(html).toContain('opacity-100 translate-y-0')
  })
})
