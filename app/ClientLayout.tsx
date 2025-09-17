"use client"

import type React from "react"
import { SmoothScrollProvider } from "@/components/smooth-scroll-provider"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import "./globals.css"

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const searchParams = useSearchParams()

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </Suspense>
    </>
  )
}
