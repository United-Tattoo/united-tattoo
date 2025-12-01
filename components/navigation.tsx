"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [mobileMenuOpen]);

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    const navLinkClass = (isActive: boolean) =>
        cn(
            "font-grotesk text-xs font-medium uppercase tracking-widest text-[#1c1915] transition-colors duration-300 hover:text-[#b0471e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e59863] focus-visible:ring-offset-4 rounded-sm",
            isActive && "text-[#b0471e] font-semibold"
        );

    return (
        <nav
            className={cn(
                "fixed inset-x-0 top-0 z-[100] border-b transition-all duration-500",
                isScrolled
                    ? "bg-[#f2e3d0]/95 border-[#1c1915]/10 backdrop-blur-md shadow-sm"
                    : "bg-transparent border-transparent",
                mobileMenuOpen && "bg-[#f2e3d0]"
            )}
        >
            <div className="max-w-[1600px] mx-auto px-[clamp(1.5rem,4vw,5rem)]">
                <div className={cn(
                    "flex items-center justify-between transition-all duration-500",
                    isScrolled ? "h-16" : "h-20"
                )}>
                    {/* Logo */}
                    <Link href="/" className="group relative z-[110]">
                        <div className="flex flex-col text-left">
                            <span className={cn(
                                "font-playfair font-semibold leading-none tracking-tight text-[#1c1915] transition-all duration-500 group-hover:opacity-70",
                                isScrolled ? "text-lg lg:text-xl" : "text-xl lg:text-2xl"
                            )}>
                                United Tattoo
                            </span>
                            <span className={cn(
                                "font-grotesk text-[0.65rem] font-medium uppercase tracking-[0.2em] text-[#1c1915]/70 mt-1 hidden sm:block group-hover:text-[#b0471e] transition-all duration-500",
                                isScrolled && "opacity-0 h-0 mt-0"
                            )}>
                                Gallery &amp; Studio • Fountain, CO
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex flex-1 justify-center">
                        <ShadNavigationMenu className="bg-transparent" viewport={false}>
                            <NavigationMenuList className="gap-10">
                                {NAV_ITEMS.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <NavigationMenuItem key={item.name}>
                                            <NavigationMenuLink asChild>
                                                <Link href={item.href} className={navLinkClass(isActive)}>
                                                    {item.name}
                                                </Link>
                                            </NavigationMenuLink>
                                        </NavigationMenuItem>
                                    );
                                })}
                            </NavigationMenuList>
                        </ShadNavigationMenu>
                    </div>

                    {/* Desktop CTA */}
                    <div className="hidden lg:flex items-center justify-end">
                        <Link
                            href="/book"
                            className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#b0471e] px-8 text-xs font-semibold uppercase tracking-widest text-white transition-all duration-200 hover:bg-[#b0471e]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e59863] focus-visible:ring-offset-2"
                        >
                            <span>{CTA_LABEL}</span>
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="lg:hidden relative z-[110] flex h-11 w-11 items-center justify-center rounded-full bg-[#1c1915] text-white transition-colors duration-200 hover:bg-[#1c1915]/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b0471e]"
                        onClick={() => setMobileMenuOpen((prev) => !prev)}
                        aria-label="Toggle menu"
                        aria-expanded={mobileMenuOpen}
                    >
                        <AnimatePresence mode="wait">
                            {mobileMenuOpen ? (
                                <motion.div
                                    key="close"
                                    initial={{ opacity: 0, rotate: -90 }}
                                    animate={{ opacity: 1, rotate: 0 }}
                                    exit={{ opacity: 0, rotate: 90 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <X size={20} />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="menu"
                                    initial={{ opacity: 0, rotate: 90 }}
                                    animate={{ opacity: 1, rotate: 0 }}
                                    exit={{ opacity: 0, rotate: -90 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Menu size={20} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-[105] flex flex-col bg-[#f2e3d0] pt-32 lg:hidden overflow-y-auto"
                    >
                        <div className="flex flex-col px-[clamp(1.5rem,4vw,5rem)] min-h-full pb-24">
                            <div className="flex flex-col gap-8">
                                {NAV_ITEMS.map((item, index) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <motion.div
                                            key={item.name}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 + 0.1, duration: 0.4 }}
                                        >
                                            <Link
                                                href={item.href}
                                                className={cn(
                                                    "block font-playfair text-5xl font-normal text-[#1c1915] transition-all duration-300 hover:text-[#b0471e] hover:translate-x-2",
                                                    isActive && "text-[#b0471e]"
                                                )}
                                            >
                                                {item.name}
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="mt-auto pt-12"
                            >
                                <Link href="/book" className="block w-full mb-8">
                                    <button className="w-full h-14 rounded-2xl bg-[#b0471e] text-white font-grotesk text-base uppercase tracking-widest transition-colors duration-200 hover:bg-[#b0471e]/90">
                                        {CTA_LABEL} Now
                                    </button>
                                </Link>

                                <div className="grid grid-cols-2 gap-6 border-t border-[#1c1915]/10 pt-8">
                                    <div className="flex flex-col gap-2">
                                        <span className="font-grotesk text-xs uppercase tracking-widest text-[#1c1915]/50">Studio</span>
                                        <span className="font-playfair text-[#1c1915] text-sm">Fountain, CO</span>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <span className="font-grotesk text-xs uppercase tracking-widest text-[#1c1915]/50">Contact</span>
                                        <span className="font-playfair text-[#1c1915] text-sm break-all">unitedtattooco@gmail.com</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
