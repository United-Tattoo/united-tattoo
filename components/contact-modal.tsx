"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { User, MessageSquare, CheckCircle, Phone, Mail, Clock } from "lucide-react"

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

const urgencyLevels = [
  { value: "low", label: "Low - General inquiry", description: "Response within 24-48 hours" },
  { value: "medium", label: "Medium - Need info soon", description: "Response within 12-24 hours" },
  { value: "high", label: "High - Time sensitive", description: "Response within 2-6 hours" },
]

interface ContactModalProps {
  children: React.ReactNode
}

export function ContactModal({ children }: ContactModalProps) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const [formData, setFormData] = useState({
    // Step 1: Contact Info
    name: "",
    email: "",
    phone: "",
    preferredContact: "email",

    // Step 2: Inquiry Details
    inquiryType: "",
    urgency: "medium",
    subject: "",
    message: "",
    hasDeadline: false,
    deadline: "",

    // Step 3: Additional Info
    isExistingClient: false,
    referralSource: "",
    specialRequests: "",
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitted(true)
    setIsSubmitting(false)

    // Reset form after 3 seconds and close modal
    setTimeout(() => {
      setIsSubmitted(false)
      setStep(1)
      setFormData({
        name: "",
        email: "",
        phone: "",
        preferredContact: "email",
        inquiryType: "",
        urgency: "medium",
        subject: "",
        message: "",
        hasDeadline: false,
        deadline: "",
        isExistingClient: false,
        referralSource: "",
        specialRequests: "",
      })
      setOpen(false)
    }, 3000)
  }

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3))
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1))

  const selectedUrgency = urgencyLevels.find((level) => level.value === formData.urgency)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-playfair text-2xl">Get In Touch</DialogTitle>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNumber ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-12 h-0.5 mx-2 ${step > stepNumber ? "bg-primary" : "bg-muted"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {isSubmitted ? (
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Message Sent!</h3>
            <p className="text-muted-foreground mb-4">
              Thank you for contacting us. We'll get back to you within {selectedUrgency?.description.toLowerCase()}.
            </p>
            <div className="text-sm text-muted-foreground">
              <p>Reference ID: #{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Contact Information */}
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Contact Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name *</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Your full name"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Email *</label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone</label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Preferred Contact Method</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: "email", label: "Email", icon: Mail },
                        { value: "phone", label: "Phone", icon: Phone },
                        { value: "text", label: "Text", icon: MessageSquare },
                      ].map((method) => {
                        const Icon = method.icon
                        return (
                          <label
                            key={method.value}
                            className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                              formData.preferredContact === method.value
                                ? "border-primary bg-primary/5"
                                : "border-muted hover:border-primary/50"
                            }`}
                          >
                            <input
                              type="radio"
                              name="preferredContact"
                              value={method.value}
                              checked={formData.preferredContact === method.value}
                              onChange={(e) => handleInputChange("preferredContact", e.target.value)}
                              className="sr-only"
                            />
                            <Icon className="w-4 h-4" />
                            <span className="text-sm font-medium">{method.label}</span>
                          </label>
                        )
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Inquiry Details */}
            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="w-5 h-5" />
                    <span>Inquiry Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Inquiry Type *</label>
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
                      <label className="block text-sm font-medium mb-2">Urgency Level</label>
                      <Select value={formData.urgency} onValueChange={(value) => handleInputChange("urgency", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {urgencyLevels.map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                              <div className="flex flex-col">
                                <span className="font-medium">{level.label}</span>
                                <span className="text-xs text-muted-foreground">{level.description}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {selectedUrgency && (
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">Expected Response Time:</span>
                        <span className="text-sm text-muted-foreground">{selectedUrgency.description}</span>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium mb-2">Subject</label>
                    <Input
                      value={formData.subject}
                      onChange={(e) => handleInputChange("subject", e.target.value)}
                      placeholder="Brief description of your inquiry"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Message *</label>
                    <Textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      placeholder="Tell us about your tattoo idea, questions, or how we can help you..."
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.hasDeadline}
                        onChange={(e) => handleInputChange("hasDeadline", e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm">I have a specific deadline or event date</span>
                    </label>

                    {formData.hasDeadline && (
                      <div>
                        <label className="block text-sm font-medium mb-2">Deadline/Event Date</label>
                        <Input
                          type="date"
                          value={formData.deadline}
                          onChange={(e) => handleInputChange("deadline", e.target.value)}
                          min={new Date().toISOString().split("T")[0]}
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Review & Additional Info */}
            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>Review & Submit</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Contact Summary */}
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold mb-3">Contact Summary</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Name</p>
                        <p className="font-medium">{formData.name}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Email</p>
                        <p className="font-medium">{formData.email}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Phone</p>
                        <p className="font-medium">{formData.phone || "Not provided"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Preferred Contact</p>
                        <p className="font-medium capitalize">{formData.preferredContact}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Inquiry Type</p>
                        <p className="font-medium">{formData.inquiryType}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Urgency</p>
                        <p className="font-medium">{selectedUrgency?.label}</p>
                      </div>
                    </div>

                    {formData.subject && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-muted-foreground">Subject</p>
                        <p className="font-medium">{formData.subject}</p>
                      </div>
                    )}

                    <div className="mt-4 pt-4 border-t">
                      <p className="text-muted-foreground">Message</p>
                      <p className="font-medium">{formData.message}</p>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">Additional Information (Optional)</h4>

                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.isExistingClient}
                        onChange={(e) => handleInputChange("isExistingClient", e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm">I'm an existing client</span>
                    </label>

                    <div>
                      <label className="block text-sm font-medium mb-2">How did you hear about us?</label>
                      <Select
                        value={formData.referralSource}
                        onValueChange={(value) => handleInputChange("referralSource", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select source (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="google">Google Search</SelectItem>
                          <SelectItem value="instagram">Instagram</SelectItem>
                          <SelectItem value="facebook">Facebook</SelectItem>
                          <SelectItem value="friend">Friend/Family</SelectItem>
                          <SelectItem value="existing-client">Existing Client</SelectItem>
                          <SelectItem value="walk-by">Walked by the shop</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Special Requests or Notes</label>
                      <Textarea
                        rows={3}
                        value={formData.specialRequests}
                        onChange={(e) => handleInputChange("specialRequests", e.target.value)}
                        placeholder="Any special accommodations, accessibility needs, or additional information..."
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4">
              <Button type="button" variant="outline" onClick={prevStep} disabled={step === 1}>
                Previous
              </Button>

              {step < 3 ? (
                <Button type="button" onClick={nextStep}>
                  Next Step
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary/90"
                  disabled={isSubmitting || !formData.name || !formData.email || !formData.message}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              )}
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
