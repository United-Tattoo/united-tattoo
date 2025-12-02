"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowUp } from "lucide-react"

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
      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-50 rounded-full w-12 h-12 p-0
          bg-[var(--burnt)] text-white
          shadow-[0_10px_22px_rgba(176,71,30,0.25)]
          transition-all duration-300 ease-out
          hover:scale-105 hover:translate-y-[-1px] hover:shadow-[0_12px_24px_rgba(176,71,30,0.3)]
          ${showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}
          flex items-center justify-center`}
        aria-label="Scroll to top"
      >
        <ArrowUp size={20} strokeWidth={2.5} />
      </button>

      <footer className="relative bg-[#1a1613] text-[var(--cream)] py-[clamp(3.5rem,8vw,6rem)] overflow-hidden">
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')]" />

        <div className="container mx-auto px-[clamp(1.5rem,4vw,5rem)] relative">
          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[clamp(2.5rem,5vw,4rem)] mb-[3.5rem]">

            {/* Services Column */}
            <div>
              <h4 className="text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-[rgba(162,143,121,0.6)] mb-6">
                Services
              </h4>
              <ul className="space-y-3">
                {[
                  { name: "Traditional", href: "/book" },
                  { name: "Realism", href: "/book" },
                  { name: "Blackwork", href: "/book" },
                  { name: "Fine Line", href: "/book" },
                  { name: "Watercolor", href: "/book" },
                  { name: "Cover-ups", href: "/book" },
                  { name: "Anime", href: "/book" },
                ].map((service, index) => (
                  <li key={index}>
                    <Link
                      href={service.href}
                      className="text-[0.9rem] text-[rgba(162,143,121,0.8)] hover:text-[var(--cream)]
                        transition-colors duration-300 ease-out
                        relative inline-block"
                    >
                      {service.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Artists Column */}
            <div>
              <h4 className="text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-[rgba(162,143,121,0.6)] mb-6">
                Artists
              </h4>
              <ul className="space-y-3">
                {[
                  { name: "Christy Lumberg", href: "/artists/christy-lumberg" },
                  { name: "Steven Sole", href: "/artists/steven-sole" },
                  { name: "Donovan L", href: "/artists/donovan-l" },
                  { name: "View All", href: "/artists" },
                ].map((artist, index) => (
                  <li key={index}>
                    <Link
                      href={artist.href}
                      className="text-[0.9rem] text-[rgba(162,143,121,0.8)] hover:text-[var(--cream)]
                        transition-colors duration-300 ease-out
                        relative inline-block"
                    >
                      {artist.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Studio Info Column */}
            <div>
              <h4 className="text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-[rgba(162,143,121,0.6)] mb-6">
                Studio
              </h4>
              <address className="not-italic text-[0.9rem] text-[rgba(162,143,121,0.8)] leading-relaxed space-y-1">
                <p>5160 Fontaine Blvd</p>
                <p>Fountain, CO 80817</p>
                <Link
                  href="tel:+17196989004"
                  className="block mt-3 hover:text-[var(--cream)] transition-colors duration-300 ease-out"
                >
                  (719) 698-9004
                </Link>
                <Link
                  href="mailto:info@united-tattoo.com"
                  className="block mt-2 hover:text-[var(--cream)] transition-colors duration-300 ease-out"
                >
                  info@united-tattoo.com
                </Link>
              </address>
            </div>

            {/* Legal & Social Column */}
            <div className="space-y-8">
              {/* Legal */}
              <div>
                <h4 className="text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-[rgba(162,143,121,0.6)] mb-6">
                  Legal
                </h4>
                <ul className="space-y-3">
                  {[
                    { name: "Aftercare", href: "/aftercare" },
                    { name: "Deposit Policy", href: "/deposit" },
                    { name: "Terms of Service", href: "/terms" },
                    { name: "Privacy Policy", href: "/privacy" },
                    { name: "Waiver", href: "#" },
                  ].map((link, index) => (
                    <li key={index}>
                      <Link
                        href={link.href}
                        className="text-[0.9rem] text-[rgba(162,143,121,0.8)] hover:text-[var(--cream)]
                          transition-colors duration-300 ease-out"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Social */}
              <div>
                <h4 className="text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-[rgba(162,143,121,0.6)] mb-6">
                  Social
                </h4>
                <ul className="space-y-3">
                  {[
                    { name: "Instagram", href: "https://www.instagram.com/unitedtattoo719" },
                    { name: "Facebook", href: "https://www.facebook.com/unitedtattoo719" },
                    { name: "TikTok", href: "https://www.tiktok.com/@united.tattoo" },
                  ].map((social, index) => (
                    <li key={index}>
                      <Link
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[0.9rem] text-[rgba(162,143,121,0.8)] hover:text-[var(--cream)]
                          transition-colors duration-300 ease-out"
                      >
                        {social.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-[rgba(162,143,121,0.15)]
            flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[0.8rem] text-[rgba(162,143,121,0.5)] tracking-wide">
              © UNITED TATTOO LLC 2025. All Rights Reserved.
            </p>

            {/* Decorative Elements */}
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#E67E50]" />
              <div className="w-2 h-2 rounded-full bg-[#D87850]" />
              <div className="w-2 h-2 rounded-full bg-[#b0471e]" />
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
