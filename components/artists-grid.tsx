"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Star, MapPin, Calendar } from "lucide-react"

const artists = [
  {
    id: "1",
    name: "Sarah Chen",
    specialty: "Traditional & Neo-Traditional",
    image: "/professional-female-tattoo-artist-with-traditional.jpg",
    bio: "Specializing in bold traditional designs with a modern twist. Sarah brings 8 years of experience creating vibrant, timeless tattoos.",
    experience: "8 years",
    rating: 4.9,
    reviews: 127,
    location: "Studio A",
    availability: "Available",
    styles: ["Traditional", "Neo-Traditional", "American Traditional", "Color Work"],
    portfolio: [
      "/traditional-rose-tattoo-with-bold-colors.jpg",
      "/neo-traditional-wolf-tattoo-design.jpg",
      "/american-traditional-anchor-tattoo.jpg",
      "/colorful-traditional-bird-tattoo.jpg",
    ],
  },
  {
    id: "2",
    name: "Marcus Rodriguez",
    specialty: "Realism & Portraits",
    image: "/professional-male-tattoo-artist-specializing-in-re.jpg",
    bio: "Master of photorealistic tattoos and detailed portrait work. Marcus has perfected the art of bringing photographs to life on skin.",
    experience: "12 years",
    rating: 5.0,
    reviews: 89,
    location: "Studio B",
    availability: "Booked until March",
    styles: ["Realism", "Portraits", "Black & Grey", "Photorealism"],
    portfolio: [
      "/photorealistic-portrait-tattoo-black-and-grey.jpg",
      "/realistic-animal-tattoo-detailed-shading.jpg",
      "/black-and-grey-portrait-tattoo-masterpiece.jpg",
      "/hyperrealistic-eye-tattoo-design.jpg",
    ],
  },
  {
    id: "3",
    name: "Luna Kim",
    specialty: "Fine Line & Minimalist",
    image: "/professional-female-tattoo-artist-with-delicate-fi.jpg",
    bio: "Creating elegant, minimalist designs with precision and grace. Luna's delicate touch brings subtle beauty to every piece.",
    experience: "6 years",
    rating: 4.8,
    reviews: 156,
    location: "Studio C",
    availability: "Available",
    styles: ["Fine Line", "Minimalist", "Geometric", "Botanical"],
    portfolio: [
      "/delicate-fine-line-flower-tattoo.jpg",
      "/minimalist-geometric-tattoo-design.jpg",
      "/fine-line-botanical-tattoo-elegant.jpg",
      "/simple-line-work-tattoo-artistic.jpg",
    ],
  },
  {
    id: "4",
    name: "Jake Thompson",
    specialty: "Japanese & Oriental",
    image: "/professional-male-tattoo-artist-with-japanese-styl.jpg",
    bio: "Traditional Japanese tattooing with authentic techniques passed down through generations. Jake honors the ancient art form.",
    experience: "15 years",
    rating: 4.9,
    reviews: 203,
    location: "Studio D",
    availability: "Limited slots",
    styles: ["Japanese", "Oriental", "Irezumi", "Traditional Japanese"],
    portfolio: [
      "/traditional-japanese-dragon-tattoo-sleeve.jpg",
      "/japanese-koi-fish-tattoo-colorful.jpg",
      "/oriental-cherry-blossom-tattoo-design.jpg",
      "/japanese-samurai-tattoo-traditional.jpg",
    ],
  },
]

const specialties = ["All", "Traditional", "Realism", "Fine Line", "Japanese", "Portraits", "Minimalist"]

export function ArtistsGrid() {
  const [selectedSpecialty, setSelectedSpecialty] = useState("All")

  const filteredArtists =
    selectedSpecialty === "All"
      ? artists
      : artists.filter((artist) =>
          artist.styles.some((style) => style.toLowerCase().includes(selectedSpecialty.toLowerCase())),
        )

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

        {/* Artists Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArtists.map((artist) => (
            <Card key={artist.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="flex flex-col h-full">
                {/* Artist Image */}
                <div className="relative w-full h-48 sm:h-56 overflow-hidden">
                  <img
                    src={artist.image || "/placeholder.svg"}
                    alt={artist.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant={artist.availability === "Available" ? "default" : "secondary"}>
                      {artist.availability}
                    </Badge>
                  </div>
                </div>

                {/* Artist Info */}
                <CardContent className="p-4 flex-grow flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-playfair text-xl font-bold mb-1">{artist.name}</h3>
                      <p className="text-primary font-medium text-sm">{artist.specialty}</p>
                    </div>
                    <div className="flex items-center space-x-1 text-xs">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{artist.rating}</span>
                      <span className="text-muted-foreground">({artist.reviews})</span>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-3 text-xs leading-relaxed line-clamp-3">{artist.bio}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-1 text-xs">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      <span>{artist.experience} experience</span>
                    </div>
                    <div className="flex items-center space-x-1 text-xs">
                      <MapPin className="w-3 h-3 text-muted-foreground" />
                      <span>{artist.location}</span>
                    </div>
                  </div>

                  {/* Styles */}
                  <div className="mb-4">
                    <p className="text-xs font-medium mb-1">Specializes in:</p>
                    <div className="flex flex-wrap gap-1">
                      {artist.styles.slice(0, 3).map((style) => (
                        <Badge key={style} variant="outline" className="text-xs px-2 py-1">
                          {style}
                        </Badge>
                      ))}
                      {artist.styles.length > 3 && (
                        <Badge variant="outline" className="text-xs px-2 py-1">
                          +{artist.styles.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2 mt-auto">
                    <Button asChild className="flex-1 text-xs py-2">
                      <Link href={`/artists/${artist.id}`}>View Portfolio</Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="flex-1 bg-white text-black !text-black border-gray-300 hover:bg-gray-50 hover:!text-black text-xs py-2"
                    >
                      <Link href={`/artists/${artist.id}/book`}>Book Now</Link>
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
