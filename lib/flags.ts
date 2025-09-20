// Runtime feature flag helpers with defaults, logging, and client hydration support.

type Boolish = string | boolean | undefined | null

const RUNTIME_GLOBAL_KEY = "__UNITED_TATTOO_RUNTIME_FLAGS__"

export const FLAG_DEFAULTS = Object.freeze({
  ADMIN_ENABLED: true,
  ARTISTS_MODULE_ENABLED: true,
  UPLOADS_ADMIN_ENABLED: true,
  BOOKING_ENABLED: true,
  PUBLIC_APPOINTMENT_REQUESTS_ENABLED: false,
  REFERENCE_UPLOADS_PUBLIC_ENABLED: false,
  DEPOSITS_ENABLED: false,
  PUBLIC_DB_ARTISTS_ENABLED: false,
  ADVANCED_NAV_SCROLL_ANIMATIONS_ENABLED: true,
  STRICT_CI_GATES_ENABLED: true,
  ISR_CACHE_R2_ENABLED: true,
} as const)

export type FlagsSnapshot = typeof FLAG_DEFAULTS
export type FlagName = keyof FlagsSnapshot

const FLAG_NAMES = Object.keys(FLAG_DEFAULTS) as FlagName[]
const FLAG_NAME_SET = new Set<FlagName>(FLAG_NAMES)

const warnedMissing = new Set<FlagName>()
let cachedSnapshot: FlagsSnapshot | null = null

function parseBool(value: Boolish, defaultValue: boolean): boolean {
  if (typeof value === "boolean") {
    return value
  }
  if (typeof value === "string") {
    const cleaned = value.trim().toLowerCase()
    if (cleaned === "true" || cleaned === "1") return true
    if (cleaned === "false" || cleaned === "0") return false
  }
  return defaultValue
}

function getRuntimeStore(): Partial<Record<FlagName, Boolish>> | undefined {
  if (typeof globalThis === "undefined") return undefined
  return (globalThis as Record<string, unknown>)[RUNTIME_GLOBAL_KEY] as
    | Partial<Record<FlagName, Boolish>>
    | undefined
}

function readRawValue(name: FlagName): Boolish {
  const runtime = getRuntimeStore()
  if (runtime && runtime[name] !== undefined) {
    return runtime[name]
  }
  if (typeof process !== "undefined" && process.env && process.env[name] !== undefined) {
    return process.env[name]
  }
  return undefined
}

function warnIfMissing(name: FlagName, value: boolean): void {
  if (warnedMissing.has(name)) return
  warnedMissing.add(name)
  if (typeof console === "undefined" || typeof window !== "undefined") return
  console.warn(
    `[flags] ${name} not provided; defaulting to ${value}. Set env var to override.`,
  )
}

function computeSnapshot(): FlagsSnapshot {
  const next = {} as Record<FlagName, boolean>
  for (const key of FLAG_NAMES) {
    const raw = readRawValue(key)
    const parsed = parseBool(raw, FLAG_DEFAULTS[key])
    if (raw === undefined || raw === null || (typeof raw === "string" && raw.trim() === "")) {
      warnIfMissing(key, parsed)
    }
    next[key] = parsed
  }
  return Object.freeze(next) as FlagsSnapshot
}

export function getFlags(options: { refresh?: boolean } = {}): FlagsSnapshot {
  if (options.refresh) {
    cachedSnapshot = null
  }
  if (cachedSnapshot) {
    return cachedSnapshot
  }
  const snapshot = computeSnapshot()
  cachedSnapshot = snapshot
  return snapshot
}

export function getFlag(name: FlagName): boolean {
  return getFlags()[name]
}

export function registerRuntimeFlags(snapshot: FlagsSnapshot): void {
  if (typeof globalThis !== "undefined") {
    ;(globalThis as Record<string, unknown>)[RUNTIME_GLOBAL_KEY] = snapshot
  }
  cachedSnapshot = snapshot
}

export function resetFlagsCache(): void {
  cachedSnapshot = null
  warnedMissing.clear()
}

export const Flags = new Proxy({} as FlagsSnapshot, {
  get: (_target, prop: string) => {
    if (!FLAG_NAME_SET.has(prop as FlagName)) {
      return undefined
    }
    return getFlags()[prop as FlagName]
  },
  ownKeys: () => FLAG_NAMES,
  getOwnPropertyDescriptor: (_target, prop: string) => {
    if (!FLAG_NAME_SET.has(prop as FlagName)) {
      return undefined
    }
    return {
      configurable: true,
      enumerable: true,
      value: getFlags()[prop as FlagName],
    }
  },
}) as FlagsSnapshot

export { parseBool }
