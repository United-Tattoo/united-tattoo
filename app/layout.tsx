import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Space_Grotesk } from "next/font/google"
import { Suspense } from "react"
import Script from "next/script"

import ClientLayout from "./ClientLayout"
import { getFlags } from "@/lib/flags"
import { generateMetadata as createMetadata, generateLocalBusinessJsonLd, generateOrganizationJsonLd } from "@/lib/metadata"

import "./globals.css"

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  preload: true,
  weight: ["400", "600"],
  style: ["normal", "italic"],
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
  preload: true,
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = createMetadata({
  title: "United Tattoo - Professional Tattoo Studio in Fountain, Colorado",
  description: "Custom tattoos by talented artists in Fountain, CO. Book your appointment with our award-winning tattoo studio. Specializing in custom designs, portraits, and traditional ink.",
  path: "/",
  keywords: ["tattoo", "tattoo studio", "fountain colorado", "custom tattoos", "tattoo artists", "ink", "body art"],
})

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const flags = getFlags({ refresh: true })
  const localBusinessData = generateLocalBusinessJsonLd()
  const organizationData = generateOrganizationJsonLd()

  return (
    <html lang="en" className={`${playfairDisplay.variable} ${spaceGrotesk.variable}`}>
      <head>
        {/*
          ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
          :   ████ ████ ████ ████ ████ ████ ████ ████ ████ ████ ████ ████ ████ ████ ████   :
          ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
          :    _   _ _   _ _____ _____ ___________   _____ ___ _____ _____ _____  _____    :
          :   | | | | \ | |_   _|_   _|  ___|  _  \ |_   _/ _ \_   _|_   _|  _  ||  _  |   :
          :   | | | |  \| | | |   | | | |__ | | | |   | |/ /_\ \| |   | | | | | || | | |   :
          :   | | | | . ` | | |   | | |  __|| | | |   | ||  _  || |   | | | | | || | | |   :
          :   | |_| | |\  |_| |_  | | | |___| |/ /    | || | | || |   | | \ \_/ /\ \_/ /   :
          :    \___/\_| \_/\___/  \_/ \____/|___/     \_/\_| |_/\_/   \_/  \___/  \___/    :
          ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
          >> AUTHOR   : Nicholai Vogel → Christy Lumberg
          >> STATUS   : NO MIDDLEMEN | NO INTERMEDIARIES | VERIFIED OWNERSHIP              
          >> RIGHTS   : © 2025 Christy Lumberg — ALL RIGHTS RESERVED                       
          >> SYSTEM   : [0xDEADBEEF] [0xFUCKKRST] [0xSYSLOCK] [0xUT-OWNERSHIP-OK]          
          :   ████ ████ ████ ████ ████ ████ ████ ████ ████ ████ ████ ████ ████ ████ ████   :
          ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        */}
        
        {/* JSON-LD Structured Data for SEO */}
        <Script
          id="local-business-jsonld"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessData),
          }}
        />
        <Script
          id="organization-jsonld"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationData),
          }}
        />
        
        {/* Design Credit Console Message */}
        <Script id="design-credit" strategy="afterInteractive">
          {`(function(){
    if (typeof window !== 'undefined' && window.console && !window.__UNITED_TATTOO_CREDIT_DONE) {
      window.__UNITED_TATTOO_CREDIT_DONE = true;
      var lines = [
        "╔══════════════════════════════════════════════════════════════════════╗",
        "║ Website designed and developed by Nicholai Vogel for Christy Lumberg ║",
        "║ NO MIDDLEMEN | NO INTERMEDIARIES | VERIFIED OWNERSHIP                ║",
        "║ © 2025 Christy Lumberg — ALL RIGHTS RESERVED                         ║",
        "╚══════════════════════════════════════════════════════════════════════╝"
      ];
      console.log(lines.join("\\n"));
    }
  })();`}
        </Script>
      </head>
      <body className="font-sans antialiased">
        <Suspense fallback={null}>
          <ClientLayout initialFlags={flags}>{children}</ClientLayout>
        </Suspense>
      </body>
    </html>
  )
}
