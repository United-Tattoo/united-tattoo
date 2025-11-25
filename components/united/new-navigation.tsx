"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { name: "Artists", href: "/artists" },
  { name: "Your Deposit", href: "/deposit" },
  { name: "Aftercare", href: "/aftercare" },
  { name: "Contact", href: "/contact" },
];

export function Navigation() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out",
          isScrolled
            ? "bg-sand/98 backdrop-blur-md shadow-sm border-b border-ink/5"
            : "bg-transparent",
        )}
      >
        <div className="max-w-[1600px] mx-auto px-[clamp(1.5rem,4vw,5rem)]">
          <div className="flex items-center justify-between py-6">
            {/* Logo - Metadata Style */}
            <Link href="/" className="group">
              <div className="flex items-baseline gap-3">
                <span
                  className="font-playfair text-2xl tracking-tight text-charcoal transition-opacity duration-300 group-hover:opacity-70"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  United Tattoo
                </span>
                <span className="font-grotesk text-[0.65rem] uppercase tracking-[0.3em] text-moss opacity-80">
                  Fountain, CO
                </span>
              </div>
            </Link>

            {/* Desktop Navigation - Whisper Metadata */}
            <div className="hidden lg:flex items-center gap-12">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="group relative"
                  >
                    <span
                      className={cn(
                        "font-grotesk text-[0.75rem] uppercase tracking-[0.3em] font-medium transition-all duration-300",
                        isActive ? "text-charcoal" : "text-charcoal/70 hover:text-charcoal",
                      )}
                    >
                      {item.name}
                    </span>
                    <span
                      className={cn(
                        "absolute -bottom-1 left-0 h-[1px] bg-burnt transition-all duration-300 origin-left",
                        isActive ? "w-full" : "w-0 group-hover:w-full",
                      )}
                    />
                  </Link>
                );
              })}

              {/* Book CTA - Warm Stamp */}
              <Link
                href="/book"
                className="group relative"
                onMouseEnter={(e) => {
                  const btn = e.currentTarget.querySelector("button");
                  if (btn) {
                    btn.style.transform = "translateY(-1px) scale(1.03)";
                    btn.style.boxShadow = "0 14px 28px rgba(176, 71, 30, 0.35)";
                  }
                }}
                onMouseLeave={(e) => {
                  const btn = e.currentTarget.querySelector("button");
                  if (btn) {
                    btn.style.transform = "none";
                    btn.style.boxShadow = "0 10px 22px rgba(176, 71, 30, 0.25)";
                  }
                }}
              >
                <button
                  className="font-grotesk text-[0.85rem] uppercase tracking-[0.2em] font-medium px-8 py-3 transition-all duration-200"
                  style={{
                    backgroundColor: "#b0471e",
                    color: "#ffffff",
                    borderRadius: "12px",
                    boxShadow: "0 10px 22px rgba(176, 71, 30, 0.25)",
                  }}
                >
                  Book Now
                </button>
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 text-charcoal hover:text-burnt transition-colors duration-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden pb-8 border-t border-ink/5">
              <div className="pt-6 space-y-1">
                {NAV_ITEMS.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "block py-3 px-4 font-grotesk text-sm uppercase tracking-[0.25em] transition-all duration-200",
                        isActive
                          ? "text-charcoal border-l-2 border-burnt pl-6"
                          : "text-charcoal/70 hover:text-charcoal hover:pl-6",
                      )}
                    >
                      {item.name}
                    </Link>
                  );
                })}

                {/* Mobile Book Button */}
                <div className="pt-6">
                  <Link href="/book" onClick={() => setMobileMenuOpen(false)}>
                    <button
                      className="w-full font-grotesk text-base uppercase tracking-[0.2em] font-medium px-8 py-4"
                      style={{
                        backgroundColor: "#b0471e",
                        color: "#ffffff",
                        borderRadius: "12px",
                        boxShadow: "0 10px 22px rgba(176, 71, 30, 0.25)",
                      }}
                    >
                      Book Now
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
