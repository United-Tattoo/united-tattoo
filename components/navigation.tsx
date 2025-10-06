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
        "fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out",
        isScrolled
          ? "bg-black/95 backdrop-blur-md shadow-lg border-b border-white/10 opacity-100"
          : "bg-transparent backdrop-blur-none opacity-100",
      )}
    >
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          <Link
            href="/"
            className="font-bold text-xl lg:text-2xl tracking-[0.2em] transition-all duration-500 drop-shadow-lg text-white"
          >
            UNITED TATTOO
          </Link>

          <div className="hidden lg:flex items-center">
            <NavigationMenu viewport={false} className="flex-initial items-center bg-transparent text-white">
              <NavigationMenuList className="flex items-center gap-12">
                {navItems.map((item) => {
                  const isActive = !item.isButton && activeSection === item.id

                  if (item.isButton) {
                    return (
                      <NavigationMenuItem key={item.id} className="min-w-max">
                        <Button
                          asChild
                          className={cn(
                            "px-8 py-3 text-sm font-semibold tracking-[0.05em] uppercase transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-0 hover:scale-105",
                            isScrolled
                              ? "bg-white text-black hover:bg-gray-100 shadow-xl hover:shadow-2xl"
                              : "border border-white/80 bg-transparent text-white shadow-none hover:bg-white/10",
                          )}
                        >
                          <Link href={item.href} onClick={(event) => handleNavClick(event, item)}>
                            {item.label}
                          </Link>
                        </Button>
                      </NavigationMenuItem>
                    )
                  }

                  return (
                    <NavigationMenuItem key={item.id} className="min-w-max">
                      <NavigationMenuLink
                        asChild
                        data-active={isActive || undefined}
                        className={cn(
                          "group relative inline-flex h-auto bg-transparent px-0 py-1 text-xs font-semibold tracking-[0.1em] uppercase transition-all duration-300",
                          "text-white/80 hover:bg-transparent hover:text-white focus:bg-transparent focus:text-white",
                          "after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full focus-visible:after:w-full",
                          isActive && "text-white after:w-full",
                        )}
                      >
                        <Link href={item.href}>{item.label}</Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  )
                })}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <button
            className="lg:hidden p-4 rounded-lg transition-all duration-300 text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-0"
            onClick={handleToggleMenu}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isOpen && (
          <div className="lg:hidden bg-black/98 backdrop-blur-md border-t border-white/10">
            <div className="px-6 py-8 space-y-5">
              <NavigationMenu viewport={false} className="w-full">
                <NavigationMenuList className="flex w-full flex-col space-y-3">
                  {navItems.map((item) => {
                    const isActive = !item.isButton && activeSection === item.id

                    if (item.isButton) {
                      return (
                        <NavigationMenuItem key={item.id} className="w-full">
                          <Button
                            asChild
                            className="w-full bg-white hover:bg-gray-100 text-black py-5 text-lg font-semibold tracking-[0.05em] uppercase shadow-xl mt-8"
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
                            "block w-full rounded-md px-4 py-4 text-lg font-semibold tracking-[0.1em] uppercase transition-all duration-300",
                            isActive
                              ? "border-l-4 border-white pl-6 text-white"
                              : "text-white/70 hover:text-white hover:pl-5 focus:text-white focus:pl-5",
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
          </div>
        )}
      </div>
    </nav>
  )
}
