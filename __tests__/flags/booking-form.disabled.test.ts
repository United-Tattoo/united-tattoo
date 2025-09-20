import React from "react"
import { renderToString } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { BookingForm } from "@/components/booking-form"
import { FeatureFlagsProvider } from "@/components/feature-flags-provider"
import { FLAG_DEFAULTS } from "@/lib/flags"

const disabledFlags = { ...FLAG_DEFAULTS, BOOKING_ENABLED: false } as typeof FLAG_DEFAULTS

describe("BookingForm disabled mode (SSR string)", () => {
  it("includes disabled notice when BOOKING_ENABLED=false", () => {
    const html = renderToString(
      <FeatureFlagsProvider value={disabledFlags}>
        <BookingForm />
      </FeatureFlagsProvider>,
    )

    expect(html).toContain("Online booking is temporarily unavailable")
    expect(html).toContain("contact the studio")
  })
})
