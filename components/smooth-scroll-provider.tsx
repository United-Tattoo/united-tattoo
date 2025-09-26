"use client"

import { createContext, useContext, useEffect, useState } from "react"

interface LenisInstance {
  raf: (time: number) => void
  destroy: () => void
  scrollTo: (position: number) => void
}

interface LenisContextType {
  lenis: LenisInstance | null
}

const LenisContext = createContext<LenisContextType | undefined>(undefined)

export function useLenis() {
  const context = useContext(LenisContext)
  if (context === undefined) {
    throw new Error("useLenis must be used within a LenisProvider")
  }
  return context.lenis
}

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<LenisInstance | null>(null)

  useEffect(() => {
    const initLenis = async () => {
      const Lenis = (await import("@studio-freight/lenis")).default

      const newLenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      }) as LenisInstance

      setLenis(newLenis)

      function raf(time: number) {
        newLenis?.raf(time)
        requestAnimationFrame(raf)
      }

      requestAnimationFrame(raf)
    }

    initLenis()

    return () => {
      if (lenis) {
        lenis.destroy()
      }
    }
  }, [])

  return <LenisContext.Provider value={{ lenis }}>{children}</LenisContext.Provider>
}
