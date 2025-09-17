"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("home")

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)

      const sections = ["home", "artists", "services", "contact"]
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { href: "#home", label: "Home", id: "home" },
    { href: "#artists", label: "Artists", id: "artists" },
    { href: "#services", label: "Services", id: "services" },
    { href: "#contact", label: "Contact", id: "contact" },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out ${
        isScrolled
          ? "bg-black/95 backdrop-blur-md shadow-lg border-b border-white/10 opacity-100"
          : "bg-transparent opacity-0 pointer-events-none"
      }`}
    >
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          <Link
            href="/"
            className="font-bold text-xl lg:text-2xl tracking-[0.2em] transition-all duration-500 drop-shadow-lg text-white"
          >
            UNITED TATTOO
          </Link>

          <div className="hidden lg:flex items-center space-x-12">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative text-sm font-semibold tracking-[0.1em] uppercase transition-all duration-300 group ${
                  activeSection === item.id ? "text-white" : "text-white/80 hover:text-white"
                }`}
              >
                {item.label}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-white transition-all duration-300 ${
                    activeSection === item.id ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            ))}
            <Button
              asChild
              className="bg-white hover:bg-gray-100 text-black !text-black px-8 py-3 text-sm font-semibold tracking-[0.05em] uppercase shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <Link href="/book">Book Now</Link>
            </Button>
          </div>

          <button
            className="lg:hidden p-3 rounded-lg transition-all duration-300 text-white hover:bg-white/10"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isOpen && (
          <div className="lg:hidden bg-black/98 backdrop-blur-md border-t border-white/10">
            <div className="px-6 py-8 space-y-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block text-lg font-semibold tracking-[0.1em] uppercase transition-all duration-300 ${
                    activeSection === item.id
                      ? "text-white border-l-4 border-white pl-4"
                      : "text-white/70 hover:text-white hover:pl-2"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Button
                asChild
                className="w-full bg-white hover:bg-gray-100 text-black !text-black py-4 text-lg font-semibold tracking-[0.05em] uppercase shadow-xl mt-8"
              >
                <Link href="/book" onClick={() => setIsOpen(false)}>
                  Book Now
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
