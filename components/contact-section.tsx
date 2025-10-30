"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <section id="contact" className="relative min-h-screen overflow-hidden bg-[#0c0907]">
      {/* Background logo - desktop only */}
      <div
        className="hidden opacity-[0.05] blur-sm lg:block absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/united-logo-full.jpg')",
          transform: `translateY(${scrollY * 0.2}px)`,
        }}
      />
      
      {/* Mobile solid background */}
      <div className="absolute inset-0 bg-[#0c0907] lg:hidden"></div>

      <div className="relative z-10 flex min-h-screen flex-col lg:flex-row">
        <div className="relative flex w-full items-center justify-center bg-[#0f0b09] p-8 lg:w-1/2 lg:p-12">
          {/* Mobile background overlay to hide logo */}
          <div className="absolute inset-0 bg-[#0f0b09]/95 lg:bg-transparent" />
          <div className="relative z-10 w-full max-w-md">
            <div className="mb-8">
              <h2 className="mb-2 font-playfair text-4xl text-white">Let's Talk</h2>
              <p className="text-white/55">Ready to create something amazing?</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium uppercase tracking-[0.3em] text-white/70">
                    Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="border-white/15 bg-white/10 text-white placeholder:text-white/40 transition-all focus:border-white focus:bg-white/15"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="mb-2 block text-sm font-medium uppercase tracking-[0.3em] text-white/70">
                    Phone
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="border-white/15 bg-white/10 text-white placeholder:text-white/40 transition-all focus:border-white focus:bg-white/15"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium uppercase tracking-[0.3em] text-white/70">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="border-white/15 bg-white/10 text-white placeholder:text-white/40 transition-all focus:border-white focus:bg-white/15"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-medium uppercase tracking-[0.3em] text-white/70">
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your tattoo idea..."
                  required
                  className="resize-none border-white/15 bg-white/10 text-white placeholder:text-white/40 transition-all focus:border-white focus:bg-white/15"
                />
              </div>

              <Button
                type="submit"
                className="w-full rounded-full border border-white/15 bg-white/90 py-3 text-xs font-semibold uppercase tracking-[0.32em] text-[#1c1713] transition-all hover:bg-white"
              >
                Send Message
              </Button>
            </form>
          </div>
        </div>

        <div className="relative flex w-full items-center justify-center bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.07),transparent_55%),linear-gradient(180deg,#1a1512_0%,#110d0a_100%)] lg:w-1/2">
          {/* Brand asset as decorative element */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.08]"
            style={{
              backgroundImage: "url('/united-logo-text.png')",
              transform: `translateY(${scrollY * -0.1}px)`,
            }}
          />

          <div className="relative z-10 p-12 text-center">
            <div className="mb-12">
              <h2 className="font-playfair text-5xl text-white">UNITED</h2>
              <h3 className="mt-2 font-playfair text-3xl text-white/70">TATTOO</h3>
              <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-white/65">
                Where artistry, culture, and custom tattoos meet. Located in Fountain, just minutes from Colorado Springs.
              </p>
            </div>

            <div className="mx-auto max-w-sm space-y-6">
              {[
                {
                  icon: MapPin,
                  title: "Visit Us",
                  content: "5160 Fontaine Blvd, Fountain, CO 80817",
                },
                {
                  icon: Phone,
                  title: "Call Us",
                  content: "(719) 698-9004",
                },
                {
                  icon: Mail,
                  title: "Email Us",
                  content: "info@united-tattoo.com",
                },
                {
                  icon: Clock,
                  title: "Hours",
                  content: "Mon-Wed: 10AM-6PM, Thu-Sat: 10AM-8PM, Sun: 10AM-6PM",
                },
              ].map((item, index) => {
                const Icon = item.icon
                return (
                  <div key={index} className="flex items-start space-x-4 text-left">
                    <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10">
                      <Icon className="h-4 w-4 text-white/70" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/60">{item.title}</p>
                      <p className="mt-1 text-sm text-white/70">{item.content}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
