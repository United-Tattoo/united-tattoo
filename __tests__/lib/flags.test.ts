import { beforeEach, afterEach, describe, expect, it, vi } from "vitest"

import {
  FLAG_DEFAULTS,
  Flags,
  getFlags,
  registerRuntimeFlags,
  resetFlagsCache,
  parseBool,
} from "@/lib/flags"

type FlagName = keyof typeof FLAG_DEFAULTS
const flagKeys = Object.keys(FLAG_DEFAULTS) as FlagName[]

const originalEnv: Partial<Record<FlagName, string | undefined>> = {}

beforeEach(() => {
  resetFlagsCache()
  for (const key of flagKeys) {
    if (!(key in originalEnv)) {
      originalEnv[key] = process.env[key]
    }
    delete process.env[key]
  }
  delete (globalThis as Record<string, unknown>).__UNITED_TATTOO_RUNTIME_FLAGS__
})

afterEach(() => {
  resetFlagsCache()
  for (const key of flagKeys) {
    const value = originalEnv[key]
    if (value === undefined) {
      delete process.env[key]
    } else {
      process.env[key] = value
    }
  }
  delete (globalThis as Record<string, unknown>).__UNITED_TATTOO_RUNTIME_FLAGS__
})

describe("parseBool", () => {
  it("handles string coercion and defaults", () => {
    expect(parseBool("true", false)).toBe(true)
    expect(parseBool(" FALSE ", true)).toBe(false)
    expect(parseBool("1", false)).toBe(true)
    expect(parseBool(undefined, true)).toBe(true)
  })
})

describe("getFlags", () => {
  it("falls back to defaults and logs missing keys", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {})

    const snapshot = getFlags({ refresh: true })

    expect(snapshot).toMatchObject(FLAG_DEFAULTS)
    expect(warnSpy).toHaveBeenCalled()

    warnSpy.mockRestore()
  })

  it("honours environment overrides", () => {
    process.env.BOOKING_ENABLED = "false"
    process.env.PUBLIC_APPOINTMENT_REQUESTS_ENABLED = "true"

    const snapshot = getFlags({ refresh: true })

    expect(snapshot.BOOKING_ENABLED).toBe(false)
    expect(snapshot.PUBLIC_APPOINTMENT_REQUESTS_ENABLED).toBe(true)
  })
})

describe("registerRuntimeFlags", () => {
  it("allows runtime overrides to take precedence", () => {
    process.env.BOOKING_ENABLED = "true"
    const override = { ...FLAG_DEFAULTS, BOOKING_ENABLED: false } as typeof FLAG_DEFAULTS

    registerRuntimeFlags(override)
    const snapshot = getFlags()

    expect(snapshot.BOOKING_ENABLED).toBe(false)
  })
})

describe("Flags proxy", () => {
  it("reflects current snapshot values", () => {
    process.env.ADMIN_ENABLED = "false"
    const snapshot = getFlags({ refresh: true })
    expect(snapshot.ADMIN_ENABLED).toBe(false)
    expect(Flags.ADMIN_ENABLED).toBe(false)
  })
})
