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
        className={`fixed bottom-8 right-8 z-50 rounded-full w-12 h-12 p-0 bg-white text-black hover:bg-gray-100 shadow-lg transition-all duration-300 ${
          showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        aria-label="Scroll to top"
      >
        <ArrowUp size={20} />
      </Button>

      <footer className="bg-black text-white py-16 font-mono">
        <div className="container mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-3">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-white">↳</span>
                <h4 className="text-white font-medium tracking-wide text-lg">SERVICES</h4>
              </div>
              <ul className="space-y-3 text-base">
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
                    <Link href="/book" className="text-gray-400 hover:text-white transition-colors duration-200">
                      {service.name}
                      {service.count && <span className="text-white ml-2">{service.count}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-3">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-white">↳</span>
                <h4 className="text-white font-medium tracking-wide text-lg">ARTISTS</h4>
              </div>
              <ul className="space-y-3 text-base">
                {[
                  { name: "CHRISTY_LUMBERG", count: "" },
                  { name: "STEVEN_SOLE", count: "" },
                  { name: "DONOVAN_L", count: "" },
                  { name: "VIEW_ALL", count: "" },
                ].map((artist, index) => (
                  <li key={index}>
                    <Link href="/artists" className="text-gray-400 hover:text-white transition-colors duration-200">
                      {artist.name}
                      {artist.count && <span className="text-white ml-2">{artist.count}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-3">
              <div className="text-gray-500 text-sm leading-relaxed mb-4">
                © <span className="text-white underline">UNITED.TATTOO</span> LLC 2025
                <br />
                ALL RIGHTS RESERVED.
              </div>
              <div className="text-gray-400 text-sm">
                5160 FONTAINE BLVD
                <br />
                FOUNTAIN, CO 80817
                <br />
                <Link href="tel:+17196989004" className="hover:text-white transition-colors">
                  (719) 698-9004
                </Link>
              </div>
            </div>

            <div className="md:col-span-3 space-y-8">
              {/* Legal */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-white">↳</span>
                  <h4 className="text-white font-medium tracking-wide text-lg">LEGAL</h4>
                </div>
                <ul className="space-y-2 text-base">
                  <li>
                    <Link
                      href="/aftercare"
                      className="text-gray-400 hover:text-white transition-colors duration-200 underline"
                    >
                      AFTERCARE
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/deposit"
                      className="text-gray-400 hover:text-white transition-colors duration-200 underline"
                    >
                      DEPOSIT POLICY
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/terms"
                      className="text-gray-400 hover:text-white transition-colors duration-200 underline"
                    >
                      TERMS OF SERVICE
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/privacy"
                      className="text-gray-400 hover:text-white transition-colors duration-200 underline"
                    >
                      PRIVACY POLICY
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors duration-200 underline"
                    >
                      WAIVER
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Social */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-white">↳</span>
                  <h4 className="text-white font-medium tracking-wide text-lg">SOCIAL</h4>
                </div>
                <ul className="space-y-2 text-base">
                  <li>
                    <Link href="https://www.instagram.com/unitedtattoo719" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-200 underline">
                      INSTAGRAM
                    </Link>
                  </li>
                  <li>
                    <Link href="https://www.facebook.com/unitedtattoo719" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-200 underline">
                      FACEBOOK
                    </Link>
                  </li>
                  <li>
                    <Link href="https://www.tiktok.com/@united.tattoo" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-200 underline">
                      TIKTOK
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-white">↳</span>
                  <h4 className="text-white font-medium tracking-wide text-lg">CONTACT</h4>
                </div>
                <Link
                  href="mailto:info@united-tattoo.com"
                  className="text-gray-400 hover:text-white transition-colors duration-200 underline text-base"
                >
                  INFO@UNITED-TATTOO.COM
                </Link>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-8 gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-400"></div>
            <div className="w-3 h-3 rounded-full bg-white"></div>
          </div>
        </div>
      </footer>
    </>
  )
}
