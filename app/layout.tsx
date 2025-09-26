import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Source_Sans_3 } from "next/font/google"
import { Suspense } from "react"
import Script from "next/script"

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
