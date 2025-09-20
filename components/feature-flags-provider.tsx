"use client"

import { createContext, useContext, useEffect } from "react"
import type { FlagsSnapshot, FlagName } from "@/lib/flags"
import { FLAG_DEFAULTS, registerRuntimeFlags } from "@/lib/flags"

type FeatureFlagsProviderProps = {
  value: FlagsSnapshot
  children: React.ReactNode
}

const FeatureFlagsContext = createContext<FlagsSnapshot>(FLAG_DEFAULTS)

export function FeatureFlagsProvider({ value, children }: FeatureFlagsProviderProps) {
  useEffect(() => {
    registerRuntimeFlags(value)
  }, [value])

  return <FeatureFlagsContext.Provider value={value}>{children}</FeatureFlagsContext.Provider>
}

export function useFeatureFlags(): FlagsSnapshot {
  return useContext(FeatureFlagsContext)
}

export function useFeatureFlag(name: FlagName): boolean {
  const flags = useFeatureFlags()
  return flags[name]
}
