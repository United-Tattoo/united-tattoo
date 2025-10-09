"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"

import { useFeatureFlag } from "@/components/feature-flags-provider"
import { Button } from "@/components/ui/button"
import { artists } from "@/data/artists"

export function ArtistsSection() {
  // Minimal animation: fade-in only (no parallax)
  const [visibleCards, setVisibleCards] = useState<number[]>([])
  const sectionRef = useRef<HTMLElement>(null)
  const advancedNavAnimations = useFeatureFlag("ADVANCED_NAV_SCROLL_ANIMATIONS_ENABLED")
  const allArtistIndices = useMemo(() => Array.from({ length: artists.length }, (_, idx) => idx), [])

  useEffect(() => {
    if (!advancedNavAnimations) {
      setVisibleCards(allArtistIndices)
      return
    }
    setVisibleCards([])
  }, [advancedNavAnimations, allArtistIndices])

  useEffect(() => {
    if (!advancedNavAnimations) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardIndex = Number.parseInt(entry.target.getAttribute("data-index") || "0")
            setVisibleCards((prev) => [...new Set([...prev, cardIndex])])
          }
        })
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" },
    )
    const cards = sectionRef.current?.querySelectorAll("[data-index]")
    cards?.forEach((card) => observer.observe(card))
    return () => observer.disconnect()
  }, [advancedNavAnimations])

  const cardVisibilityClass = (index: number) => {
    if (!advancedNavAnimations) return "opacity-100 translate-y-0"
    return visibleCards.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
  }

  const cardTransitionDelay = (index: number) => {
    if (!advancedNavAnimations) return undefined
    return `${index * 40}ms`
  }

  // Vary aspect ratio to create a subtle masonry rhythm
  const aspectFor = (i: number) => {
    const variants = ["aspect-[3/4]", "aspect-[4/5]", "aspect-square"]
    return variants[i % variants.length]
  }

  return (
    <section ref={sectionRef} id="artists" className="relative overflow-hidden bg-black">
      {/* Faint logo texture */}
      <div className="absolute inset-0 opacity-[0.03]">
        <img
          src="/united-logo-full.jpg"
          alt=""
          className="w-full h-full object-cover object-center scale-150 blur-[2px]"
        />
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      </div>

      {/* Header */}
      <div className="relative z-10 py-14 px-6 lg:px-10">
        <div className="max-w-[1800px] mx-auto">
          <div className="grid lg:grid-cols-3 gap-10 items-end mb-10">
            <div className="lg:col-span-2">
              <h2 className="text-6xl lg:text-8xl font-bold tracking-tight mb-4 text-white">ARTISTS</h2>
              <p className="text-lg lg:text-xl text-gray-200/90 leading-relaxed max-w-2xl">
                Our exceptional team of tattoo artists, each bringing unique expertise and artistic vision to create your perfect
                tattoo.
              </p>
            </div>
            <div className="text-right">
              <Button
                asChild
                className="bg-white text-black hover:bg-gray-100 px-7 py-3 text-base font-medium tracking-wide shadow-sm rounded-md"
              >
                <Link href="/book">BOOK CONSULTATION</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Masonry grid */}
      <div className="relative z-10 px-6 lg:px-10 pb-24">
        <div className="max-w-[1800px] mx-auto">
          {/* columns-based masonry; tighter spacing and wider section */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 lg:gap-5 [column-fill:_balance]">
            {artists.map((artist, i) => {
              const transitionDelay = cardTransitionDelay(i)
              return (
                <article
                  key={artist.id}
                  data-index={i}
                  className={`group mb-4 break-inside-avoid transition-all duration-700 ${cardVisibilityClass(i)}`}
                  style={transitionDelay ? { transitionDelay } : undefined}
                >
                  <div className={`relative w-full ${aspectFor(i)} overflow-hidden rounded-md border border-white/10 bg-black`}>
                    {/* Imagery */}
                    <div className="absolute inset-0 artist-image">
                      <img
                        src={artist.workImages?.[0] || "/placeholder.svg"}
                        alt={`${artist.name} tattoo work`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/30"></div>

                      {/* Portrait with feathered mask */}
                      <div className="absolute left-0 top-0 w-3/5 h-full pointer-events-none">
                        <img
                          src={artist.faceImage || "/placeholder.svg"}
                          alt={`${artist.name} portrait`}
                          className="w-full h-full object-cover"
                          style={{
                            maskImage: "linear-gradient(to right, black 0%, black 70%, transparent 100%)",
                            WebkitMaskImage: "linear-gradient(to right, black 0%, black 70%, transparent 100%)",
                          }}
                          loading="lazy"
                        />
                      </div>
                    </div>

                    {/* Softer hover wash (replaces heavy overlay) */}
                    <div className="absolute inset-0 z-10 transition-colors duration-300 group-hover:bg-black/10" />

                    {/* Top-left experience pill */}
                    <div className="absolute top-3 left-3 z-20">
                      <span className="text-[10px] font-medium tracking-widest text-white uppercase bg-black/70 backdrop-blur-sm px-2.5 py-0.5 rounded-full">
                        {artist.experience}
                      </span>
                    </div>

                    {/* Minimal footer */}
                    <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4">
                      <h3 className="text-xl font-semibold tracking-tight text-white">{artist.name}</h3>
                      <p className="text-xs font-medium text-white/80 mb-3">{artist.specialty}</p>

                      <div className="flex gap-2">
                        <Button
                          asChild
                          size="sm"
                          className="h-8 rounded-md px-3 bg-white/90 text-black hover:bg-white text-xs font-medium tracking-wide"
                        >
                          <Link href={`/artists/${artist.slug}`}>PORTFOLIO</Link>
                        </Button>
                        <Button
                          asChild
                          size="sm"
                          className="h-8 rounded-md px-3 bg-transparent text-white border border-white/25 hover:bg-white/10 text-xs font-medium tracking-wide"
                        >
                          <Link href={`/book?artist=${artist.slug}`}>BOOK</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </div>

      {/* CTA Footer */}
      <div className="relative z-20 bg-black text-white py-20 px-6 lg:px-10">
        <div className="max-w-[1800px] mx-auto text-center">
          <h3 className="text-5xl lg:text-7xl font-bold tracking-tight mb-8">READY?</h3>
          <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto">
            Choose your artist and start your tattoo journey with United Tattoo.
          </p>
          <Button
            asChild
            className="bg-white text-black hover:bg-gray-100 hover:text-black px-12 py-6 text-xl font-medium tracking-wide shadow-lg border border-white rounded-md"
          >
            <Link href="/book">START NOW</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
