"use client"

import { useCallback, useEffect, useState } from "react"
import type { MouseEvent } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ArrowUpRight, Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"

type NavItem = {
  href: string
  label: string
  id: string
  isButton?: boolean
}

const navItems: NavItem[] = [
  { href: "#home", label: "Home", id: "home" },
  { href: "#artists", label: "Artists", id: "artists" },
  { href: "#services", label: "Services", id: "services" },
  { href: "#contact", label: "Contact", id: "contact" },
  { href: "/book", label: "Book Now", id: "book", isButton: true },
]

const scrollTrackedIds = navItems.filter((item) => !item.isButton).map((item) => item.id)

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState(scrollTrackedIds[0] ?? "")

  const scrollToSection = useCallback(
    (targetId: string, options?: { href?: string; updateHistory?: boolean }) => {
      const target = document.getElementById(targetId)
      if (!target) {
        return
      }

      const offset = target.getBoundingClientRect().top + window.scrollY - 80
      window.scrollTo({ top: offset, behavior: "smooth" })

      if (options?.href && options.updateHistory !== false) {
        window.history.replaceState(null, "", options.href)
      }

      setActiveSection(targetId)
    },
    [],
  )

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)

      const scrollPosition = window.scrollY + 100

      for (const section of scrollTrackedIds) {
        const element = document.getElementById(section)
        if (!element) {
          continue
        }

        const { offsetTop, offsetHeight } = element
        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
          setActiveSection(section)
          return
        }
      }
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [scrollTrackedIds])

  useEffect(() => {
    if (pathname !== "/") {
      return
    }

    const hash = window.location.hash.slice(1)
    if (!hash) {
      return
    }

    const frame = window.requestAnimationFrame(() => {
      scrollToSection(hash, { updateHistory: false })
    })

    return () => window.cancelAnimationFrame(frame)
  }, [pathname, scrollToSection])

  const handleNavClick = (event: MouseEvent<HTMLAnchorElement>, item: NavItem) => {
    if (item.isButton || !item.href.startsWith("/#")) {
      return
    }

    if (pathname === "/") {
      event.preventDefault()
      const targetId = item.href.slice(2)
      scrollToSection(targetId, { href: item.href })
      return
    }

    event.preventDefault()
    router.push(item.href)
  }

  const handleToggleMenu = () => setIsOpen((previous) => !previous)
  const handleCloseMenu = () => setIsOpen(false)

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out",
        isScrolled
          ? "backdrop-blur-md bg-[rgba(20,18,16,0.92)] border-b border-white/10 shadow-[0_12px_40px_-20px_rgba(0,0,0,0.8)]"
          : "bg-transparent"
      )}
    >
      <div className="relative mx-auto max-w-[1600px] px-5 sm:px-8">
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-x-3 -top-4 h-[130px] rounded-3xl border border-white/10 transition-opacity duration-700",
            "before:absolute before:inset-0 before:rounded-3xl before:bg-[linear-gradient(130deg,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.02)_55%,rgba(10,10,10,0.35)_100%)] before:opacity-90",
            "after:absolute after:inset-0 after:rounded-3xl after:bg-[url('/assets/liberty/sketch-blue-etching.webp')] after:bg-cover after:bg-center after:opacity-10",
            isScrolled ? "opacity-100" : "opacity-80"
          )}
        />

        <div className="relative flex h-[90px] items-center justify-between gap-3">
          <Link
            href="/"
            className="group relative flex flex-col items-start text-white transition-colors duration-500"
          >
            <span className="font-playfair text-[1.8rem] uppercase tracking-[0.28em] sm:text-[2.1rem]">
              United
            </span>
            <span className="mt-1 flex items-center gap-3 text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-white/70">
              <span className="h-px w-9 bg-white/60 transition-all duration-500 group-hover:w-12" />
              Tattoo Studio
            </span>
          </Link>

          <div className="hidden flex-1 items-center justify-end gap-12 text-white lg:flex">
            <NavigationMenu viewport={false} className="flex flex-1 justify-end">
              <NavigationMenuList className="flex items-center gap-8 xl:gap-10">
                {navItems
                  .filter((item) => !item.isButton)
                  .map((item) => {
                    const isActive = activeSection === item.id

                    return (
                      <NavigationMenuItem key={item.id} className="min-w-max">
                        <NavigationMenuLink
                          asChild
                          data-active={isActive || undefined}
                          className={cn(
                            "relative inline-flex items-center text-[0.72rem] font-semibold uppercase tracking-[0.42em] text-white/60 transition-colors duration-300",
                            "group hover:text-white focus-visible:text-white",
                            isActive && "text-white"
                          )}
                        >
                          <Link href={item.href} className="px-1 py-1">
                            {item.label}
                            <span
                              className={cn(
                                "pointer-events-none absolute inset-x-0 -bottom-2 h-[1px] origin-left scale-x-0 bg-white/70 transition-transform duration-300",
                                isActive && "scale-x-100",
                                "group-hover:scale-x-100"
                              )}
                            />
                          </Link>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    )
                  })}
              </NavigationMenuList>
            </NavigationMenu>

            <Button
              asChild
              className={cn(
                "group relative overflow-hidden rounded-full px-8 py-3 text-xs font-semibold uppercase tracking-[0.36em] transition-all duration-300",
                "bg-white/90 text-[#1c1713] shadow-[0_10px_40px_rgba(0,0,0,0.22)] hover:bg-white"
              )}
            >
              <Link href="/book" className="flex items-center gap-2">
                <span>Book Now</span>
                <ArrowUpRight className="h-4 w-4 -translate-y-[1px] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
            </Button>
          </div>

          <button
            className="relative inline-flex rounded-full border border-white/20 p-3 text-white transition-all duration-300 hover:border-white/40 lg:hidden"
            onClick={handleToggleMenu}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {isOpen && (
          <div className="relative z-10 mt-1 overflow-hidden rounded-3xl border border-white/10 bg-[rgba(21,19,16,0.96)] px-6 py-8 shadow-[0_35px_60px_-30px_rgba(0,0,0,0.65)] lg:hidden">
            <NavigationMenu viewport={false} className="w-full">
              <NavigationMenuList className="flex w-full flex-col gap-4">
                {navItems.map((item) => {
                  const isActive = !item.isButton && activeSection === item.id

                  if (item.isButton) {
                    return (
                      <NavigationMenuItem key={item.id} className="w-full pt-4">
                        <Button
                          asChild
                          className="w-full rounded-full bg-white/90 py-4 text-sm font-semibold uppercase tracking-[0.32em] text-[#1c1713] shadow-[0_20px_45px_-25px_rgba(255,255,255,0.9)] hover:bg-white"
                        >
                          <Link href={item.href} onClick={handleCloseMenu}>
                            {item.label}
                          </Link>
                        </Button>
                      </NavigationMenuItem>
                    )
                  }

                  return (
                    <NavigationMenuItem key={item.id} className="w-full">
                      <NavigationMenuLink
                        asChild
                        data-active={isActive || undefined}
                        className={cn(
                          "block w-full rounded-2xl border border-transparent px-4 py-4 text-sm font-semibold uppercase tracking-[0.3em] text-white/70 transition-all duration-300",
                          isActive
                            ? "border-white/20 bg-white/5 text-white"
                            : "hover:border-white/10 hover:bg-white/5 hover:text-white"
                        )}
                      >
                        <Link
                          href={item.href}
                          onClick={(event) => {
                            handleNavClick(event, item)
                            handleCloseMenu()
                          }}
                        >
                          {item.label}
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  )
                })}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        )}
      </div>
    </nav>
  )
}
