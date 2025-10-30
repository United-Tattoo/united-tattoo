"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { artists as staticArtists } from "@/data/artists"
import { useActiveArtists } from "@/hooks/use-artists"
import type { PublicArtist } from "@/types/database"
import { cn } from "@/lib/utils"

type ArtistGridSet = {
  key: string
  items: PublicArtist[]
}

const GRID_SIZE = 8
const GRID_INTERVAL = 12000

export function ArtistsSection() {
  const { data: dbArtistsData, isLoading, error } = useActiveArtists()

  const artists = useMemo(() => {
    if (isLoading || error || !dbArtistsData) {
      return staticArtists
    }

    return staticArtists.map((staticArtist) => {
      const dbArtist = dbArtistsData.artists.find(
        (db) => db.slug === staticArtist.slug || db.name === staticArtist.name
      )

      if (dbArtist && dbArtist.portfolioImages.length > 0) {
        return {
          ...staticArtist,
          workImages: dbArtist.portfolioImages.map((img) => img.url),
        }
      }

      return staticArtist
    })
  }, [dbArtistsData, error, isLoading])

  const artistsRef = useRef(artists)
  const gridSetsRef = useRef<ArtistGridSet[]>([])
  const activeSetRef = useRef(0)

  const [gridSets, setGridSets] = useState<ArtistGridSet[]>([])
  const [activeSetIndex, setActiveSetIndex] = useState(0)
  const [previousSetIndex, setPreviousSetIndex] = useState<number | null>(null)
  const [centerIndex, setCenterIndex] = useState(0)

  artistsRef.current = artists
  gridSetsRef.current = gridSets
  activeSetRef.current = activeSetIndex

  const shuffleArtists = useCallback((input: PublicArtist[]) => {
    const array = [...input]
    for (let i = array.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
  }, [])

  const ensureGridCount = useCallback(
    (pool: PublicArtist[], chunk: PublicArtist[]) => {
      if (chunk.length >= GRID_SIZE) {
        return chunk.slice(0, GRID_SIZE)
      }
      const topUpSource = shuffleArtists(pool)
      const needed = GRID_SIZE - chunk.length
      return [...chunk, ...topUpSource.slice(0, needed)]
    },
    [shuffleArtists]
  )

  const createKey = () => Math.random().toString(36).slice(2)

  const regenerateSets = useCallback(() => {
    const pool = artistsRef.current
    if (pool.length === 0) {
      setGridSets([])
      setActiveSetIndex(0)
      setPreviousSetIndex(null)
      return
    }

    const shuffled = shuffleArtists(pool)
    const batches: ArtistGridSet[] = []

    for (let i = 0; i < shuffled.length; i += GRID_SIZE) {
      const slice = ensureGridCount(pool, shuffled.slice(i, i + GRID_SIZE))
      batches.push({ key: `${createKey()}-${i}`, items: slice })
    }

    if (batches.length === 1) {
      const alternate = ensureGridCount(pool, shuffleArtists(pool))
      batches.push({ key: `${createKey()}-alt`, items: alternate })
    }

    setGridSets(batches)
    setActiveSetIndex(0)
    setPreviousSetIndex(null)
  }, [ensureGridCount, shuffleArtists])

  useEffect(() => {
    regenerateSets()
  }, [artists, regenerateSets])

  const advanceSet = useCallback(() => {
    if (gridSetsRef.current.length === 0) {
      return
    }

    setPreviousSetIndex(activeSetRef.current)
    setActiveSetIndex((prev) => {
      const next = prev + 1
      if (next >= gridSetsRef.current.length) {
        regenerateSets()
        setCenterIndex(0)
        return 0
      }
      setCenterIndex(0)
      return next
    })
  }, [regenerateSets])

  const rotateCarousel = useCallback((direction: 'next' | 'prev') => {
    if (gridSetsRef.current.length === 0) return

    const currentSet = gridSetsRef.current[activeSetRef.current]
    if (!currentSet) return

    setCenterIndex((prev) => {
      const nextIndex = direction === 'next'
        ? (prev + 1) % currentSet.items.length
        : (prev - 1 + currentSet.items.length) % currentSet.items.length

      // If we've looped back to start on 'next', advance to next set
      if (direction === 'next' && nextIndex === 0 && prev === currentSet.items.length - 1) {
        setTimeout(() => advanceSet(), 0)
      }

      return nextIndex
    })
  }, [advanceSet])

  useEffect(() => {
    if (gridSets.length === 0) {
      return
    }

    const interval = window.setInterval(() => {
      rotateCarousel('next')
    }, GRID_INTERVAL)

    return () => window.clearInterval(interval)
  }, [rotateCarousel, gridSets.length])

  const displayIndices = useMemo(() => {
    const indices = new Set<number>()
    indices.add(activeSetIndex)
    if (previousSetIndex !== null && previousSetIndex !== activeSetIndex) {
      indices.add(previousSetIndex)
    }
    return Array.from(indices)
  }, [activeSetIndex, previousSetIndex])

  const getArtistImage = (artist: PublicArtist) => {
    // Try faceImage from static data first
    if ((artist as any).faceImage) {
      return (artist as any).faceImage
    }
    // Fall back to first work image
    if (artist.workImages && artist.workImages.length > 0) {
      return artist.workImages[0]
    }
    // Final fallback
    return "/placeholder.svg"
  }

  return (
    <section id="artists" className="relative isolate overflow-hidden pb-32 pt-32 lg:pb-40 lg:pt-40">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(14,11,9,0)_0%,rgba(14,11,9,0.85)_20%,rgba(14,11,9,0.92)_55%,rgba(14,11,9,0.98)_100%)]" />
        <div
          className="absolute -left-16 top-[8%] h-[480px] w-[420px] rotate-[-8deg] rounded-[36px] opacity-40 blur-[1px]"
          style={{
            backgroundImage:
              "image-set(url('/assets/liberty/mural-portrait-sun.avif') type('image/avif'), url('/assets/liberty/mural-portrait-sun.webp') type('image/webp'))",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          className="absolute -right-24 top-[35%] hidden h-[540px] w-[420px] rotate-[6deg] rounded-[36px] opacity-30 lg:block"
          style={{
            backgroundImage:
              "image-set(url('/assets/liberty/mural-orange-wall.avif') type('image/avif'), url('/assets/liberty/mural-orange-wall.webp') type('image/webp'))",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.08),transparent_55%)]" />
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col gap-16 px-6 lg:px-10 xl:flex-row">
        <div className="xl:w-[40%] space-y-10 text-white">
          <div className="space-y-8">
            <span className="inline-flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.55em] text-white/55">
              <span className="h-px w-8 bg-white/35" /> Resident & Guest Artists
            </span>
            <h2 className="font-playfair text-4xl leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.6rem]">
              Artists Who Know What They're Doing
            </h2>
            <p className="max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
              Cover-up specialists, illustrative work, anime, and fine line. Each artist brings years of experience and their own style.
              Custom work and flash drops.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button
              asChild
              className="w-full bg-white px-8 py-4 text-sm font-semibold uppercase tracking-wide text-black transition-colors hover:bg-white/90 sm:w-auto"
            >
              <Link href="/book">Book Your Session</Link>
            </Button>
            <Button
              variant="ghost"
              asChild
              className="w-full justify-start border border-white/20 bg-white/5 px-6 py-4 text-sm font-medium uppercase tracking-wide text-white/80 backdrop-blur hover:bg-white/10 sm:w-auto"
            >
              <Link href="/artists">View All Artists</Link>
            </Button>
          </div>
        </div>

        <div className="relative xl:w-[60%]">
            <div className="relative h-[500px] sm:h-[550px] lg:h-[600px] flex items-center justify-center">
              {gridSets[activeSetIndex] && (
                <div className="relative w-full h-full flex items-center justify-center">
                  {gridSets[activeSetIndex].items.map((artist, index) => {
                    const href = `/artists/${artist.slug}`
                    const image = getArtistImage(artist)

                    // Calculate position relative to center with wrapping for infinite loop
                    let positionFromCenter = index - centerIndex
                    const totalCards = gridSets[activeSetIndex].items.length

                    // Wrap around for continuous loop effect
                    if (positionFromCenter < -2) {
                      positionFromCenter += totalCards
                    } else if (positionFromCenter > totalCards / 2) {
                      positionFromCenter -= totalCards
                    }

                    // Only show center + 2 behind on each side
                    const isVisible = Math.abs(positionFromCenter) <= 2

                    // Calculate transforms for stacked deck effect
                    const isCenterCard = positionFromCenter === 0

                    // Cards stack behind based on position
                    let translateY = 0
                    let translateX = 0
                    let scale = 1
                    let opacity = 1
                    let zIndex = 10

                    if (positionFromCenter > 0) {
                      // Cards to the right (future cards) - stack behind on right
                      translateY = positionFromCenter * 20
                      translateX = positionFromCenter * 40
                      scale = 1 - positionFromCenter * 0.08
                      opacity = Math.max(0, 1 - positionFromCenter * 0.4)
                      zIndex = 10 - positionFromCenter
                    } else if (positionFromCenter < 0) {
                      // Cards to the left (past cards) - slide out to left and fade
                      translateX = positionFromCenter * 150
                      opacity = Math.max(0, 1 + positionFromCenter * 0.5)
                      zIndex = 10 + positionFromCenter
                    }

                    if (!isVisible) return null

                    return (
                      <Link
                        key={`${artist.id}-${artist.slug}-${index}`}
                        href={href}
                        className="group absolute aspect-[3/4] w-[280px] sm:w-[320px] lg:w-[380px] overflow-hidden rounded-2xl border border-white/12 text-left transition-all duration-700 ease-out hover:border-white/25"
                        style={{
                          transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
                          opacity,
                          zIndex,
                          pointerEvents: isCenterCard ? 'auto' : 'none',
                        }}
                      >
                        <img
                          src={image}
                          alt={`${artist.name} portfolio sample`}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0907] via-transparent to-transparent" />
                        <div className="absolute right-5 top-5 h-12 w-12 rounded-full border border-white/20 bg-white/10 backdrop-blur">
                          <span className="absolute inset-2 rounded-full border border-white/15" />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2">
                          <p className="text-lg font-semibold uppercase tracking-wider text-white">
                            {artist.name}
                          </p>
                          <p className="text-sm uppercase tracking-wide text-white/60">
                            {(artist as any).specialty || "Tattoo Artist"}
                          </p>
                        </div>
                      </Link>
                    )
                  })}

                  {/* Navigation buttons */}
                  <button
                    onClick={() => rotateCarousel('prev')}
                    className="absolute left-0 z-20 p-3 text-white/60 transition-colors hover:text-white"
                    aria-label="Previous artist"
                  >
                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => rotateCarousel('next')}
                    className="absolute right-0 z-20 p-3 text-white/60 transition-colors hover:text-white"
                    aria-label="Next artist"
                  >
                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
        </div>
      </div>
    </section>
  )
}
