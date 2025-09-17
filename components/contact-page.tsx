"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, MessageSquare, Calendar } from "lucide-react"
import Link from "next/link"

const contactMethods = [
  {
    icon: Phone,
    title: "Phone",
    value: "(555) 123-TATT",
    description: "Call us during business hours",
    action: "tel:+15551238288",
  },
  {
    icon: Mail,
    title: "Email",
    value: "info@unitedtattoo.com",
    description: "We respond within 24 hours",
    action: "mailto:info@unitedtattoo.com",
  },
  {
    icon: Instagram,
    title: "Instagram",
    value: "@unitedtattoo",
    description: "Follow for latest work",
    action: "https://instagram.com/unitedtattoo",
  },
  {
    icon: MessageSquare,
    title: "Text/SMS",
    value: "(555) 123-TATT",
    description: "Text for quick questions",
    action: "sms:+15551238288",
  },
]

const businessHours = [
  { day: "Monday", hours: "12:00 PM - 8:00 PM", status: "open" },
  { day: "Tuesday", hours: "12:00 PM - 8:00 PM", status: "open" },
  { day: "Wednesday", hours: "12:00 PM - 8:00 PM", status: "open" },
  { day: "Thursday", hours: "12:00 PM - 8:00 PM", status: "open" },
  { day: "Friday", hours: "12:00 PM - 8:00 PM", status: "open" },
  { day: "Saturday", hours: "10:00 AM - 6:00 PM", status: "open" },
  { day: "Sunday", hours: "Closed", status: "closed" },
]

