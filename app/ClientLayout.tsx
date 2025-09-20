"use client"

import type React from "react"
import { SessionProvider } from "next-auth/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { Suspense, useState } from "react"

import { FeatureFlagsProvider } from "@/components/feature-flags-provider"
import { SmoothScrollProvider } from "@/components/smooth-scroll-provider"
import { Toaster } from "@/components/ui/sonner"
import type { FlagsSnapshot } from "@/lib/flags"

import "./globals.css"

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
            retry: (failureCount, error: any) => {
              // Don't retry on 4xx errors
              if (error?.status >= 400 && error?.status < 500) {
                return false
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
          <Suspense fallback={<div>Loading...</div>}>
            <SmoothScrollProvider>
              {children}
              <Toaster />
            </SmoothScrollProvider>
          </Suspense>
        </FeatureFlagsProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </SessionProvider>
  )
}
