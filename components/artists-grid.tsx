"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Star, Loader2 } from "lucide-react"
import { useArtists } from "@/hooks/use-artist-data"

const specialties = ["All", "Traditional", "Realism", "Fine Line", "Japanese", "Portraits", "Minimalist", "Black & Grey"]

export function ArtistsGrid() {
  const [selectedSpecialty, setSelectedSpecialty] = useState("All")

  // Fetch artists from API
  const { data: artists, isLoading, error } = useArtists({ limit: 50 })

  // Filter artists client-side
  const filteredArtists = useMemo(() => {
    if (!artists) return []

    if (selectedSpecialty === "All") {
      return artists
    }

    return artists.filter((artist) =>
      artist.specialties.some((style) =>
        style.toLowerCase().includes(selectedSpecialty.toLowerCase())
      )
    )
  }, [artists, selectedSpecialty])

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="font-playfair text-4xl md:text-6xl font-bold mb-6 text-balance">Our Artists</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Meet our talented team of tattoo artists, each bringing their unique style and years of experience to create
            your perfect tattoo.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {specialties.map((specialty) => (
            <Button
              key={specialty}
              variant={selectedSpecialty === specialty ? "default" : "outline"}
              onClick={() => setSelectedSpecialty(specialty)}
              className="px-6 py-2"
            >
              {specialty}
            </Button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <p className="text-red-500 mb-4">Failed to load artists. Please try again later.</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        )}

        {/* Artists Grid */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArtists.length === 0 ? (
              <div className="col-span-full text-center py-20">
                <p className="text-muted-foreground text-lg">No artists found matching your criteria.</p>
              </div>
            ) : (
              filteredArtists.map((artist) => {
                // Get profile image (first portfolio image or placeholder)
                const profileImage = artist.portfolioImages.find(img => img.tags.includes('profile'))?.url ||
                                    artist.portfolioImages[0]?.url ||
                                    "/placeholder.svg"

                return (
                  <Card key={artist.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <div className="flex flex-col h-full">
                      {/* Artist Image */}
                      <div className="relative w-full h-48 sm:h-56 overflow-hidden">
                        <img
                          src={profileImage}
                          alt={artist.name}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3">
                          <Badge variant={artist.isActive ? "default" : "secondary"}>
                            {artist.isActive ? "Available" : "Unavailable"}
                          </Badge>
                        </div>
                      </div>

                      {/* Artist Info */}
                      <CardContent className="p-4 flex-grow flex flex-col">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-playfair text-xl font-bold mb-1">{artist.name}</h3>
                            <p className="text-primary font-medium text-sm">
                              {artist.specialties.slice(0, 2).join(", ")}
                            </p>
                          </div>
                        </div>

                        <p className="text-muted-foreground mb-4 text-xs leading-relaxed line-clamp-3">{artist.bio}</p>

                        {/* Hourly Rate */}
                        {artist.hourlyRate && (
                          <div className="mb-4">
                            <p className="text-xs text-muted-foreground">
                              Starting at <span className="font-semibold text-foreground">${artist.hourlyRate}/hr</span>
                            </p>
                          </div>
                        )}

                        {/* Styles */}
                        <div className="mb-4">
                          <p className="text-xs font-medium mb-1">Specializes in:</p>
                          <div className="flex flex-wrap gap-1">
                            {artist.specialties.slice(0, 3).map((style) => (
                              <Badge key={style} variant="outline" className="text-xs px-2 py-1">
                                {style}
                              </Badge>
                            ))}
                            {artist.specialties.length > 3 && (
                              <Badge variant="outline" className="text-xs px-2 py-1">
                                +{artist.specialties.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-2 mt-auto">
                          <Button asChild className="flex-1 text-xs py-2">
                            <Link href={`/artists/${artist.slug}`}>View Portfolio</Link>
                          </Button>
                          <Button
                            asChild
                            variant="outline"
                            className="flex-1 bg-white text-black !text-black border-gray-300 hover:bg-gray-50 hover:!text-black text-xs py-2"
                          >
                            <Link href={`/book?artist=${artist.slug}`}>Book Now</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                )
              })
            )}
          </div>
        )}
      </div>
    </section>
  )
}