const inquiryTypes = [
  "General Question",
  "Booking Consultation",
  "Pricing Information",
  "Aftercare Support",
  "Portfolio Inquiry",
  "Custom Design",
  "Touch-up Request",
  "Other",
]

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    inquiryType: "",
    subject: "",
    message: "",
    preferredContact: "email",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitted(true)
    setIsSubmitting(false)

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({
        name: "",
        email: "",
        phone: "",
        inquiryType: "",
        subject: "",
        message: "",
        preferredContact: "email",
      })
    }, 3000)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-6">Get In Touch</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Ready to start your tattoo journey? Have questions about our services? We're here to help. Reach out using
            any of the methods below.
          </p>
        </div>

        {/* Quick Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {contactMethods.map((method, index) => {
            const Icon = method.icon
            return (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1">{method.title}</h3>
                  <p className="text-primary font-medium mb-2">{method.value}</p>
                  <p className="text-sm text-muted-foreground mb-4">{method.description}</p>
                  <Button asChild size="sm" variant="outline">
                    <Link href={method.action}>Contact</Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="font-playfair text-2xl">Send us a Message</CardTitle>
                <p className="text-muted-foreground">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <MessageSquare className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Message Sent!</h3>
                    <p className="text-muted-foreground">
                      Thank you for contacting us. We'll get back to you within 24 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-2">
                          Name *
                        </label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium mb-2">
                          Phone
                        </label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email *
                      </label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="inquiryType" className="block text-sm font-medium mb-2">
                        Inquiry Type
                      </label>
                      <Select
                        value={formData.inquiryType}
                        onValueChange={(value) => handleInputChange("inquiryType", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select inquiry type" />
                        </SelectTrigger>
                        <SelectContent>
                          {inquiryTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium mb-2">
                        Subject
                      </label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => handleInputChange("subject", e.target.value)}
                        placeholder="Brief description of your inquiry"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2">
                        Message *
                      </label>
                      <Textarea
                        id="message"
                        rows={5}
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        placeholder="Tell us about your tattoo idea, questions, or how we can help you..."
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Preferred Contact Method</label>
                      <div className="flex space-x-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="preferredContact"
                            value="email"
                            checked={formData.preferredContact === "email"}
                            onChange={(e) => handleInputChange("preferredContact", e.target.value)}
                            className="mr-2"
                          />
                          Email
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="preferredContact"
                            value="phone"
                            checked={formData.preferredContact === "phone"}
                            onChange={(e) => handleInputChange("preferredContact", e.target.value)}
                            className="mr-2"
                          />
                          Phone
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="preferredContact"
                            value="text"
                            checked={formData.preferredContact === "text"}
                            onChange={(e) => handleInputChange("preferredContact", e.target.value)}
                            className="mr-2"
                          />
                          Text
                        </label>
                      </div>
                    </div>

                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting}>
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Studio Info & Map */}
          <div className="space-y-8">
            {/* Studio Information */}
            <Card>
              <CardHeader>
                <CardTitle className="font-playfair text-2xl">Visit Our Studio</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-muted-foreground">
                      123 Ink Street
                      <br />
                      Downtown District
                      <br />
                      City, State 12345
                    </p>
                    <Button asChild variant="link" className="p-0 h-auto text-primary">
                      <Link href="https://maps.google.com" target="_blank">
                        Get Directions
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-muted-foreground">(555) 123-TATT</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">info@unitedtattoo.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium mb-3">Business Hours</p>
                    <div className="space-y-2">
                      {businessHours.map((schedule, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <span className="font-medium">{schedule.day}</span>
                          <div className="flex items-center space-x-2">
                            <span className={schedule.status === "closed" ? "text-muted-foreground" : ""}>
                              {schedule.hours}
                            </span>
                            {schedule.status === "open" && (
                              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                Open
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div>
                  <p className="font-medium mb-3">Follow Us</p>
                  <div className="flex space-x-4">
                    <Button asChild variant="outline" size="sm">
                      <Link href="https://instagram.com/unitedtattoo" target="_blank">
                        <Instagram className="w-4 h-4 mr-2" />
                        Instagram
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link href="https://facebook.com/unitedtattoo" target="_blank">
                        <Facebook className="w-4 h-4 mr-2" />
                        Facebook
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Google Maps */}
            <Card>
              <CardHeader>
                <CardTitle className="font-playfair text-xl">Find Us</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="w-full h-80 bg-muted rounded-lg overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.1234567890123!2d-74.0059413!3d40.7127753!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQyJzQ2LjAiTiA3NMKwMDAnMjEuNCJX!5e0!3m2!1sen!2sus!4v1234567890123"
                    width="100%"
                    height="320"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="United Tattoo Location"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-primary text-primary-foreground">
                <CardContent className="p-4 text-center">
                  <Calendar className="w-6 h-6 mx-auto mb-2" />
                  <h4 className="font-semibold mb-1">Book Appointment</h4>
                  <p className="text-xs opacity-90 mb-3">Schedule your tattoo session</p>
                  <Button asChild className="bg-white text-black hover:bg-gray-100 !text-black" size="sm">
                    <Link href="/book">Book Now</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-secondary text-secondary-foreground">
                <CardContent className="p-4 text-center">
                  <MessageSquare className="w-6 h-6 mx-auto mb-2" />
                  <h4 className="font-semibold mb-1">Quick Question?</h4>
                  <p className="text-xs opacity-90 mb-3">Text us for fast answers</p>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="border-white text-white hover:bg-white hover:text-secondary bg-transparent"
                  >
                    <Link href="sms:+15551238288">Text Us</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="font-playfair text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">How do I book an appointment?</h3>
                <p className="text-muted-foreground text-sm">
                  You can book online through our booking form, call us during business hours, or visit the studio in
                  person. A deposit is required to secure your appointment.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Do you accept walk-ins?</h3>
                <p className="text-muted-foreground text-sm">
                  We have limited walk-in availability on Tuesdays and Thursdays from 2-6 PM for small tattoos and
                  consultations. Appointments are recommended.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">What should I bring to my appointment?</h3>
                <p className="text-muted-foreground text-sm">
                  Bring a valid ID, reference images if you have them, and wear comfortable clothing that provides easy
                  access to the tattoo area.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">How far in advance should I book?</h3>
                <p className="text-muted-foreground text-sm">
                  We recommend booking 2-4 weeks in advance, especially for larger pieces or specific artists. Popular
                  time slots fill up quickly.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
