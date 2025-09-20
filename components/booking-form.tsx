"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useFeatureFlag } from "@/components/feature-flags-provider"
import { artists } from "@/data/artists"
import { CalendarIcon, DollarSign, MessageSquare, User } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"


const timeSlots = ["10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"]

const tattooSizes = [
  { size: "Small (2-4 inches)", duration: "1-2 hours", price: "150-300" },
  { size: "Medium (4-6 inches)", duration: "2-4 hours", price: "300-600" },
  { size: "Large (6+ inches)", duration: "4-6 hours", price: "600-1000" },
  { size: "Full Session", duration: "6-8 hours", price: "1000-1500" },
]

interface BookingFormProps {
  artistId?: string
}

export function BookingForm({ artistId }: BookingFormProps) {
  const [step, setStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    age: "",

    // Appointment Details
    artistId: artistId || "",
    preferredDate: "",
    preferredTime: "",
    alternateDate: "",
    alternateTime: "",

    // Tattoo Details
    tattooDescription: "",
    tattooSize: "",
    placement: "",
    isFirstTattoo: false,
    hasAllergies: false,
    allergyDetails: "",
    referenceImages: "",

    // Additional Info
    specialRequests: "",
    depositAmount: 100,
    agreeToTerms: false,
    agreeToDeposit: false,
  })

  const selectedArtist = artists.find((a) => String(a.id) === formData.artistId || a.slug === formData.artistId)
  const selectedSize = tattooSizes.find((size) => size.size === formData.tattooSize)
  const bookingEnabled = useFeatureFlag("BOOKING_ENABLED")

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!bookingEnabled) {
      // Safety: no-op when disabled
      return
    }
    // Handle form submission
    console.log("Booking submitted:", formData)
    // In a real app, this would send data to your backend
  }

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4))
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1))

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4">Book Your Appointment</h1>
          <p className="text-lg text-muted-foreground">
            Let's create something amazing together. Fill out the form below to schedule your tattoo session.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNumber ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {stepNumber}
                </div>
                {stepNumber < 4 && (
                  <div className={`w-12 h-0.5 mx-2 ${step > stepNumber ? "bg-primary" : "bg-muted"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Booking disabled notice */}
        {!bookingEnabled && (
          <div className="mb-6 text-center text-sm" role="status" aria-live="polite">
            Online booking is temporarily unavailable. Please
            {" "}
            <Link href="/contact" className="underline">
              contact the studio
            </Link>
            .
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Step 1: Personal Information */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Personal Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name *</label>
                    <Input
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name *</label>
                    <Input
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone *</label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Age *</label>
                    <Input
                      type="number"
                      min="18"
                      value={formData.age}
                      onChange={(e) => handleInputChange("age", e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">Must be 18 or older</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="firstTattoo"
                    checked={formData.isFirstTattoo}
                    onCheckedChange={(checked) => handleInputChange("isFirstTattoo", checked)}
                  />
                  <label htmlFor="firstTattoo" className="text-sm">
                    This is my first tattoo
                  </label>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="allergies"
                      checked={formData.hasAllergies}
                      onCheckedChange={(checked) => handleInputChange("hasAllergies", checked)}
                    />
                    <label htmlFor="allergies" className="text-sm">
                      I have allergies or medical conditions
                    </label>
                  </div>

                  {formData.hasAllergies && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Please specify:</label>
                      <Textarea
                        value={formData.allergyDetails}
                        onChange={(e) => handleInputChange("allergyDetails", e.target.value)}
                        placeholder="Please describe any allergies, medical conditions, or medications..."
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Artist & Scheduling */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CalendarIcon className="w-5 h-5" />
                  <span>Artist & Scheduling</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Select Artist *</label>
                  <Select value={formData.artistId} onValueChange={(value) => handleInputChange("artistId", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose your preferred artist" />
                    </SelectTrigger>
                    <SelectContent>
                      {artists.map((artist) => (
                        <SelectItem key={artist.slug} value={artist.slug}>
                          <div className="flex items-center justify-between w-full">
                            <div>
                              <p className="font-medium">{artist.name}</p>
                              <p className="text-sm text-muted-foreground">{artist.specialty}</p>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedArtist && (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">{selectedArtist.name}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{selectedArtist.specialty}</p>
                    <p className="text-sm">
                      Experience: <span className="font-medium">{selectedArtist.experience}</span>
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Preferred Date *</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          initialFocus
                          disabled={(date) => date < new Date() || date.getDay() === 0} // Disable past dates and Sundays
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Preferred Time *</label>
                    <Select
                      value={formData.preferredTime}
                      onValueChange={(value) => handleInputChange("preferredTime", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium mb-2 text-blue-900">Alternative Date & Time</h4>
                  <p className="text-sm text-blue-700 mb-4">
                    Please provide an alternative in case your preferred slot is unavailable.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Alternative Date</label>
                      <Input
                        type="date"
                        value={formData.alternateDate}
                        onChange={(e) => handleInputChange("alternateDate", e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Alternative Time</label>
                      <Select
                        value={formData.alternateTime}
                        onValueChange={(value) => handleInputChange("alternateTime", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Tattoo Details */}
          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5" />
                  <span>Tattoo Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Tattoo Description *</label>
                  <Textarea
                    value={formData.tattooDescription}
                    onChange={(e) => handleInputChange("tattooDescription", e.target.value)}
                    placeholder="Describe your tattoo idea in detail. Include style, colors, themes, and any specific elements you want..."
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Estimated Size & Duration *</label>
                  <Select value={formData.tattooSize} onValueChange={(value) => handleInputChange("tattooSize", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tattoo size" />
                    </SelectTrigger>
                    <SelectContent>
                      {tattooSizes.map((size) => (
                        <SelectItem key={size.size} value={size.size}>
                          <div className="flex flex-col">
                            <span className="font-medium">{size.size}</span>
                            <span className="text-sm text-muted-foreground">
                              {size.duration} • ${size.price}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedSize && (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">Size Details</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Size</p>
                        <p className="font-medium">{selectedSize.size}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Duration</p>
                        <p className="font-medium">{selectedSize.duration}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Price Range</p>
                        <p className="font-medium">${selectedSize.price}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">Placement on Body *</label>
                  <Input
                    value={formData.placement}
                    onChange={(e) => handleInputChange("placement", e.target.value)}
                    placeholder="e.g., Upper arm, forearm, shoulder, back, etc."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Reference Images</label>
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleInputChange("referenceImages", e.target.files)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload reference images to help your artist understand your vision
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Special Requests</label>
                  <Textarea
                    value={formData.specialRequests}
                    onChange={(e) => handleInputChange("specialRequests", e.target.value)}
                    placeholder="Any special requests, concerns, or additional information..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Review & Deposit */}
          {step === 4 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5" />
                  <span>Review & Deposit</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Booking Summary */}
                <div className="p-6 bg-muted/50 rounded-lg">
                  <h3 className="font-playfair text-xl font-bold mb-4">Booking Summary</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Client</p>
                        <p className="font-medium">
                          {formData.firstName} {formData.lastName}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{formData.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">{formData.phone}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Artist</p>
                        <p className="font-medium">{selectedArtist?.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Preferred Date</p>
                        <p className="font-medium">{selectedDate ? format(selectedDate, "PPP") : "Not selected"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Preferred Time</p>
                        <p className="font-medium">{formData.preferredTime || "Not selected"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t">
                    <div>
                      <p className="text-sm text-muted-foreground">Tattoo Description</p>
                      <p className="font-medium">{formData.tattooDescription}</p>
                    </div>
                    <div className="mt-3">
                      <p className="text-sm text-muted-foreground">Size & Placement</p>
                      <p className="font-medium">
                        {formData.tattooSize} • {formData.placement}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Deposit Information */}
                <div className="p-6 border-2 border-primary/20 rounded-lg">
                  <h3 className="font-semibold mb-4 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-primary" />
                    Deposit Required
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    A deposit of <span className="font-bold text-primary">${formData.depositAmount}</span> is required
                    to secure your appointment. This deposit will be applied to your final tattoo cost.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Deposit is non-refundable but transferable to future appointments</li>
                    <li>• 48-hour notice required for rescheduling</li>
                    <li>• Final pricing will be discussed during consultation</li>
                  </ul>
                </div>

                {/* Terms and Conditions */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked)}
                      required
                    />
                    <label htmlFor="terms" className="text-sm leading-relaxed">
                      I agree to the{" "}
                      <Link href="/terms" className="text-primary hover:underline">
                        Terms and Conditions
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="deposit"
                      checked={formData.agreeToDeposit}
                      onCheckedChange={(checked) => handleInputChange("agreeToDeposit", checked)}
                      required
                    />
                    <label htmlFor="deposit" className="text-sm leading-relaxed">
                      I understand and agree to the deposit policy outlined above
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button type="button" variant="outline" onClick={prevStep} disabled={step === 1}>
              Previous
            </Button>

            {step < 4 ? (
              <Button type="button" onClick={nextStep}>
                Next Step
              </Button>
            ) : (
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90"
                disabled={!formData.agreeToTerms || !formData.agreeToDeposit || !bookingEnabled}
              >
                Submit Booking & Pay Deposit
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
