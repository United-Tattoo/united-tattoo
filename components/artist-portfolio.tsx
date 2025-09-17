"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Star, MapPin, Calendar, Instagram, ExternalLink } from "lucide-react"

// Mock data - in a real app, this would come from a database
const artistsData = {
  "1": {
    id: "1",
    name: "Christy Lumberg",
    specialty: "Expert Cover-Up & Illustrative Specialist",
    image: "/artists/christy-lumberg-portrait.jpg",
    bio: "With over 22 years of experience, Christy Lumberg is a powerhouse in the tattoo industry, known for her exceptional cover-ups, tattoo makeovers, and bold illustrative designs. Whether you're looking to transform old ink, refresh a faded piece, or bring a brand-new vision to life, Christy's precision and artistry deliver next-level results.",
    experience: "22+ years",
    rating: 5.0,
    reviews: 245,
    location: "United Tattoo - Fountain & Colorado Springs",
    availability: "Available",
    styles: ["Cover-ups", "Illustrative", "Black & Grey", "Color Work", "Tattoo Makeovers"],
    instagram: "@inkmama719",
    portfolio: [
      {
        id: 1,
        image: "/artists/christy-lumberg-work-1.jpg",
        title: "Cover-Up Transformation",
        category: "Cover-ups",
      },
      {
        id: 2,
        image: "/artists/christy-lumberg-work-2.jpg",
        title: "Illustrative Design",
        category: "Illustrative",
      },
      {
        id: 3,
        image: "/artists/christy-lumberg-work-3.jpg",
        title: "Black & Grey Masterpiece",
        category: "Black & Grey",
      },
      {
        id: 4,
        image: "/artists/christy-lumberg-work-4.jpg",
        title: "Vibrant Color Work",
        category: "Color Work",
      },
      { id: 5, image: "/black-and-grey-portrait-tattoo-masterpiece.jpg", title: "Portrait Mastery", category: "Black & Grey" },
      { id: 6, image: "/realistic-portrait-tattoo-artwork.jpg", title: "Realistic Portrait", category: "Illustrative" },
      { id: 7, image: "/botanical-nature-tattoo-artwork.jpg", title: "Botanical Design", category: "Color Work" },
      { id: 8, image: "/geometric-abstract-tattoo-artwork.jpg", title: "Geometric Art", category: "Illustrative" },
      { id: 9, image: "/watercolor-illustrative-tattoo-artwork.jpg", title: "Watercolor Style", category: "Color Work" },
      { id: 10, image: "/fine-line-botanical-tattoo-elegant.jpg", title: "Fine Line Botanical", category: "Illustrative" },
      { id: 11, image: "/realistic-animal-tattoo-detailed-shading.jpg", title: "Animal Portrait", category: "Black & Grey" },
      { id: 12, image: "/traditional-neo-traditional-tattoo-artwork.jpg", title: "Neo-Traditional", category: "Color Work" },
      { id: 13, image: "/photorealistic-portrait-tattoo-black-and-grey.jpg", title: "Photorealistic Portrait", category: "Black & Grey" },
      { id: 14, image: "/hyperrealistic-eye-tattoo-design.jpg", title: "Hyperrealistic Eye", category: "Black & Grey" },
      { id: 15, image: "/delicate-fine-line-flower-tattoo.jpg", title: "Delicate Florals", category: "Illustrative" },
      { id: 16, image: "/professional-tattoo-artist-working-on-detailed-tat.jpg", title: "Detailed Work", category: "Cover-ups" },
      { id: 17, image: "/fine-line-minimalist-tattoo-artwork.jpg", title: "Minimalist Design", category: "Illustrative" },
      { id: 18, image: "/simple-line-work-tattoo-artistic.jpg", title: "Line Work Art", category: "Black & Grey" },
      { id: 19, image: "/minimalist-geometric-tattoo-design.jpg", title: "Geometric Minimalism", category: "Illustrative" },
      { id: 20, image: "/abstract-geometric-shapes.png", title: "Abstract Geometry", category: "Color Work" },
    ],
    testimonials: [
      {
        name: "Maria S.",
        rating: 5,
        text: "Christy transformed my old tattoo into something absolutely stunning! Her cover-up work is incredible and exceeded all my expectations.",
      },
      {
        name: "David L.",
        rating: 5,
        text: "22 years of experience really shows. Christy is a true artist and professional. The Ink Mama knows her craft!",
      },
      {
        name: "Sarah K.",
        rating: 5,
        text: "As the CEO of United Tattoo, Christy has created an amazing environment. Her illustrative work is phenomenal!",
      },
    ],
  },
  // Add other artists data here...
}

