"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Instagram, ExternalLink, Loader2, DollarSign } from "lucide-react"
import { useArtist } from "@/hooks/use-artist-data"
import { useIsMobile } from "@/hooks/use-mobile"
import { type CarouselApi, Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

interface ArtistPortfolioProps {
  artistId: string
}

export function ArtistPortfolio({ artistId }: ArtistPortfolioProps) {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [scrollY, setScrollY] = useState(0)
  const isMobile = useIsMobile()
  // carousel indicator state (mobile)
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null)
  const [carouselCount, setCarouselCount] = useState(0)
  const [carouselCurrent, setCarouselCurrent] = useState(0)
  const [showSwipeHint, setShowSwipeHint] = useState(true)
  const [showFullBio, setShowFullBio] = useState(false)

  // Fetch artist data from API
  const { data: artist, isLoading, error } = useArtist(artistId)

  // keep a reference to the last focused thumbnail so we can return focus on modal close
  const lastFocusedRef = useRef<HTMLElement | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)
  const touchStartX = useRef<number | null>(null)

  useEffect(() => {
    // Enable parallax only on desktop to avoid jank on mobile
    if (isMobile) return
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isMobile])

  // Fade swipe hint after a short delay
  useEffect(() => {
    const t = setTimeout(() => setShowSwipeHint(false), 2500)
    return () => clearTimeout(t)
  }, [])

  // Preserve scroll position when modal opens/closes
  useEffect(() => {
    if (!selectedImage) return
    const y = window.scrollY
    const { body } = document
    body.style.position = "fixed"
    body.style.top = `-${y}px`
    body.style.left = "0"
    body.style.right = "0"
    return () => {
      const top = body.style.top
      body.style.position = ""
      body.style.top = ""
      body.style.left = ""
      body.style.right = ""
      const restoreY = Math.abs(parseInt(top || "0", 10))
      window.scrollTo(0, restoreY)
    }
  }, [selectedImage])

  // Carousel indicators state wiring
  useEffect(() => {
    if (!carouselApi) return
    setCarouselCount(carouselApi.scrollSnapList().length)
    setCarouselCurrent(carouselApi.selectedScrollSnap())
    const onSelect = () => setCarouselCurrent(carouselApi.selectedScrollSnap())
    carouselApi.on("select", onSelect)
    return () => {
      carouselApi.off("select", onSelect)
    }
  }, [carouselApi])

  // Derived lists (safe when `artist` is undefined during initial renders)
  const portfolioImages = artist?.portfolioImages || []
  
  // Get unique categories from tags
  const allTags = portfolioImages.flatMap(img => img.tags)
  const categories = ["All", ...Array.from(new Set(allTags))]
  
  const filteredPortfolio = selectedCategory === "All" 
    ? portfolioImages 
    : portfolioImages.filter(img => img.tags.includes(selectedCategory))

  // keyboard navigation for modal (kept as hooks so they run in same order every render)
  const goToIndex = useCallback(
    (index: number) => {
      const item = filteredPortfolio[index]
      if (item) setSelectedImage(item.id)
    },
    [filteredPortfolio],
  )

  useEffect(() => {
    if (!selectedImage) return

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedImage(null)
      } else if (e.key === "ArrowRight") {
        const currentIndex = filteredPortfolio.findIndex((p) => p.id === selectedImage)
        const nextIndex = (currentIndex + 1) % filteredPortfolio.length
        goToIndex(nextIndex)
      } else if (e.key === "ArrowLeft") {
        const currentIndex = filteredPortfolio.findIndex((p) => p.id === selectedImage)
        const prevIndex = (currentIndex - 1 + filteredPortfolio.length) % filteredPortfolio.length
        goToIndex(prevIndex)
      }
    }

    document.addEventListener("keydown", handleKey)
    // move focus to close button for keyboard users
    setTimeout(() => closeButtonRef.current?.focus(), 0)

    return () => {
      document.removeEventListener("keydown", handleKey)
    }
  }, [selectedImage, filteredPortfolio, goToIndex])

  const openImageFromElement = (id: string, el: HTMLElement | null) => {
    if (el) lastFocusedRef.current = el
    setSelectedImage(id)
  }

  const closeModal = () => {
    setSelectedImage(null)
    // return focus to last focused thumbnail
    setTimeout(() => lastFocusedRef.current?.focus(), 0)
  }

  const currentIndex = selectedImage ? filteredPortfolio.findIndex((p) => p.id === selectedImage) : -1
  const currentItem = selectedImage ? filteredPortfolio.find((p) => p.id === selectedImage) : null

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Failed to load artist</h1>
          <p className="text-gray-400 mb-6">Please try again later</p>
          <Button asChild>
            <Link href="/artists">Back to Artists</Link>
          </Button>
        </div>
      </div>
    )
  }

  // Artist not found
  if (!artist) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Artist not found</h1>
          <Button asChild>
            <Link href="/artists">Back to Artists</Link>
          </Button>
        </div>
      </div>
    )
  }

  // Get profile image
  const profileImage = portfolioImages.find(img => img.tags.includes('profile'))?.url || 
                      portfolioImages[0]?.url || 
                      "/placeholder.svg"
  const bioText = artist.bio || ""

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Removed Back to Artists button per request */}

      {/* Hero Section with Split Screen (Desktop only) */}
      <section className="relative h-screen overflow-hidden -mt-20 hidden md:block">
        {/* Left Side - Artist Image */}
        <div className="absolute left-0 top-0 w-1/2 h-full" style={{ transform: `translateY(${scrollY * 0.3}px)` }}>
          <div className="relative w-full h-full">
            <Image
              src={profileImage}
              alt={artist.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/50" />
            <div className="absolute top-28 left-8">
              <Badge
                variant={artist.isActive ? "default" : "secondary"}
                className="bg-white/20 backdrop-blur-sm text-white border-white/30"
              >
                {artist.isActive ? "Available" : "Unavailable"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Right Side - Artist Info */}
        <div
          className="absolute right-0 top-0 w-1/2 h-full flex items-center"
          style={{ transform: `translateY(${scrollY * -0.2}px)` }}
        >
          <div className="px-16 py-20">
            <div className="mb-8">
              <h1 className="font-playfair text-6xl font-bold mb-4 text-balance leading-tight">{artist.name}</h1>
              <p className="text-2xl text-gray-300 mb-6">{artist.specialties.join(", ")}</p>
            </div>

            <p className="text-gray-300 mb-8 leading-relaxed text-lg max-w-lg">{artist.bio}</p>

            <div className="grid grid-cols-1 gap-4 mb-8">
              {artist.instagramHandle && (
                <div className="flex items-center space-x-3">
                  <Instagram className="w-5 h-5 text-gray-400" />
                  <a 
                    href={`https://instagram.com/${artist.instagramHandle.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {artist.instagramHandle}
                  </a>
                </div>
              )}
              {artist.hourlyRate && (
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-300">Starting at ${artist.hourlyRate}/hr</span>
                </div>
              )}
            </div>

            <div className="mb-8">
              <h3 className="font-semibold mb-4 text-lg">Specializes in:</h3>
              <div className="flex flex-wrap gap-2">
                {artist.specialties.map((style) => (
                  <Badge key={style} variant="outline" className="border-white/30 text-white">
                    {style}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex space-x-4">
              <Button asChild size="lg" className="bg-white text-black hover:bg-gray-100 !text-black hover:!text-black">
                <Link href={`/book?artist=${artist.slug}`}>Book Appointment</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white hover:text-black bg-transparent"
              >
                Get Consultation
              </Button>
            </div>
          </div>
        </div>

        {/* Curved Border */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-black">
          <svg className="absolute top-0 left-0 w-full h-32" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0 C300,120 900,120 1200,0 L1200,120 L0,120 Z" fill="black" />
          </svg>
        </div>
      </section>

      {/* Hero Section - Mobile stacked */}
      <section className="md:hidden -mt-16">
        <div className="relative w-full h-[55vh]">
          <Image
            src={profileImage}
            alt={artist.name}
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </div>
        <div className="px-6 py-8">
          <div className="mb-4 flex items-center gap-3">
            <Badge
              variant={artist.isActive ? "default" : "secondary"}
              className="bg-white/20 backdrop-blur-sm text-white border-white/30"
            >
              {artist.isActive ? "Available" : "Unavailable"}
            </Badge>
          </div>
          <h1 className="font-playfair text-4xl font-bold mb-2 text-balance">{artist.name}</h1>
          <p className="text-white/80 mb-4 text-base">{artist.specialties.join(", ")}</p>
          <p className="text-white/80 leading-relaxed mb-2 text-[17px]">
            {showFullBio ? bioText : bioText.slice(0, 180)}{bioText.length > 180 && !showFullBio ? "…" : ""}
          </p>
          {bioText.length > 180 && (
            <button onClick={() => setShowFullBio((v) => !v)} className="text-white/70 text-sm underline">
              {showFullBio ? "Show less" : "Read more"}
            </button>
          )}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild size="lg" className="bg-white text-black hover:bg-gray-100 !text-black hover:!text-black">
              <Link href={`/book?artist=${artist.slug}`}>Book Appointment</Link>
            </Button>
            <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white hover:text-black bg-transparent">
              Get Consultation
            </Button>
          </div>
        </div>
      </section>

      {/* Portfolio Section with Split Screen Layout (Desktop only) */}
      <section className="relative bg-black hidden md:block">
        <div className="flex min-h-screen">
          {/* Left Side - Portfolio Grid */}
          <div className="w-2/3 p-8 overflow-y-auto">
            {filteredPortfolio.length === 0 ? (
              <div className="flex items-center justify-center h-96">
                <p className="text-gray-400 text-xl">No portfolio images available</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-6">
                {filteredPortfolio.map((item) => (
                  <div
                    key={item.id}
                    className="group cursor-pointer"
                    role="button"
                    tabIndex={0}
                    aria-label={`Open ${item.caption || 'portfolio image'}`}
                    onClick={(e) => {
                      openImageFromElement(item.id, (e.currentTarget as HTMLElement) || null)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        openImageFromElement(item.id, e.currentTarget as HTMLElement)
                      }
                    }}
                  >
                    <div className="relative overflow-hidden bg-gray-900 aspect-[4/5] hover:scale-[1.02] transition-all duration-500">
                      <Image
                        src={item.url || "/placeholder.svg"}
                        alt={item.caption || `${artist.name} portfolio image`}
                        width={800}
                        height={1000}
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        aria-hidden={true}
                        priority={false}
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                        <div className="text-center">
                          <ExternalLink className="w-8 h-8 text-white mb-2 mx-auto" />
                          {item.caption && <p className="text-white font-medium">{item.caption}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Side - Sticky Header and Info */}
          <div className="w-1/3 sticky top-0 h-screen flex flex-col justify-center p-12 bg-black border-l border-white/10">
            <div>
              <div className="flex items-baseline justify-between mb-8">
                <h2 className="font-playfair text-5xl font-bold text-balance">Featured Work</h2>
                <span className="text-6xl font-light text-gray-500">{filteredPortfolio.length}</span>
              </div>

              <div className="mb-12">
                <p className="text-gray-300 leading-relaxed text-lg mb-8">
                  Explore the portfolio of {artist.name} showcasing their expertise in{" "}
                  {artist.specialties.join(", ")}. Each piece represents a unique collaboration between artist and
                  client.
                </p>
              </div>

              {/* Category Filter */}
              {categories.length > 1 && (
                <div className="mb-8">
                  <h3 className="font-semibold mb-4 text-lg">Filter by Style</h3>
                  <div className="flex flex-col gap-2" role="list">
                    {categories.map((category) => {
                      const count = category === "All" 
                        ? portfolioImages.length 
                        : portfolioImages.filter(img => img.tags.includes(category)).length
                      
                      return (
                        <Button
                          key={category}
                          variant="ghost"
                          onClick={() => setSelectedCategory(category)}
                          className={`justify-start text-left hover:bg-white/10 ${
                            selectedCategory === category ? "text-white bg-white/10" : "text-gray-400 hover:text-white"
                          }`}
                          aria-pressed={selectedCategory === category}
                          role="listitem"
                        >
                          {category}
                          <span className="ml-auto text-sm">{count}</span>
                        </Button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Quick Stats */}
              <div className="border-t border-white/10 pt-8">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">{portfolioImages.length}</div>
                    <div className="text-sm text-gray-400">Pieces</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{artist.isActive ? "Active" : "Inactive"}</div>
                    <div className="text-sm text-gray-400">Status</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Portfolio: Carousel + Filters (simplified) */}
      <section className="md:hidden bg-black">
        {/* Removed mobile category filters for simplicity */}

        {/* Carousel only */}
        <div className="px-2 pb-10">
          {filteredPortfolio.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-400">No portfolio images available</p>
            </div>
          ) : (
            <div className="relative" aria-label="Portfolio carousel">
              <Carousel opts={{ align: "start", loop: true }} className="w-full" setApi={setCarouselApi}>
                <CarouselContent>
                  {filteredPortfolio.map((item) => (
                    <CarouselItem key={item.id} className="basis-full">
                      <div className="w-full h-[70vh] relative">
                        <Image
                          src={item.url || "/placeholder.svg"}
                          alt={item.caption || `${artist.name} portfolio image`}
                          fill
                          sizes="100vw"
                          className="object-contain bg-black"
                        />
                      </div>
                    </CarouselItem>)
                  )}
                </CarouselContent>
              </Carousel>
              <div className="pointer-events-none absolute top-2 right-3 rounded-full bg-white/10 backdrop-blur px-2 py-1 text-xs text-white">
                {filteredPortfolio.length} pieces
              </div>
              {/* Swipe hint */}
              {showSwipeHint && (
                <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-white/10 backdrop-blur px-3 py-1 text-xs text-white">
                  Swipe left or right
                </div>
              )}
              {/* Dots indicators */}
              <div className="mt-3 flex items-center justify-center gap-2" role="tablist" aria-label="Carousel indicators">
                {Array.from({ length: carouselCount }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => carouselApi?.scrollTo(i)}
                    aria-current={carouselCurrent === i}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`h-2 w-2 rounded-full ${carouselCurrent === i ? "bg-white" : "bg-white/40"}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="relative py-32 bg-black border-t border-white/10">
        <div className="container mx-auto px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-playfair text-5xl font-bold mb-6 text-balance">Ready to Get Started?</h2>
            <p className="text-gray-300 text-xl leading-relaxed mb-12">
              Book a consultation with {artist.name} to discuss your next tattoo. We can help plan the
              design and schedule the session.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button
                asChild
                size="lg"
                className="bg-white text-black hover:bg-gray-100 !text-black hover:!text-black px-12 py-4 text-lg"
              >
                <Link href={`/book?artist=${artist.slug}`}>Book Now</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white hover:text-black bg-transparent px-12 py-4 text-lg"
              >
                Get Consultation
              </Button>
            </div>

            <div className="mt-16 pt-16 border-t border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold mb-2">{artist.specialties.length}+</div>
                  <div className="text-gray-400">Specialties</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">{portfolioImages.length}</div>
                  <div className="text-gray-400">Portfolio Pieces</div>
                </div>
                <div className="hidden md:block">
                  <div className="text-3xl font-bold mb-2">{artist.hourlyRate ? `$${artist.hourlyRate}` : "Contact"}</div>
                  <div className="text-gray-400">Starting Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Modal / Lightbox */}
      {selectedImage && currentItem && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={currentItem.caption || "Portfolio image"}
          onClick={() => closeModal()}
        >
          <div
            className="relative max-w-6xl max-h-[90vh] w-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => {
              touchStartX.current = e.touches[0].clientX
            }}
            onTouchEnd={(e) => {
              if (touchStartX.current == null) return
              const dx = e.changedTouches[0].clientX - touchStartX.current
              const threshold = 40
              if (Math.abs(dx) > threshold) {
                if (dx < 0) {
                  const next = (currentIndex + 1) % filteredPortfolio.length
                  goToIndex(next)
                } else {
                  const prev = (currentIndex - 1 + filteredPortfolio.length) % filteredPortfolio.length
                  goToIndex(prev)
                }
              }
              touchStartX.current = null
            }}
          >
            {/* Prev */}
            <button
              aria-label="Previous image"
              onClick={() => {
                const prev = (currentIndex - 1 + filteredPortfolio.length) % filteredPortfolio.length
                goToIndex(prev)
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 text-white p-2 bg-black/30 rounded hover:bg-black/50"
            >
              ‹
            </button>

            <div className="flex-1 flex items-center justify-center p-4">
              <Image
                src={currentItem.url || "/placeholder.svg"}
                alt={currentItem.caption || "Portfolio image"}
                width={1200}
                height={900}
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 80vw, 60vw"
                className="max-w-full max-h-[80vh] object-contain"
              />
            </div>

            {/* Next */}
            <button
              aria-label="Next image"
              onClick={() => {
                const next = (currentIndex + 1) % filteredPortfolio.length
                goToIndex(next)
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white p-2 bg-black/30 rounded hover:bg-black/50"
            >
              ›
            </button>

            <Button
              variant="ghost"
              size="sm"
              ref={closeButtonRef}
              className="absolute top-4 right-4 text-white hover:bg-white/20 text-2xl"
              onClick={closeModal}
              aria-label="Close image"
            >
              ✕
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
