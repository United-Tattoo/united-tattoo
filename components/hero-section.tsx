"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"

import { useFeatureFlag } from "@/components/feature-flags-provider"
import { Button } from "@/components/ui/button"
import { useMultiLayerParallax, useReducedMotion } from "@/hooks/use-parallax"
import { cn } from "@/lib/utils"

export function HeroSection() {
    const [isVisible, setIsVisible] = useState(false)
    const advancedNavAnimations = useFeatureFlag("ADVANCED_NAV_SCROLL_ANIMATIONS_ENABLED")
    const reducedMotion = useReducedMotion()

    const parallax = useMultiLayerParallax(!advancedNavAnimations || reducedMotion)

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 240)
        return () => clearTimeout(timer)
    }, [])

    return (
        <section
            id="home"
            className="relative flex min-h-[100vh] items-center justify-center overflow-hidden px-6 pb-24 pt-22 sm:px-10 lg:pt-34"
            data-reduced-motion={reducedMotion}
        >
            <div
                ref={parallax.background.ref}
                className="pointer-events-none absolute inset-0 will-change-transform"
                style={{
                    backgroundImage:
                        "image-set(url('/assets/liberty/hero-statue-collage.avif') type('image/avif'), url('/assets/liberty/hero-statue-collage.webp') type('image/webp'))",
                    backgroundPosition: "center top",
                    backgroundSize: "cover",
                    mixBlendMode: "soft-light",
                    opacity: 0.35,
                    ...parallax.background.style,
                }}
                aria-hidden="true"
            />

            <div
                ref={parallax.midground.ref}
                className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.14),transparent_52%),linear-gradient(115deg,rgba(18,14,12,0.86)_18%,rgba(18,14,12,0.62)_48%,rgba(18,14,12,0)_100%)] will-change-transform"
                style={parallax.midground.style}
                aria-hidden="true"
            />

            <div
                ref={parallax.foreground.ref}
                className="relative z-10 w-full will-change-transform"
                style={parallax.foreground.style}
            >
                <div className="mx-auto flex max-w-6xl flex-col gap-14 lg:grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.1fr)] lg:items-center">
                    <div
                        className={cn(
                            "relative space-y-8 text-left text-white transition-all duration-1000",
                            isVisible ? "opacity-100 translate-y-0" : "translate-y-8 opacity-0"
                        )}
                    >
                        <div className="space-y-6">
                            <h1 className="font-playfair text-5xl leading-[1.05] tracking-tight sm:text-6xl lg:text-[5.5rem]">
                                UNITED
                            </h1>
                            <p className="max-w-xl text-lg leading-relaxed text-white/75 sm:text-xl">
                                Tattoos by artists who know what they're doing.  Custom tattoos, flash & cover-ups.
                            </p>
                        </div>

                        <div className="flex flex-col gap-4 pt-6 md:flex-row md:items-center">
                            <Button
                                asChild
                                className="w-full bg-white px-8 py-4 text-sm font-semibold uppercase tracking-wide text-black transition-colors hover:bg-white/90 md:w-auto"
                            >
                                <Link href="/book">Book Your Session</Link>
                            </Button>
                        </div>
                    </div>

                    <div className="relative mx-auto flex w-full max-w-[520px] justify-center lg:justify-end">
                        <div className="relative aspect-[4/5] w-full">
                            <div className="absolute -inset-6 rounded-[32px] border border-white/12 bg-white/10 backdrop-blur-[2px]" aria-hidden="true" />
                            <div className="absolute -inset-x-10 -top-10 h-[140px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.08),transparent_65%)]" aria-hidden="true" />
                            <div className="absolute -right-10 top-16 hidden h-36 w-36 rounded-full border border-white/10 backdrop-blur-sm lg:block" aria-hidden="true">
                                <div className="absolute inset-3 rounded-full border border-white/10" />
                            </div>

                            <figure
                                className={cn(
                                    "relative h-full w-full overflow-hidden rounded-[28px] border border-white/14 bg-black/40",
                                    isVisible ? "shadow-[0_45px_90px_-40px_rgba(0,0,0,0.9)]" : ""
                                )}
                            >
                                <Image
                                    src="/assets/liberty/hero-statue-collage.webp"
                                    alt="Sculptural collage with the Statue of Liberty and tattoo studio elements"
                                    fill
                                    sizes="(min-width: 1024px) 520px, 90vw"
                                    priority
                                    className="object-cover object-center"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0907]/70 via-transparent to-transparent" />
                            </figure>

                            <div className="absolute -bottom-10 left-[-18%] hidden w-[220px] border border-white/12 bg-white/8 p-4 backdrop-blur-md lg:block">
                                <p className="text-sm font-semibold text-white">United Tattoo</p>
                                <p className="mt-2 text-xs leading-relaxed text-white/50">
                                    Fountain, Colorado
                                </p>
                            </div>

                            <figure className="absolute -top-10 left-[-15%] hidden w-40 rotate-[-6deg] overflow-hidden rounded-3xl border border-white/15 bg-white/10 shadow-[0_35px_60px_-30px_rgba(0,0,0,0.7)] backdrop-blur md:block">
                                <Image
                                    src="/assets/liberty/dove-tableau-close.webp"
                                    alt="Still life of studio textures with a dove"
                                    width={320}
                                    height={420}
                                    className="h-full w-full object-cover"
                                    loading="lazy"
                                />
                            </figure>

                            <figure className="absolute -right-16 bottom-16 hidden w-32 rotate-[5deg] overflow-hidden rounded-3xl border border-white/15 bg-white/10 shadow-[0_25px_45px_-25px_rgba(0,0,0,0.7)] backdrop-blur sm:block">
                                <Image
                                    src="/assets/liberty/palette-brush-liberty.webp"
                                    alt="Color palette with statue illustration"
                                    width={260}
                                    height={320}
                                    className="h-full w-full object-cover"
                                    loading="lazy"
                                />
                            </figure>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
