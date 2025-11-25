"use client"

import { useState, useEffect } from "react"
import { StickySplit } from "./sticky-split"
import { SectionLabel } from "./section-label"
import { FormContainer } from "./form-container"
import { FormField, Input, Textarea } from "./form-field"
import { Button } from "./button"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

export function NewContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you'd handle submission here or use server actions
    console.log("Form submitted:", formData)
    alert("Thank you. We will be in touch shortly.")
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <section id="contact" className="py-[clamp(3.5rem,6vw,6rem)] px-[clamp(1.5rem,4vw,5rem)] max-w-[1600px] mx-auto">
      <StickySplit
        sidebar={
          <div className="space-y-8">
             <div>
                <SectionLabel>04 • Booking</SectionLabel>
                <h2 className="font-serif text-[clamp(1.9rem,4vw,3rem)] leading-[1.15] text-[var(--ink)] mb-4">
                  Begin your commission.
                </h2>
                <p className="text-[clamp(0.95rem,2vw,1.3rem)] leading-[1.65] text-[var(--ink)]/75">
                  Ready to create something amazing? Fill out the brief to get started.
                </p>
             </div>

            <div className="space-y-6 pt-8 border-t border-[var(--ink)]/10">
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
                    <div className="p-2 bg-[var(--white)] rounded-lg shadow-sm">
                       <Icon className="w-4 h-4 text-[var(--burnt)]" />
                    </div>
                    <div>
                      <p className="text-[var(--ink)] font-medium text-sm uppercase tracking-wider mb-1">{item.title}</p>
                      <p className="text-[var(--ink)]/70 text-sm">{item.content}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        }
      >
        <FormContainer onSubmit={handleSubmit}>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <FormField label="Full Name">
                <Input 
                  name="name"
                  placeholder="Eden Morales"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
             </FormField>
             <FormField label="Phone">
                <Input 
                  name="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={formData.phone}
                  onChange={handleChange}
                />
             </FormField>
           </div>

           <FormField label="Email Address">
              <Input 
                name="email"
                type="email"
                placeholder="eden@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
           </FormField>

           <FormField label="Concept Notes">
              <Textarea 
                name="message"
                rows={5}
                placeholder="Describe your idea, placement, and scale..."
                value={formData.message}
                onChange={handleChange}
                required
              />
           </FormField>

           <div className="pt-4">
              <Button type="submit" variant="primary" className="w-full md:w-auto">
                 Submit Brief
              </Button>
           </div>
        </FormContainer>
      </StickySplit>
    </section>
  )
}
