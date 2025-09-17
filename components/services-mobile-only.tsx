"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Link from "next/link"

const services = [
  {
    title: "Black & Grey Realism",
    description: "Photorealistic tattoos with incredible depth and detail using black and grey shading techniques.",
    features: ["Lifelike portraits", "Detailed shading", "3D effects"],
    price: "Starting at $250",
  },
  {
    title: "Cover-ups & Blackout",
    description: "Transform old tattoos into stunning new pieces with expert cover-up techniques or bold blackout designs.",
    features: ["Free consultation", "Creative solutions", "Complete coverage"],
    price: "Starting at $300",
  },
  {
    title: "Fine Line & Micro Realism",
    description: "Delicate, precise linework and tiny realistic designs that showcase incredible detail.",
    features: ["Single needle work", "Intricate details", "Minimalist aesthetic"],
    price: "Starting at $150",
  },
  {
    title: "Traditional & Neo-Traditional",
    description: "Bold American traditional and neo-traditional styles with vibrant colors and strong lines.",
    features: ["Classic designs", "Bold color palettes", "Timeless appeal"],
    price: "Starting at $200",
  },
  {
    title: "Anime & Watercolor",
    description: "Vibrant anime characters and painterly watercolor effects that bring art to life on skin.",
    features: ["Character designs", "Soft color blends", "Artistic techniques"],
    price: "Starting at $250",
  },
]

export function ServicesMobileOnly() {
  return (
    <section className="lg:hidden bg-black text-white py-16">
      {/* Header */}
      <div className="px-6 mb-12 text-center">
        <div className="mb-4">
          <span className="text-sm font-medium tracking-widest text-white/60 uppercase">Our Services</span>
        </div>
        <h2 className="text-4xl font-bold tracking-tight mb-4">Choose Your Style</h2>
        <p className="text-white/70 max-w-md mx-auto">
          From custom designs to cover-ups, we offer comprehensive tattoo services with the highest standards.
        </p>
      </div>

      {/* Carousel */}
      <div className="px-4">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-sm mx-auto"
        >
          <CarouselContent className="-ml-2">
            {services.map((service, index) => (
              <CarouselItem key={index} className="pl-2 basis-full">
                <Card className="bg-black border-white/20 text-white h-full">
                  <CardHeader className="pb-4">
                    <div className="text-xs font-medium tracking-widest text-white/60 uppercase mb-2">
                      Service {String(index + 1).padStart(2, "0")}
                    </div>
                    <CardTitle className="text-2xl font-bold leading-tight">
                      {service.title}
                    </CardTitle>
                    <CardDescription className="text-white/80 text-base leading-relaxed">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pb-4">
                    <div className="space-y-2 mb-6">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-white/70">
                          <span className="w-1.5 h-1.5 bg-white/40 rounded-full mr-3 flex-shrink-0"></span>
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="text-xl font-bold text-white mb-4">
                      {service.price}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="pt-0">
                    <Button
                      asChild
                      className="w-full bg-white text-black hover:bg-gray-100 !text-black font-medium"
                    >
                      <Link href="/book">BOOK NOW</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          <div className="flex justify-center mt-8 gap-4">
            <CarouselPrevious className="relative translate-y-0 left-0 bg-white/10 border-white/20 text-white hover:bg-white/20" />
            <CarouselNext className="relative translate-y-0 right-0 bg-white/10 border-white/20 text-white hover:bg-white/20" />
          </div>
        </Carousel>
      </div>
    </section>
  )
}
