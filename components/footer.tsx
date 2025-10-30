"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY
      const threshold = window.innerHeight * 0.5
      setShowScrollTop(scrolled > threshold)
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <>
      <Button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-50 h-12 w-12 rounded-full border border-white/15 bg-white/90 p-0 text-[#1c1713] shadow-[0_30px_60px_-35px_rgba(255,255,255,0.65)] transition-all duration-300 hover:scale-[1.05] hover:bg-white ${
          showScrollTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
        aria-label="Scroll to top"
      >
        <ArrowUp size={20} />
      </Button>

      <footer className="bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.09),transparent_55%),linear-gradient(180deg,#15100d_0%,#0c0907_100%)] py-16 text-white">
        <div className="container mx-auto px-8">
          <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-12">
            <div className="md:col-span-3">
              <div className="mb-6 flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-white/55">
                <span className="inline-flex h-2 w-2 rounded-full bg-white/40" /> Services
              </div>
              <ul className="space-y-3 text-sm text-white/65">
                {[
                  { name: "TRADITIONAL", count: "" },
                  { name: "REALISM", count: "" },
                  { name: "BLACKWORK", count: "" },
                  { name: "FINE LINE", count: "" },
                  { name: "WATERCOLOR", count: "" },
                  { name: "COVER-UPS", count: "" },
                  { name: "ANIME", count: "" },
                ].map((service, index) => (
                  <li key={index}>
                    <Link href="/book" className="transition-colors duration-200 hover:text-white">
                      {service.name}
                      {service.count && <span className="text-white ml-2">{service.count}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-3">
              <div className="mb-6 flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-white/55">
                <span className="inline-flex h-2 w-2 rounded-full bg-white/40" /> Artists
              </div>
              <ul className="space-y-3 text-sm text-white/65">
                {[
                  { name: "CHRISTY_LUMBERG", count: "" },
                  { name: "STEVEN_SOLE", count: "" },
                  { name: "DONOVAN_L", count: "" },
                  { name: "VIEW_ALL", count: "" },
                ].map((artist, index) => (
                  <li key={index}>
                    <Link href="/artists" className="transition-colors duration-200 hover:text-white">
                      {artist.name}
                      {artist.count && <span className="text-white ml-2">{artist.count}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-3">
              <div className="mb-4 text-xs uppercase tracking-[0.4em] text-white/40">
                © <span className="text-white/80">UNITED.TATTOO</span> LLC 2025 — All Rights Reserved
              </div>
              <div className="space-y-2 text-sm text-white/60">
                <p>5160 Fontaine Blvd</p>
                <p>Fountain, CO 80817</p>
                <Link href="tel:+17196989004" className="transition-colors duration-200 hover:text-white">
                  (719) 698-9004
                </Link>
              </div>
            </div>

            <div className="md:col-span-3 space-y-8">
              {/* Legal */}
              <div>
                <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-white/55">
                  <span className="inline-flex h-2 w-2 rounded-full bg-white/40" /> Legal
                </div>
                <ul className="space-y-2 text-sm text-white/65">
                  <li>
                    <Link
                      href="/aftercare"
                      className="transition-colors duration-200 hover:text-white underline"
                    >
                      AFTERCARE
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/deposit"
                      className="transition-colors duration-200 hover:text-white underline"
                    >
                      DEPOSIT POLICY
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/terms"
                      className="transition-colors duration-200 hover:text-white underline"
                    >
                      TERMS OF SERVICE
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/privacy"
                      className="transition-colors duration-200 hover:text-white underline"
                    >
                      PRIVACY POLICY
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="transition-colors duration-200 hover:text-white underline"
                    >
                      WAIVER
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Social */}
              <div>
                <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-white/55">
                  <span className="inline-flex h-2 w-2 rounded-full bg-white/40" /> Social
                </div>
                <ul className="space-y-2 text-sm text-white/65">
                  <li>
                    <Link
                      href="https://www.instagram.com/unitedtattoo719"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/65 underline transition-colors duration-200 hover:text-white"
                    >
                      INSTAGRAM
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://www.facebook.com/unitedtattoo719"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/65 underline transition-colors duration-200 hover:text-white"
                    >
                      FACEBOOK
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://www.tiktok.com/@united.tattoo"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/65 underline transition-colors duration-200 hover:text-white"
                    >
                      TIKTOK
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-white/55">
                  <span className="inline-flex h-2 w-2 rounded-full bg-white/40" /> Contact
                </div>
                <Link
                  href="mailto:info@united-tattoo.com"
                  className="text-sm text-white/65 underline transition-colors duration-200 hover:text-white"
                >
                  INFO@UNITED-TATTOO.COM
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-10 flex justify-end gap-2">
            <div className="h-2 w-2 rounded-full bg-white/25" />
            <div className="h-2 w-2 rounded-full bg-white/60" />
          </div>
        </div>
      </footer>
    </>
  )
}
