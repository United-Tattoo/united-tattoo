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
    <section id="contact" className="min-h-screen bg-black relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03] bg-cover bg-center bg-no-repeat blur-sm"
        style={{
          backgroundImage: "url('/united-logo-full.jpg')",
          transform: `translateY(${scrollY * 0.2}px)`,
        }}
      />

      <div className="flex min-h-screen relative z-10">
        <div className="w-1/2 bg-black flex items-center justify-center p-12">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-white mb-2">Let's Talk</h2>
              <p className="text-gray-400">Ready to create something amazing?</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                    Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-white focus:bg-white/15 transition-all"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-white mb-2">
                    Phone
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-white focus:bg-white/15 transition-all"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-white focus:bg-white/15 transition-all"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-white mb-2">
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
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-white focus:bg-white/15 transition-all resize-none"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-white text-black hover:bg-gray-100 py-3 text-base font-medium transition-all"
              >
                Send Message
              </Button>
            </form>
          </div>
        </div>

        <div className="w-1/2 bg-gray-50 relative flex items-center justify-center">
          {/* Brand asset as decorative element */}
          <div
            className="absolute inset-0 opacity-20 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/united-logo-text.png')",
              transform: `translateY(${scrollY * -0.1}px)`,
            }}
          />

          <div className="relative z-10 p-12 text-center">
            <div className="mb-12">
              <h2 className="text-5xl font-bold text-black mb-4">UNITED</h2>
              <h3 className="text-3xl font-bold text-gray-600 mb-6">TATTOO</h3>
              <p className="text-gray-700 text-lg max-w-md mx-auto leading-relaxed">
                Where artistry, culture, and custom tattoos meet. Located in Fountain, just minutes from Colorado Springs.
              </p>
            </div>

            <div className="space-y-6 max-w-sm mx-auto">
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
                    <Icon className="w-5 h-5 text-black mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-black font-medium text-sm">{item.title}</p>
                      <p className="text-gray-600 text-sm">{item.content}</p>
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
