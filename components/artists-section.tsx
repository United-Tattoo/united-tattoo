"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { artists } from "@/data/artists"

export function ArtistsSection() {
  const [visibleCards, setVisibleCards] = useState<number[]>([])
  const [scrollY, setScrollY] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const leftColumnRef = useRef<HTMLDivElement>(null)
  const centerColumnRef = useRef<HTMLDivElement>(null)
  const rightColumnRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardIndex = Number.parseInt(entry.target.getAttribute("data-index") || "0")
            setVisibleCards((prev) => [...new Set([...prev, cardIndex])])
          }
        })
      },
      { threshold: 0.2, rootMargin: "0px 0px 0px 0px" },
    )

    const cards = sectionRef.current?.querySelectorAll("[data-index]")
    cards?.forEach((card) => observer.observe(card))

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = window.pageYOffset
          setScrollY(scrollTop)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (leftColumnRef.current && centerColumnRef.current && rightColumnRef.current) {
      const sectionTop = sectionRef.current?.offsetTop || 0
      const relativeScroll = scrollY - sectionTop

      leftColumnRef.current.style.transform = `translateY(${relativeScroll * -0.025}px)`
      centerColumnRef.current.style.transform = `translateY(0px)`
      rightColumnRef.current.style.transform = `translateY(${relativeScroll * 0.025}px)`

      const leftImages = leftColumnRef.current.querySelectorAll(".artist-image")
      const centerImages = centerColumnRef.current.querySelectorAll(".artist-image")
      const rightImages = rightColumnRef.current.querySelectorAll(".artist-image")

      leftImages.forEach((img) => {
        ;(img as HTMLElement).style.transform = `translateY(${relativeScroll * -0.01}px)`
      })
      centerImages.forEach((img) => {
        ;(img as HTMLElement).style.transform = `translateY(${relativeScroll * -0.0075}px)`
      })
      rightImages.forEach((img) => {
        ;(img as HTMLElement).style.transform = `translateY(${relativeScroll * -0.005}px)`
      })
    }
  }, [scrollY])

  // Better distribution for visual balance
  const leftColumn = [artists[0], artists[3], artists[6]] // Christy, Donovan, John
  const centerColumn = [artists[1], artists[4], artists[7]] // Angel, EJ, Pako  
  const rightColumn = [artists[2], artists[5], artists[8]] // Amari, Heather, Sole

  return (
    <section ref={sectionRef} id="artists" className="relative overflow-hidden bg-black">
      <div className="absolute inset-0 opacity-[0.03]">
        <img
          src="/united-logo-full.jpg"
          alt=""
          className="w-full h-full object-cover object-center scale-150 blur-[2px]"
        />
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      </div>

      <div className="relative z-10 py-16 px-8 lg:px-16">
        <div className="max-w-screen-2xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12 items-end mb-16">
            <div className="lg:col-span-2">
              <h2 className="text-6xl lg:text-8xl font-bold tracking-tight mb-6 text-white">ARTISTS</h2>
              <p className="text-xl text-gray-200 leading-relaxed max-w-2xl">
                Our exceptional team of tattoo artists, each bringing unique expertise and artistic vision to create your perfect
                tattoo.
              </p>
            </div>
            <div className="text-right">
              <Button
                asChild
                className="bg-white text-black hover:bg-gray-100 px-8 py-4 text-lg font-medium tracking-wide shadow-lg"
              >
                <Link href="/book">BOOK CONSULTATION</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 px-8 lg:px-16 pb-32">
        <div className="max-w-screen-2xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div ref={leftColumnRef} className="space-y-8">
              {leftColumn.map((artist, index) => (
                <div
                  key={artist.id}
                  data-index={artists.indexOf(artist)}
                  className={`group transition-all duration-700 ${
                    visibleCards.includes(artists.indexOf(artist))
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                  style={{
                    transitionDelay: `${artists.indexOf(artist) * 50}ms`,
                  }}
                >
                  <div className="relative w-full aspect-[4/5] overflow-hidden rounded-lg shadow-2xl">
                    <div className="absolute inset-0 bg-black artist-image">
                      {/* Portfolio background - full width */}
                      <div className="absolute inset-0">
                        <img
                          src={artist.workImages?.[0] || "/placeholder.svg"}
                          alt={`${artist.name} tattoo work`}
                          className="w-full h-full object-cover scale-110"
                        />
                        {/* Darkening overlay to push background further back */}
                        <div className="absolute inset-0 bg-black/40"></div>
                      </div>

                      {/* Artist portrait - with proper feathered mask */}
                      <div className="absolute left-0 top-0 w-3/5 h-full">
                        <img
                          src={artist.faceImage || "/placeholder.svg"}
                          alt={`${artist.name} portrait`}
                          className="w-full h-full object-cover scale-110"
                          style={{
                            maskImage: 'linear-gradient(to right, black 0%, black 70%, transparent 100%)',
                            WebkitMaskImage: 'linear-gradient(to right, black 0%, black 70%, transparent 100%)'
                          }}
                        />
                      </div>
                    </div>

                    <div className="absolute inset-0 z-20 group-hover:bg-black/20 transition-all duration-500">
                      <div className="absolute top-4 left-4">
                        <span className="text-xs font-medium tracking-widest text-white uppercase bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full">
                          {artist.experience}
                        </span>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6 translate-y-0 lg:translate-y-full lg:group-hover:translate-y-0 transition-transform duration-500">
                        <h3 className="text-2xl font-bold tracking-tight mb-2 text-white">{artist.name}</h3>
                        <p className="text-sm font-medium text-white/90 mb-3">{artist.specialty}</p>
                        <p className="text-sm text-white/80 mb-4 leading-relaxed">{artist.bio}</p>

                        <div className="flex gap-2">
                          <Button
                            asChild
                            size="sm"
                            className="bg-white text-black hover:bg-gray-100 text-xs font-medium tracking-wide flex-1"
                          >
                            <Link href={`/artists/${artist.id}`}>PORTFOLIO</Link>
                          </Button>
                          <Button
                            asChild
                            size="sm"
                            className="bg-white text-black hover:bg-gray-100 text-xs font-medium tracking-wide flex-1"
                          >
                            <Link href="/book">BOOK</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div ref={centerColumnRef} className="space-y-8">
              {centerColumn.map((artist, index) => (
                <div
                  key={artist.id}
                  data-index={artists.indexOf(artist)}
                  className={`group transition-all duration-700 ${
                    visibleCards.includes(artists.indexOf(artist))
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                  style={{
                    transitionDelay: `${artists.indexOf(artist) * 50}ms`,
                  }}
                >
                  <div className="relative w-full aspect-[4/5] overflow-hidden rounded-lg shadow-2xl">
                    <div className="absolute inset-0 bg-black artist-image">
                      {/* Portfolio background - full width */}
                      <div className="absolute inset-0">
                        <img
                          src={artist.workImages?.[0] || "/placeholder.svg"}
                          alt={`${artist.name} tattoo work`}
                          className="w-full h-full object-cover scale-110"
                        />
                        {/* Darkening overlay to push background further back */}
                        <div className="absolute inset-0 bg-black/40"></div>
                      </div>

                      {/* Artist portrait - with proper feathered mask */}
                      <div className="absolute left-0 top-0 w-3/5 h-full">
                        <img
                          src={artist.faceImage || "/placeholder.svg"}
                          alt={`${artist.name} portrait`}
                          className="w-full h-full object-cover scale-110"
                          style={{
                            maskImage: 'linear-gradient(to right, black 0%, black 70%, transparent 100%)',
                            WebkitMaskImage: 'linear-gradient(to right, black 0%, black 70%, transparent 100%)'
                          }}
                        />
                      </div>
                    </div>

                    <div className="absolute inset-0 z-20 group-hover:bg-black/20 transition-all duration-500">
                      <div className="absolute top-4 left-4">
                        <span className="text-xs font-medium tracking-widest text-white uppercase bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full">
                          {artist.experience}
                        </span>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6 translate-y-0 lg:translate-y-full lg:group-hover:translate-y-0 transition-transform duration-500">
                        <h3 className="text-2xl font-bold tracking-tight mb-2 text-white">{artist.name}</h3>
                        <p className="text-sm font-medium text-white/90 mb-3">{artist.specialty}</p>
                        <p className="text-sm text-white/80 mb-4 leading-relaxed">{artist.bio}</p>

                        <div className="flex gap-2">
                          <Button
                            asChild
                            size="sm"
                            className="bg-white text-black hover:bg-gray-100 text-xs font-medium tracking-wide flex-1"
                          >
                            <Link href={`/artists/${artist.id}`}>PORTFOLIO</Link>
                          </Button>
                          <Button
                            asChild
                            size="sm"
                            className="bg-white text-black hover:bg-gray-100 text-xs font-medium tracking-wide flex-1"
                          >
                            <Link href="/book">BOOK</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div ref={rightColumnRef} className="space-y-8">
              {rightColumn.map((artist, index) => (
                <div
                  key={artist.id}
                  data-index={artists.indexOf(artist)}
                  className={`group transition-all duration-700 ${
                    visibleCards.includes(artists.indexOf(artist))
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                  style={{
                    transitionDelay: `${artists.indexOf(artist) * 50}ms`,
                  }}
                >
                  <div className="relative w-full aspect-[4/5] overflow-hidden rounded-lg shadow-2xl">
                    <div className="absolute inset-0 bg-black artist-image">
                      {/* Portfolio background - full width */}
                      <div className="absolute inset-0">
                        <img
                          src={artist.workImages?.[0] || "/placeholder.svg"}
                          alt={`${artist.name} tattoo work`}
                          className="w-full h-full object-cover scale-110"
                        />
                        {/* Darkening overlay to push background further back */}
                        <div className="absolute inset-0 bg-black/40"></div>
                      </div>

                      {/* Artist portrait - with proper feathered mask */}
                      <div className="absolute left-0 top-0 w-3/5 h-full">
                        <img
                          src={artist.faceImage || "/placeholder.svg"}
                          alt={`${artist.name} portrait`}
                          className="w-full h-full object-cover scale-110"
                          style={{
                            maskImage: 'linear-gradient(to right, black 0%, black 70%, transparent 100%)',
                            WebkitMaskImage: 'linear-gradient(to right, black 0%, black 70%, transparent 100%)'
                          }}
                        />
                      </div>
                    </div>

                    <div className="absolute inset-0 z-20 group-hover:bg-black/20 transition-all duration-500">
                      <div className="absolute top-4 left-4">
                        <span className="text-xs font-medium tracking-widest text-white uppercase bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full">
                          {artist.experience}
                        </span>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6 translate-y-0 lg:translate-y-full lg:group-hover:translate-y-0 transition-transform duration-500">
                        <h3 className="text-2xl font-bold tracking-tight mb-2 text-white">{artist.name}</h3>
                        <p className="text-sm font-medium text-white/90 mb-3">{artist.specialty}</p>
                        <p className="text-sm text-white/80 mb-4 leading-relaxed">{artist.bio}</p>

                        <div className="flex gap-2">
                          <Button
                            asChild
                            size="sm"
                            className="bg-white text-black hover:bg-gray-100 text-xs font-medium tracking-wide flex-1"
                          >
                            <Link href={`/artists/${artist.id}`}>PORTFOLIO</Link>
                          </Button>
                          <Button
                            asChild
                            size="sm"
                            className="bg-white text-black hover:bg-gray-100 text-xs font-medium tracking-wide flex-1"
                          >
                            <Link href="/book">BOOK</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-20 bg-black text-white py-20 px-8 lg:px-16">
        <div className="max-w-screen-2xl mx-auto text-center">
          <h3 className="text-5xl lg:text-7xl font-bold tracking-tight mb-8">READY?</h3>
          <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto">
            Choose your artist and start your tattoo journey with United Tattoo.
          </p>
          <Button
            asChild
            className="bg-white text-black hover:bg-gray-100 hover:text-black px-12 py-6 text-xl font-medium tracking-wide shadow-lg border border-white"
          >
            <Link href="/book">START NOW</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
