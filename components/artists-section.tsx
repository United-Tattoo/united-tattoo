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

const GRID_SIZE = 16
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
        return 0
      }
      return next
    })
  }, [regenerateSets])

  useEffect(() => {
    if (gridSets.length === 0) {
      return
    }

    const interval = window.setInterval(() => {
      advanceSet()
    }, GRID_INTERVAL)

    return () => window.clearInterval(interval)
  }, [advanceSet, gridSets.length])

  const displayIndices = useMemo(() => {
    const indices = new Set<number>()
    indices.add(activeSetIndex)
    if (previousSetIndex !== null && previousSetIndex !== activeSetIndex) {
      indices.add(previousSetIndex)
    }
    return Array.from(indices)
  }, [activeSetIndex, previousSetIndex])

  const getArtistImage = (artist: PublicArtist) => {
    const candidate = (artist as any).faceImage || artist.workImages?.[0]
    if (candidate) {
      return candidate
    }
    return "/placeholder.svg"
  }

  return (
    <section id="artists" className="relative isolate overflow-hidden pb-24 pt-24">
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

      <div className="relative mx-auto flex max-w-6xl flex-col gap-16 px-6 lg:px-10 xl:flex-row">
        <div className="flex-1 space-y-10 text-white">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.55em] text-white/55">
              <span className="h-px w-8 bg-white/35" /> Resident & Guest Artists
            </span>
            <h2 className="font-playfair text-4xl leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.6rem]">
              A Collective of Story-Driven Tattoo Artists
            </h2>
            <p className="max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
              United Tattoo is home to cover-up virtuosos, illustrative explorers, anime specialists, and fine line minimalists.
              Every artist curates their chair with intention—offering custom narratives, flash experiments, and collaborative pieces
              that evolve with you.
            </p>
          </div>

          <div className="grid gap-5 text-xs uppercase tracking-[0.32em] text-white/60 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-[rgba(255,255,255,0.05)] p-6">
              <p className="text-[0.65rem] font-semibold text-white/55">What to Expect</p>
              <p className="mt-3 text-sm tracking-[0.28em] text-white">Consultation-first Process</p>
              <p className="mt-3 text-[0.68rem] leading-relaxed tracking-[0.26em] text-white/45">
                Artist pairing • Mood-boards • Aftercare guides • CalDAV-synced scheduling
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-[rgba(255,255,255,0.04)] p-6">
              <p className="text-[0.65rem] font-semibold text-white/55">Specialties</p>
              <p className="mt-3 text-sm tracking-[0.28em] text-white">Layered Stylescapes</p>
              <p className="mt-3 text-[0.68rem] leading-relaxed tracking-[0.26em] text-white/45">
                Black & grey realism • Neo-traditional color • Bold cover-ups • Fine line botanicals
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-6 pt-2 sm:flex-row sm:items-center">
            <Button
              asChild
              className="group relative w-full overflow-hidden rounded-full bg-white/90 px-8 py-4 text-xs font-semibold uppercase tracking-[0.38em] text-[#1c1713] transition-all duration-300 hover:bg-white sm:w-auto"
            >
              <Link href="/book">
                Reserve with an Artist
                <span className="ml-3 inline-flex h-[1px] w-6 bg-[#1c1713] transition-all duration-300 group-hover:w-10" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              asChild
              className="w-full justify-start rounded-full border border-white/15 bg-white/5 px-6 py-4 text-xs font-semibold uppercase tracking-[0.32em] text-white/80 backdrop-blur sm:w-auto"
            >
              <Link href="/artists">View full roster</Link>
            </Button>
          </div>
        </div>

        <div className="relative flex-1">
          <div className="relative overflow-hidden rounded-[36px] border border-white/12 bg-[rgba(12,10,8,0.82)] p-6 shadow-[0_45px_90px_-35px_rgba(0,0,0,0.75)]">
            <div className="pointer-events-none absolute inset-0 rounded-[36px] border border-white/[0.05]" aria-hidden="true" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.12),transparent_55%)]" aria-hidden="true" />

            <div className="relative min-h-[520px]">
              {displayIndices.map((index) => {
                const set = gridSets[index]
                if (!set) {
                  return null
                }
                const isActive = index === activeSetIndex

                return (
                  <div
                    key={set.key}
                    className={cn(
                      "absolute inset-0 grid grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:grid-cols-4",
                      "transition-opacity duration-[1300ms] ease-out",
                      isActive ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
                    )}
                  >
                    {set.items.map((artist) => {
                      const href = `/artists/${artist.slug}`
                      const image = getArtistImage(artist)
                      return (
                        <Link
                          key={`${set.key}-${artist.id}-${artist.slug}`}
                          href={href}
                          className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/12 bg-white/[0.06] p-3 text-left transition-all duration-500 hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.1]"
                        >
                          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                            <img
                              src={image}
                              alt={`${artist.name} portfolio sample`}
                              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0907] via-transparent to-transparent" />
                            <div className="absolute right-4 top-4 h-10 w-10 rounded-full border border-white/20 bg-white/10 backdrop-blur">
                              <span className="absolute inset-2 rounded-full border border-white/15" />
                            </div>
                          </div>
                          <div className="mt-4 space-y-1">
                            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-white">
                              {artist.name}
                            </p>
                            <p className="text-[0.65rem] uppercase tracking-[0.32em] text-white/55">
                              {(artist as any).specialty || "Tattoo Artist"}
                            </p>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-24 flex flex-col items-center gap-6 px-6 text-center text-white lg:px-10">
        <p className="uppercase tracking-[0.4em] text-white/45">Let's Plan Your Piece</p>
        <h3 className="font-playfair text-3xl leading-tight sm:text-4xl">
          Choose your artist, share your story, and build a tattoo ritual around intentional ink.
        </h3>
        <Button
          asChild
          className="rounded-full border border-white/20 bg-white text-sm font-semibold uppercase tracking-[0.32em] text-[#1c1713] shadow-[0_30px_60px_-35px_rgba(255,255,255,0.65)] transition-transform duration-300 hover:scale-[1.03]"
        >
          <Link href="/book" className="px-10 py-4">
            Start A Consultation
          </Link>
        </Button>
      </div>
    </section>
  )
}
