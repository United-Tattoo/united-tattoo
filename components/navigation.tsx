"use client"

import { useCallback, useEffect, useState } from "react"
import type { MouseEvent } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, X } from "lucide-react"

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
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "backdrop-blur-xl bg-black/80 border-b border-white/10"
          : "bg-transparent"
      )}
    >
      <div className="relative mx-auto max-w-[1600px] px-5 sm:px-8">
        <div className="relative flex h-20 items-center justify-between gap-3">
          <Link
            href="/"
            className="relative flex flex-col items-start text-white transition-opacity hover:opacity-80"
          >
            <span className="font-playfair text-2xl uppercase tracking-[0.2em] sm:text-3xl">
              United
            </span>
            <span className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-white/60">
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
                      <NavigationMenuItem key={item.id}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={item.href}
                            onClick={(e) => handleNavClick(e, item)}
                            className={cn(
                              "text-sm font-medium uppercase tracking-wider transition-colors px-3 py-2",
                              isActive ? "text-white" : "text-white/60 hover:text-white"
                            )}
                          >
                            {item.label}
                          </Link>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    )
                  })}
              </NavigationMenuList>
            </NavigationMenu>

            <Button
              asChild
              className="rounded-full bg-white px-6 py-2 text-sm font-semibold uppercase tracking-wide text-black transition-colors hover:bg-white/90"
            >
              <Link href="/book">Book Now</Link>
            </Button>
          </div>

          <button
            className="rounded-lg border border-white/20 p-2 text-white transition-colors hover:border-white/40 lg:hidden"
            onClick={handleToggleMenu}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isOpen && (
          <div className="absolute left-0 right-0 top-full mt-2 mx-5 rounded-2xl border border-white/10 bg-black/95 backdrop-blur-xl px-6 py-6 sm:mx-8 lg:hidden">
            <NavigationMenu viewport={false} className="w-full">
              <NavigationMenuList className="flex w-full flex-col gap-4">
                {navItems.map((item) => {
                  const isActive = !item.isButton && activeSection === item.id

                  if (item.isButton) {
                    return (
                      <NavigationMenuItem key={item.id} className="w-full pt-2">
                        <Button
                          asChild
                          className="w-full rounded-full bg-white py-3 text-sm font-semibold uppercase tracking-wide text-black hover:bg-white/90"
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
                      <NavigationMenuLink asChild>
                        <Link
                          href={item.href}
                          onClick={(event) => {
                            handleNavClick(event, item)
                            handleCloseMenu()
                          }}
                          className={cn(
                            "block w-full px-4 py-3 text-sm font-medium uppercase tracking-wider transition-colors rounded-lg",
                            isActive
                              ? "bg-white/10 text-white"
                              : "text-white/60 hover:bg-white/5 hover:text-white"
                          )}
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
