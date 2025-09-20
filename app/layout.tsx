import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Source_Sans_3 } from "next/font/google"
import { Suspense } from "react"

import ClientLayout from "./ClientLayout"
import { getFlags } from "@/lib/flags"

import "./globals.css"

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "United Tattoo - Professional Tattoo Studio",
  description: "Book appointments with our talented artists and explore stunning tattoo portfolios at United Tattoo.",
  generator: "v0.app",
}

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const flags = getFlags({ refresh: true })

  return (
    <html lang="en" className={`${playfairDisplay.variable} ${sourceSans.variable}`}>
      <body className="font-sans antialiased">
        <Suspense fallback={null}>
          <ClientLayout initialFlags={flags}>{children}</ClientLayout>
        </Suspense>
      </body>
    </html>
  )
}
