"use client"

import type React from "react"
import { SessionProvider } from "next-auth/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { Suspense, useState } from "react"

import { FeatureFlagsProvider } from "@/components/feature-flags-provider"
import { LenisProvider } from "@/components/smooth-scroll-provider"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/theme-provider"
import type { FlagsSnapshot } from "@/lib/flags"

import "./globals.css"
import ConstructionBanner from "@/components/construction-banner"

export default function ClientLayout({
  children,
  initialFlags,
}: Readonly<{
  children: React.ReactNode
  initialFlags: FlagsSnapshot
}>) {
  // Create a new QueryClient instance for each component tree
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // With SSR, we usually want to set some default staleTime
            // above 0 to avoid refetching immediately on the client
            staleTime: 60 * 1000, // 1 minute
            retry: (failureCount, error: unknown) => {
              // Don't retry on 4xx errors
              if (typeof error === "object" && error !== null && "status" in error) {
                const status = (error as { status?: number }).status
                if (typeof status === "number" && status >= 400 && status < 500) {
                  return false
                }
              }
              return failureCount < 3
            },
          },
        },
      })
  )

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <FeatureFlagsProvider value={initialFlags}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            <Suspense fallback={<div>Loading...</div>}>
              <LenisProvider>
                {/* Global construction banner */}
                <ConstructionBanner />
                {/* Push fixed nav down when banner visible */}
                <style>{`html.has-site-banner nav.fixed{top:var(--site-banner-height,0)!important}`}</style>
                {/* Offset page content by banner height */}
                <div style={{ paddingTop: "var(--site-banner-height, 0px)" }}>{children}</div>
                <Toaster />
              </LenisProvider>
            </Suspense>
          </ThemeProvider>
        </FeatureFlagsProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </SessionProvider>
  )
}
