"use client"

import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Link from "next/link"

const services = [
  {
    title: "Black & Grey Realism",
    description: "Photorealistic tattoos with incredible depth and detail using black and grey shading techniques.",
    features: ["Lifelike portraits", "Detailed shading", "3D effects"],
    price: "Starting at $250",
    bgColor: "bg-gray-100",
  },
  {
    title: "Cover-ups & Blackout",
    description: "Transform old tattoos into stunning new pieces with expert cover-up techniques or bold blackout designs.",
    features: ["Free consultation", "Creative solutions", "Complete coverage"],
    price: "Starting at $300",
    bgColor: "bg-black",
  },
  {
    title: "Fine Line & Micro Realism",
    description: "Delicate, precise linework and tiny realistic designs that showcase incredible detail.",
    features: ["Single needle work", "Intricate details", "Minimalist aesthetic"],
    price: "Starting at $150",
    bgColor: "bg-purple-100",
  },
  {
    title: "Traditional & Neo-Traditional",
    description: "Bold American traditional and neo-traditional styles with vibrant colors and strong lines.",
    features: ["Classic designs", "Bold color palettes", "Timeless appeal"],
    price: "Starting at $200",
    bgColor: "bg-red-100",
  },
  {
    title: "Anime & Watercolor",
    description: "Vibrant anime characters and painterly watercolor effects that bring art to life on skin.",
    features: ["Character designs", "Soft color blends", "Artistic techniques"],
    price: "Starting at $250",
    bgColor: "bg-blue-100",
  },
]

export function ServicesMobileCarousel() {
  return (
    <div className="lg:hidden bg-black text-white py-12">
      <div className="px-4 mb-8">
        <div className="mb-6">
          <span className="text-sm font-medium tracking-widest text-white/60 uppercase">Our Services</span>
        </div>
        <h3 className="text-4xl font-bold tracking-tight text-balance">Choose Your Style</h3>
      </div>

      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {services.map((service, index) => (
            <CarouselItem key={index} className="pl-2 md:pl-4 basis-[85%] sm:basis-[75%] md:basis-[70%]">
              <div className="min-h-[50vh] flex items-center justify-center p-4 relative">
                <div className="max-w-sm relative">
                  <div className="mb-6">
                    <span className="text-sm font-medium tracking-widest text-white/60 uppercase">
                      Service {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="text-3xl font-bold tracking-tight mb-6 text-balance">
                    {service.title.split(" ").map((word, i) => (
                      <span key={i} className="block">
                        {word}
                      </span>
                    ))}
                  </h3>

                  <div className="space-y-6 mb-8">
                    <p className="text-lg text-white/80 leading-relaxed">{service.description}</p>

                    <div className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <p key={idx} className="text-white/70 flex items-center">
                          <span className="w-1 h-1 bg-white/40 rounded-full mr-3"></span>
                          {feature}
                        </p>
                      ))}
                    </div>

                    <p className="text-2xl font-bold text-white">{service.price}</p>
                  </div>

                  <Button
                    asChild
                    className="bg-white text-black hover:bg-white/90 !text-black px-8 py-4 text-lg font-medium tracking-wide transition-all duration-300 hover:scale-105"
                  >
                    <Link href="/book">BOOK NOW</Link>
                  </Button>

                  <div className="mt-8">
                    <div className="relative">
                      <img
                        src={`/abstract-geometric-shapes.png?height=250&width=300&query=${service.title.toLowerCase()} tattoo example`}
                        alt={service.title}
                        className="w-full max-w-xs h-auto object-cover rounded-lg shadow-2xl"
                      />
                      <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white/5 rounded-lg"></div>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-center mt-8 space-x-4">
          <CarouselPrevious className="relative translate-y-0 left-0 bg-white/10 border-white/20 text-white hover:bg-white/20" />
          <CarouselNext className="relative translate-y-0 right-0 bg-white/10 border-white/20 text-white hover:bg-white/20" />
        </div>
      </Carousel>
    </div>
  )
}
