"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ServicesMobileOnly } from "@/components/services-mobile-only"

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

export function ServicesSection() {
  const [activeService, setActiveService] = useState(0)
  const [visibleItems, setVisibleItems] = useState<number[]>([])
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const itemIndex = Number.parseInt(entry.target.getAttribute("data-service-index") || "0")
            setVisibleItems((prev) => [...new Set([...prev, itemIndex])])
            setActiveService(itemIndex)
          }
        })
      },
      { threshold: 0.5, rootMargin: "0px 0px -50% 0px" },
    )

    const items = sectionRef.current?.querySelectorAll("[data-service-index]")
    items?.forEach((item) => observer.observe(item))

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="services" className="min-h-screen relative">
      <div className="absolute inset-x-0 top-0 h-16 bg-black rounded-b-[100px]"></div>
      <div className="absolute inset-x-0 bottom-0 h-16 bg-black rounded-t-[100px]"></div>

      <div className="bg-white py-20 px-8 lg:px-16 relative z-10">
        <div className="max-w-screen-2xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute -left-4 top-0 w-1 h-32 bg-black/10"></div>
              <div className="mb-8">
                <span className="text-sm font-medium tracking-widest text-black/90 uppercase">What We Offer</span>
              </div>
              <h2 className="text-6xl lg:text-8xl font-bold tracking-tight mb-8 text-balance text-black">SERVICES</h2>
              <p className="text-xl text-black/90 leading-relaxed max-w-lg">
                From custom designs to cover-ups, we offer comprehensive tattoo services with the highest standards of
                quality and safety.
              </p>
            </div>
            <div className="relative">
              <div className="bg-black/5 h-96 rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/tattoo-equipment-and-tools.jpg"
                  alt="Tattoo Equipment"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-black/5 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:block bg-black text-white relative z-10">
        <div className="flex">
          {/* Left Side - Enhanced with split composition styling */}
          <div className="w-1/2 sticky top-0 h-screen bg-black relative">
            <div className="absolute right-0 top-0 w-px h-full bg-white/10"></div>
            <div className="h-full flex flex-col justify-center p-16 relative">
              <div className="space-y-8">
                <div className="mb-12">
                  <div className="w-12 h-px bg-white/40 mb-6"></div>
                  <span className="text-sm font-medium tracking-widest text-white/60 uppercase">Our Services</span>
                  <h3 className="text-4xl font-bold tracking-tight mt-4 text-balance">Choose Your Style</h3>
                </div>

                {services.map((service, index) => (
                  <div
                    key={index}
                    className={`transition-all duration-500 cursor-pointer group ${
                      activeService === index ? "opacity-100" : "opacity-50 hover:opacity-75"
                    }`}
                    onClick={() => {
                      const element = document.querySelector(`[data-service-index="${index}"]`)
                      element?.scrollIntoView({ behavior: "smooth" })
                    }}
                  >
                    <div
                      className={`border-l-2 pl-6 py-4 transition-all duration-300 ${
                        activeService === index ? "border-white" : "border-white/20 group-hover:border-white/40"
                      }`}
                    >
                      <h4 className="text-2xl font-bold mb-2">{service.title}</h4>
                      <p className="text-white/70 text-sm">{service.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Enhanced with split composition styling */}
          <div className="w-full lg:w-1/2 bg-gradient-to-b from-black to-gray-900">
            {services.map((service, index) => (
              <div
                key={index}
                data-service-index={index}
                className="min-h-screen flex items-center justify-center p-8 lg:p-16 relative"
              >
                <div className="absolute left-0 top-1/2 w-px h-32 bg-white/10 -translate-y-1/2"></div>
                <div className="max-w-lg relative">
                  <div className="mb-6">
                    <span className="text-sm font-medium tracking-widest text-white/60 uppercase">
                      Service {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6 text-balance">
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

                  <div className="mt-12">
                    <div className="relative">
                      <img
                        src={`/abstract-geometric-shapes.png?height=300&width=400&query=${service.title.toLowerCase()} tattoo example`}
                        alt={service.title}
                        loading="lazy"
                        className="w-full max-w-sm h-auto object-cover rounded-lg shadow-2xl"
                      />
                      <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-white/5 rounded-lg"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <ServicesMobileOnly />
    </section>
  )
}
