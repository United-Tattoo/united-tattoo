"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Gift, CreditCard, Mail, Star, Check } from "lucide-react"

const giftCardAmounts = [
  { amount: 100, popular: false, description: "Perfect for small tattoos" },
  { amount: 200, popular: true, description: "Great for medium pieces" },
  { amount: 300, popular: false, description: "Ideal for larger tattoos" },
  { amount: 500, popular: false, description: "Perfect for full sessions" },
]

const deliveryMethods = [
  {
    method: "email",
    title: "Email Delivery",
    description: "Instant delivery to recipient's email",
    icon: Mail,
    time: "Instant",
  },
  {
    method: "physical",
    title: "Physical Card",
    description: "Beautiful printed card mailed to address",
    icon: Gift,
    time: "3-5 business days",
  },
]

const giftCardFeatures = [
  "No expiration date",
  "Transferable to others",
  "Can be used for any service",
  "Remaining balance carries over",
  "Lost card replacement available",
  "Online balance checking",
]

export function GiftCardsPage() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(200)
  const [customAmount, setCustomAmount] = useState("")
  const [deliveryMethod, setDeliveryMethod] = useState("email")
  const [formData, setFormData] = useState({
    // Purchaser Info
    buyerName: "",
    buyerEmail: "",
    buyerPhone: "",

    // Recipient Info
    recipientName: "",
    recipientEmail: "",
    recipientPhone: "",
    recipientAddress: "",

    // Gift Card Details
    personalMessage: "",
    deliveryDate: "",
    isGift: true,
  })

  const [isProcessing, setIsProcessing] = useState(false)

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const finalAmount = selectedAmount || Number.parseInt(customAmount) || 0

  const handlePurchase = async () => {
    setIsProcessing(true)

    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Simulate successful purchase
    console.log("Simulated gift card purchase:", {
      amount: finalAmount,
      delivery: deliveryMethod,
      ...formData,
    })

    setIsProcessing(false)

    alert(
      `Gift card purchase successful! A ${finalAmount >= 200 ? `$${finalAmount + 25}` : `$${finalAmount}`} gift card will be ${deliveryMethod === "email" ? "emailed" : "mailed"} ${formData.isGift ? `to ${formData.recipientName}` : "to you"}.`,
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-6">Gift Cards</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Give the gift of exceptional tattoo artistry. Perfect for birthdays, holidays, or any special occasion. Our
            gift cards never expire and can be used for any service.
          </p>
        </div>

        {/* Special Offer Alert */}
        <Alert className="mb-8 border-primary/20 bg-primary/5">
          <Gift className="h-4 w-4 text-primary" />
          <AlertDescription>
            <strong>Holiday Special:</strong> Purchase a $200+ gift card and receive a $25 bonus card free! Limited time
            offer.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Gift Card Selection */}
          <div className="lg:col-span-2 space-y-8">
            {/* Amount Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="font-playfair text-2xl">Choose Amount</CardTitle>
                <p className="text-muted-foreground">Select a preset amount or enter a custom value</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {giftCardAmounts.map((option) => (
                    <div
                      key={option.amount}
                      className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedAmount === option.amount
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => {
                        setSelectedAmount(option.amount)
                        setCustomAmount("")
                      }}
                    >
                      {option.popular && (
                        <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary">
                          Popular
                        </Badge>
                      )}
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">${option.amount}</div>
                        <p className="text-xs text-muted-foreground mt-1">{option.description}</p>
                      </div>
                      {selectedAmount === option.amount && (
                        <Check className="absolute top-2 right-2 w-5 h-5 text-primary" />
                      )}
                    </div>
                  ))}
                </div>

                <div className="border-t pt-6">
                  <label className="block text-sm font-medium mb-2">Custom Amount</label>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-medium">$</span>
                    <Input
                      type="number"
                      min="25"
                      max="1000"
                      placeholder="Enter amount"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value)
                        setSelectedAmount(null)
                      }}
                      className="max-w-32"
                    />
                    <span className="text-sm text-muted-foreground">($25 minimum)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Method */}
            <Card>
              <CardHeader>
                <CardTitle className="font-playfair text-2xl">Delivery Method</CardTitle>
                <p className="text-muted-foreground">How would you like to send the gift card?</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {deliveryMethods.map((method) => {
                    const Icon = method.icon
                    return (
                      <div
                        key={method.method}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                          deliveryMethod === method.method
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => setDeliveryMethod(method.method)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="p-2 bg-primary/10 rounded-full">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">{method.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2">{method.description}</p>
                            <Badge variant="outline" className="text-xs">
                              {method.time}
                            </Badge>
                          </div>
                          {deliveryMethod === method.method && <Check className="w-5 h-5 text-primary" />}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recipient Information */}
            <Card>
              <CardHeader>
                <CardTitle className="font-playfair text-2xl">Recipient Information</CardTitle>
                <p className="text-muted-foreground">Who is this gift card for?</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-2 mb-4">
                  <input
                    type="checkbox"
                    id="isGift"
                    checked={formData.isGift}
                    onChange={(e) => handleInputChange("isGift", e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="isGift" className="text-sm">
                    This is a gift for someone else
                  </label>
                </div>

                {formData.isGift ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Recipient Name *</label>
                        <Input
                          value={formData.recipientName}
                          onChange={(e) => handleInputChange("recipientName", e.target.value)}
                          placeholder="Gift recipient's name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Recipient Email *</label>
                        <Input
                          type="email"
                          value={formData.recipientEmail}
                          onChange={(e) => handleInputChange("recipientEmail", e.target.value)}
                          placeholder="recipient@email.com"
                          required
                        />
                      </div>
                    </div>

                    {deliveryMethod === "physical" && (
                      <div>
                        <label className="block text-sm font-medium mb-2">Mailing Address *</label>
                        <Textarea
                          value={formData.recipientAddress}
                          onChange={(e) => handleInputChange("recipientAddress", e.target.value)}
                          placeholder="Full mailing address for physical card delivery"
                          rows={3}
                          required
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium mb-2">Personal Message</label>
                      <Textarea
                        value={formData.personalMessage}
                        onChange={(e) => handleInputChange("personalMessage", e.target.value)}
                        placeholder="Add a personal message to the gift card (optional)"
                        rows={3}
                        maxLength={200}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {formData.personalMessage.length}/200 characters
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Delivery Date (Optional)</label>
                      <Input
                        type="date"
                        value={formData.deliveryDate}
                        onChange={(e) => handleInputChange("deliveryDate", e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                      />
                      <p className="text-xs text-muted-foreground mt-1">Leave blank for immediate delivery</p>
                    </div>
                  </>
                ) : (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      The gift card will be sent to your email address after purchase.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Purchaser Information */}
            <Card>
              <CardHeader>
                <CardTitle className="font-playfair text-2xl">Your Information</CardTitle>
                <p className="text-muted-foreground">We need your details for the purchase</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Your Name *</label>
                    <Input
                      value={formData.buyerName}
                      onChange={(e) => handleInputChange("buyerName", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Your Email *</label>
                    <Input
                      type="email"
                      value={formData.buyerEmail}
                      onChange={(e) => handleInputChange("buyerEmail", e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <Input
                    type="tel"
                    value={formData.buyerPhone}
                    onChange={(e) => handleInputChange("buyerPhone", e.target.value)}
                    placeholder="For order confirmation"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary & Features */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="font-playfair text-xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Gift Card Amount</span>
                  <span className="font-semibold">${finalAmount}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span>Delivery Method</span>
                  <span className="text-sm text-muted-foreground">
                    {deliveryMethod === "email" ? "Email" : "Physical Card"}
                  </span>
                </div>

                {deliveryMethod === "physical" && (
                  <div className="flex justify-between items-center">
                    <span>Shipping</span>
                    <span className="text-sm">Free</span>
                  </div>
                )}

                {finalAmount >= 200 && (
                  <div className="flex justify-between items-center text-green-600">
                    <span>Bonus Card</span>
                    <span className="font-semibold">+$25</span>
                  </div>
                )}

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total Value</span>
                    <span>${finalAmount >= 200 ? finalAmount + 25 : finalAmount}</span>
                  </div>
                </div>

                <Button
                  className="w-full bg-primary hover:bg-primary/90"
                  size="lg"
                  onClick={handlePurchase}
                  disabled={!finalAmount || finalAmount < 25 || isProcessing}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  {isProcessing ? "Processing..." : `Purchase Gift Card - $${finalAmount}`}
                </Button>

                <p className="text-xs text-muted-foreground text-center">Secure payment integration (demo mode)</p>
              </CardContent>
            </Card>

            {/* Gift Card Features */}
            <Card>
              <CardHeader>
                <CardTitle className="font-playfair text-xl">Gift Card Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {giftCardFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <Star className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Help Section */}
            <Card>
              <CardHeader>
                <CardTitle className="font-playfair text-xl">Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Have questions about gift cards? We're here to help!
                </p>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    <Mail className="w-4 h-4 mr-2" />
                    Email Support
                  </Button>
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    <Gift className="w-4 h-4 mr-2" />
                    Call (555) 123-TATT
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="font-playfair text-3xl font-bold mb-8 text-center">Gift Card FAQ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Do gift cards expire?</h3>
                <p className="text-muted-foreground text-sm">
                  No! Our gift cards never expire and can be used at any time for any of our services.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Can gift cards be transferred?</h3>
                <p className="text-muted-foreground text-sm">
                  Yes, gift cards can be transferred to another person. Just contact us with the details.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">What if I lose my gift card?</h3>
                <p className="text-muted-foreground text-sm">
                  We can replace lost gift cards with proof of purchase. Keep your confirmation email safe!
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Can I check my gift card balance?</h3>
                <p className="text-muted-foreground text-sm">
                  Yes! You can check your balance online using your gift card number or call us anytime.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
