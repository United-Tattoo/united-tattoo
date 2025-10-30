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
    <section ref={sectionRef} id="services" className="relative min-h-screen bg-[#0c0907]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(12,9,7,0)_0%,rgba(12,9,7,0.85)_45%,rgba(12,9,7,1)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(0deg,rgba(12,9,7,0)_0%,rgba(12,9,7,0.92)_70%,rgba(12,9,7,1)_100%)]" />

      <div className="relative z-10 bg-[#f4efe6] px-8 py-20 shadow-[0_45px_90px_-40px_rgba(0,0,0,0.55)] lg:px-16">
        <div className="mx-auto max-w-screen-2xl">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div className="relative">
              <div className="absolute -left-6 top-0 hidden h-32 w-1 bg-[#b9a18d]/40 lg:block" />
              <div className="mb-6">
                <span className="text-xs font-semibold uppercase tracking-[0.6em] text-[#6d5b4a]">What We Offer</span>
              </div>
              <h2 className="font-playfair text-5xl tracking-tight text-[#1f1814] sm:text-6xl lg:text-[4.5rem]">
                Services
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#3b3027]">
                From restorative cover-ups to experimental flash, each booking is curated with layered planning, precise
                execution, and a studio experience that keeps you grounded.
              </p>
            </div>
            <div className="relative">
              <div className="h-96 overflow-hidden rounded-3xl border border-[#d3c2b2]/40 bg-[#241c17] shadow-[0_50px_90px_-40px_rgba(0,0,0,0.5)]">
                <img
                  src="/tattoo-equipment-and-tools.jpg"
                  alt="Tattoo Equipment"
                  className="h-full w-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(20,15,12,0.75)_10%,rgba(20,15,12,0.2)_85%)]" />
              </div>
              <div className="absolute -bottom-6 -right-8 hidden h-24 w-24 rounded-full border border-[#d3c2b2]/60 bg-[#f4efe6] shadow-[0_25px_45px_-30px_rgba(0,0,0,0.6)] md:block" />
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 hidden bg-[#13100d] text-white lg:block">
        <div className="flex items-start">
          {/* Left Side - Enhanced with split composition styling */}
          <div className="sticky top-0 h-screen w-1/2 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.1),transparent_60%),linear-gradient(180deg,#1d1713_0%,#110d0a_100%)]">
            <div className="absolute right-0 top-0 h-full w-px bg-white/10" />
            <div className="relative flex h-full flex-col justify-center p-16">
              <div className="space-y-8">
                <div className="mb-12">
                  <div className="mb-6 h-px w-12 bg-white/35" />
                  <span className="text-sm font-semibold uppercase tracking-[0.5em] text-white/55">Our Services</span>
                  <h3 className="mt-4 font-playfair text-4xl tracking-tight text-white">Choose Your Style</h3>
                </div>

                {services.map((service, index) => (
                  <div
                    key={index}
                    className={`group cursor-pointer transition-all duration-500 ${
                      activeService === index ? "opacity-100" : "opacity-50 hover:opacity-75"
                    }`}
                    onClick={() => {
                      const element = document.querySelector(`[data-service-index="${index}"]`)
                      element?.scrollIntoView({ behavior: "smooth" })
                    }}
                  >
                    <div
                      className={`border-l-[3px] py-4 pl-6 transition-all duration-300 ${
                        activeService === index ? "border-white" : "border-white/15 group-hover:border-white/30"
                      }`}
                    >
                      <h4 className="mb-2 text-2xl font-semibold tracking-wide">{service.title}</h4>
                      <p className="text-sm text-white/60">{service.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Enhanced with split composition styling */}
          <div className="w-1/2 bg-gradient-to-b from-[#15110d] via-[#110d0a] to-[#0c0907]">
            {services.map((service, index) => (
              <div
                key={index}
                data-service-index={index}
                className="relative flex min-h-screen items-center justify-center p-12"
              >
                <div className="absolute left-0 top-1/2 h-32 w-px -translate-y-1/2 bg-white/10" />
                <div className="relative max-w-lg">
                  <div className="mb-6">
                    <span className="text-xs font-semibold uppercase tracking-[0.6em] text-white/55">
                      Service {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="mb-6 font-playfair text-4xl tracking-tight lg:text-5xl">
                    {service.title.split(" ").map((word, i) => (
                      <span key={i} className="block">
                        {word}
                      </span>
                    ))}
                  </h3>

                  <div className="mb-8 space-y-6">
                    <p className="text-base leading-relaxed text-white/75">{service.description}</p>

                    <div className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <p key={idx} className="flex items-center text-white/60">
                          <span className="mr-3 h-[2px] w-6 bg-white/30" />
                          {feature}
                        </p>
                      ))}
                    </div>

                    <p className="text-xl font-semibold uppercase tracking-[0.4em] text-white/70">
                      {service.price}
                    </p>
                  </div>

                  <Button
                    asChild
                    className="rounded-full border border-white/15 bg-white/90 px-8 py-4 text-xs font-semibold uppercase tracking-[0.36em] text-[#1c1713] transition-transform duration-300 hover:scale-[1.04] hover:bg-white"
                  >
                    <Link href="/book">Book Now</Link>
                  </Button>

                  <div className="mt-12">
                    <div className="relative">
                      <img
                        src={`/abstract-geometric-shapes.png?height=300&width=400&query=${service.title.toLowerCase()} tattoo example`}
                        alt={service.title}
                        className="h-auto w-full max-w-sm rounded-3xl border border-white/10 object-cover shadow-[0_35px_65px_-40px_rgba(0,0,0,0.8)]"
                      />
                      <div className="absolute -bottom-3 -right-3 h-16 w-16 rounded-2xl border border-white/15 bg-white/10" />
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