interface ArtistPortfolioProps {
  artistId: string
}

export function ArtistPortfolio({ artistId }: ArtistPortfolioProps) {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [scrollY, setScrollY] = useState(0)

  const artist = artistsData[artistId as keyof typeof artistsData]

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (!artist) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Artist not found</h1>
        <Button asChild>
          <Link href="/artists">Back to Artists</Link>
        </Button>
      </div>
    )
  }

  const categories = ["All", ...Array.from(new Set(artist.portfolio.map((item) => item.category)))]
  const filteredPortfolio =
    selectedCategory === "All"
      ? artist.portfolio
      : artist.portfolio.filter((item) => item.category === selectedCategory)

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Back Button */}
      <div className="fixed top-6 right-8 z-40">
        <Button
          asChild
          variant="ghost"
          className="text-white hover:bg-white/20 border border-white/30 backdrop-blur-sm bg-black/40 hover:text-white"
        >
          <Link href="/artists">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Artists
          </Link>
        </Button>
      </div>

      {/* Hero Section with Split Screen */}
      <section className="relative h-screen overflow-hidden -mt-20">
        {/* Left Side - Artist Image */}
        <div className="absolute left-0 top-0 w-1/2 h-full" style={{ transform: `translateY(${scrollY * 0.3}px)` }}>
          <div className="relative w-full h-full">
            <img src={artist.image || "/placeholder.svg"} alt={artist.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/50" />
            <div className="absolute top-28 left-8">
              <Badge
                variant={artist.availability === "Available" ? "default" : "secondary"}
                className="bg-white/20 backdrop-blur-sm text-white border-white/30"
              >
                {artist.availability}
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
              <p className="text-2xl text-gray-300 mb-6">{artist.specialty}</p>
              <div className="flex items-center space-x-2 mb-6">
                <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                <span className="font-medium text-xl">{artist.rating}</span>
                <span className="text-gray-400">({artist.reviews} reviews)</span>
              </div>
            </div>

            <p className="text-gray-300 mb-8 leading-relaxed text-lg max-w-lg">{artist.bio}</p>

            <div className="grid grid-cols-1 gap-4 mb-8">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-gray-300">{artist.experience} experience</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span className="text-gray-300">{artist.location}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Instagram className="w-5 h-5 text-gray-400" />
                <span className="text-gray-300">{artist.instagram}</span>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="font-semibold mb-4 text-lg">Specializes in:</h3>
              <div className="flex flex-wrap gap-2">
                {artist.styles.map((style) => (
                  <Badge key={style} variant="outline" className="border-white/30 text-white">
                    {style}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex space-x-4">
              <Button asChild size="lg" className="bg-white text-black hover:bg-gray-100 !text-black hover:!text-black">
                <Link href={`/artists/${artist.id}/book`}>Book Appointment</Link>
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

      {/* Portfolio Section with Split Screen Layout */}
      <section className="relative bg-black">
        <div className="flex min-h-screen">
          {/* Left Side - Portfolio Grid */}
          <div className="w-2/3 p-8 overflow-y-auto">
            <div className="grid grid-cols-2 gap-6">
              {filteredPortfolio.map((item, index) => (
                <div key={item.id} className="group cursor-pointer" onClick={() => setSelectedImage(item.id)}>
                  <div className="relative overflow-hidden bg-gray-900 aspect-[4/5] hover:scale-[1.02] transition-all duration-500">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                      <div className="text-center">
                        <ExternalLink className="w-8 h-8 text-white mb-2 mx-auto" />
                        <p className="text-white font-medium">{item.title}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Sticky Header and Info */}
          <div className="w-1/3 sticky top-0 h-screen flex flex-col justify-center p-12 bg-black border-l border-white/10">
            <div>
              <div className="flex items-baseline justify-between mb-8">
                <h2 className="font-playfair text-5xl font-bold text-balance">Featured Work</h2>
                <span className="text-6xl font-light text-gray-500">{filteredPortfolio.length}</span>
              </div>

              <div className="mb-12">
                <Button
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white hover:text-black bg-transparent mb-8"
                >
                  View All
                </Button>

                <p className="text-gray-300 leading-relaxed text-lg mb-8">
                  Explore {artist.name}'s portfolio showcasing {artist.experience} of expertise in{" "}
                  {artist.specialty.toLowerCase()}. Each piece represents a unique collaboration between artist and
                  client.
                </p>
              </div>

              {/* Category Filter */}
              <div className="mb-8">
                <h3 className="font-semibold mb-4 text-lg">Filter by Style</h3>
                <div className="flex flex-col gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant="ghost"
                      onClick={() => setSelectedCategory(category)}
                      className={`justify-start text-left hover:bg-white/10 ${
                        selectedCategory === category ? "text-white bg-white/10" : "text-gray-400 hover:text-white"
                      }`}
                    >
                      {category}
                      <span className="ml-auto text-sm">
                        {category === "All"
                          ? artist.portfolio.length
                          : artist.portfolio.filter((item) => item.category === category).length}
                      </span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="border-t border-white/10 pt-8">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">{artist.portfolio.length}</div>
                    <div className="text-sm text-gray-400">Pieces</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{artist.rating}</div>
                    <div className="text-sm text-gray-400">Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="relative py-32 bg-black border-t border-white/10 overflow-hidden">
        <div className="container mx-auto px-8 mb-16">
          <div className="text-center">
            <h2 className="font-playfair text-5xl font-bold mb-4 text-balance">What Clients Say</h2>
            <div className="w-16 h-0.5 bg-white mx-auto" />
          </div>
        </div>

        <div className="relative">
          <div className="flex animate-marquee-smooth space-x-16 hover:pause-smooth">
            {/* Duplicate testimonials for seamless loop */}
            {[...artist.testimonials, ...artist.testimonials, ...artist.testimonials, ...artist.testimonials].map(
              (testimonial, index) => (
                <div key={index} className="flex-shrink-0 min-w-[500px] px-8">
                  {/* Enhanced spotlight background with stronger separation */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-radial from-white/8 via-white/3 to-transparent rounded-2xl blur-lg scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl" />
                    <div className="relative bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-500 hover:bg-black/60">
                      <div className="flex items-center space-x-1 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-white text-white" />
                        ))}
                      </div>
                      <blockquote className="text-white text-xl font-light leading-relaxed mb-4 italic">
                        "{testimonial.text}"
                      </blockquote>
                      <cite className="text-gray-400 text-sm font-medium not-italic">— {testimonial.name}</cite>
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="relative py-32 bg-black">
        <div className="container mx-auto px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-playfair text-5xl font-bold mb-6 text-balance">Ready to Get Started?</h2>
            <p className="text-gray-300 text-xl leading-relaxed mb-12">
              Book a consultation with {artist.name} to discuss your next tattoo. Whether you're looking for a
              traditional piece or something with a modern twist, let's bring your vision to life.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button
                asChild
                size="lg"
                className="bg-white text-black hover:bg-gray-100 !text-black hover:!text-black px-12 py-4 text-lg"
              >
                <Link href={`/artists/${artist.id}/book`}>Book Now</Link>
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
                  <div className="text-3xl font-bold mb-2">{artist.experience}</div>
                  <div className="text-gray-400">Experience</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">{artist.reviews}+</div>
                  <div className="text-gray-400">Happy Clients</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">{artist.rating}/5</div>
                  <div className="text-gray-400">Average Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-6xl max-h-full">
            <img
              src={filteredPortfolio.find((item) => item.id === selectedImage)?.image || "/placeholder.svg"}
              alt="Portfolio piece"
              className="max-w-full max-h-full object-contain"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 text-white hover:bg-white/20 text-2xl"
              onClick={() => setSelectedImage(null)}
            >
              ✕
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
