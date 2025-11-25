"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import {
    NavigationMenu as ShadNavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
    { name: "Artists", href: "/artists" },
    { name: "Your Deposit", href: "/deposit" },
    { name: "Aftercare", href: "/aftercare" },
    { name: "Contact", href: "/contact" },
];

const CTA_LABEL = "Book";

export function Navigation() {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 16);

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    const navLinkClass = (isActive: boolean) =>
        cn(
            "group inline-flex flex-col items-center gap-1 font-semibold text-xs uppercase tracking-very-wide text-charcoal transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-offset-4 rounded-sm",
            isActive ? "opacity-100" : "opacity-80 hover:opacity-100",
        );

    return (
        <nav
            className={cn(
                "fixed inset-x-0 top-0 z-50 border-b transition-all duration-500",
                isScrolled
                    ? "bg-sand/95 border-charcoal/10 backdrop-blur-xl shadow-[0_12px_40px_rgba(28,25,21,0.08)]"
                    : "bg-sage-concrete/10 backdrop-blur-sm border-charcoal/5",
            )}
        >
            <div className="max-w-[1600px] mx-auto px-[clamp(1.5rem,4vw,5rem)]">
                <div className="flex items-center gap-4 py-4">
                    <Link href="/" className="group">
                        <div className="flex flex-col text-left">
                            <span
                                className="font-playfair text-xl lg:text-[1.65rem] font-semibold leading-none tracking-tight transition-opacity duration-300 group-hover:opacity-75 text-charcoal"
                            >
                                United Tattoo
                            </span>
                            <span className="font-grotesk text-xs font-medium uppercase tracking-extra-wide text-charcoal/90 hidden sm:block">
                                Gallery &amp; Studio • Fountain, CO
                            </span>
                        </div>
                    </Link>

                    <div className="hidden lg:flex flex-1 justify-center">
                        <ShadNavigationMenu className="bg-transparent text-charcoal" viewport={false}>
                            <NavigationMenuList className="gap-8">
                                {NAV_ITEMS.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <NavigationMenuItem key={item.name}>
                                            <NavigationMenuLink asChild>
                                                <Link href={item.href} className={navLinkClass(isActive)}>
                                                    <span>{item.name}</span>
                                                    <span
                                                        aria-hidden
                                                        className={cn(
                                                            "h-px w-8 origin-left bg-burnt/70 transition-transform duration-300",
                                                            isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                                                        )}
                                                    />
                                                </Link>
                                            </NavigationMenuLink>
                                        </NavigationMenuItem>
                                    );
                                })}
                            </NavigationMenuList>
                        </ShadNavigationMenu>
                    </div>

                    <div className="hidden lg:flex items-center justify-end">
                        <Link
                            href="/book"
                            className="group relative inline-flex h-[44px] items-center gap-3 rounded-[12px] bg-sage-concrete px-8 text-xs font-semibold uppercase tracking-widest text-white transition-all duration-300 hover:bg-sage-concrete/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-offset-2 shadow-sm"
                        >
                            <span
                                aria-hidden
                                className="inline-flex h-2 w-2 rounded-full bg-burnt transition-transform duration-300 group-hover:scale-125"
                            />
                            <span>{CTA_LABEL}</span>
                        </Link>
                    </div>

                    <button
                        className="lg:hidden flex h-[44px] w-[44px] items-center justify-center rounded-[12px] border border-charcoal/15 text-charcoal transition-colors duration-200 hover:border-charcoal/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose"
                        onClick={() => setMobileMenuOpen((prev) => !prev)}
                        aria-label="Toggle menu"
                        aria-expanded={mobileMenuOpen}
                    >
                        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                {mobileMenuOpen && (
                    <div className="lg:hidden border-t border-charcoal/10 pb-6">
                        <div className="space-y-1 pt-4">
                            {NAV_ITEMS.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={cn(
                                            "block px-2 py-4 text-sm font-semibold uppercase tracking-[0.3em]",
                                            isActive ? "text-charcoal" : "text-charcoal/80",
                                        )}
                                    >
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </div>

                        <div className="pt-6">
                            <Link
                                href="/book"
                                className="flex w-full items-center justify-center rounded-[12px] bg-sage-concrete py-4 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-sage-concrete/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose shadow-sm"
                            >
                                {CTA_LABEL}
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
