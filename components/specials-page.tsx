import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Percent, Calendar, Users, Star, Clock, Gift } from "lucide-react"
import Link from "next/link"

const currentSpecials = [
  {
    title: "First Tattoo Special",
    discount: "20% OFF",
    description: "Perfect for first-time clients ready to start their tattoo journey",
    details: [
      "Valid for tattoos under 4 hours",
      "Includes free consultation",
      "Must mention at booking",
      "Cannot combine with other offers",
    ],
    validUntil: "March 31, 2024",
    icon: Star,
    color: "bg-primary",
  },
  {
    title: "Flash Friday",
    discount: "$50 OFF",
    description: "Choose from our curated flash designs every Friday",
    details: [
      "Pre-designed flash sheets available",
      "Walk-ins welcome 2-6 PM",
      "First come, first served",
      "Small to medium sizes only",
    ],
    validUntil: "Every Friday",
    icon: Clock,
    color: "bg-secondary",
  },
  {
    title: "Referral Reward",
    discount: "$75 CREDIT",
    description: "Refer a friend and both get rewarded",
    details: [
      "Friend must complete their tattoo",
      "Credit applied to your next session",
      "No limit on referrals",
      "Friend gets 10% off their first tattoo",
    ],
    validUntil: "Ongoing",
    icon: Users,
    color: "bg-accent",
  },
]

const seasonalOffers = [
  {
    title: "Spring Touch-Up Special",
    description: "Refresh your existing tattoos for the warmer months",
    offer: "Free consultation + 15% off touch-ups",
    period: "March - May",
  },
  {
    title: "Summer Color Pop",
    description: "Add vibrant colors to existing black and grey pieces",
    offer: "20% off color additions",
    period: "June - August",
  },
  {
    title: "Fall Portfolio Building",
    description: "Help our apprentices build their portfolios",
    offer: "Discounted rates on select designs",
    period: "September - November",
  },
  {
    title: "Holiday Gift Cards",
    description: "Perfect gifts for tattoo enthusiasts",
    offer: "Buy $200+ gift card, get $25 bonus",
    period: "December - January",
  },
]

const membershipBenefits = [
  {
    title: "VIP Membership",
    price: "$50/year",
    benefits: [
      "10% off all tattoos",
      "Priority booking",
      "Free touch-ups within 6 months",
      "Exclusive flash designs",
      "Birthday month special",
    ],
  },
  {
    title: "Collector's Club",
    price: "$100/year",
    benefits: [
      "15% off all tattoos",
      "Skip the deposit on bookings",
      "Free aftercare products",
      "Private portfolio previews",
      "Annual appreciation event invite",
    ],
  },
]

export function SpecialsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-6">Current Specials & Offers</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Take advantage of our current promotions and special offers. Save on your next tattoo while getting the same
            high-quality work from our talented artists.
          </p>
        </div>

        {/* Important Notice */}
        <Alert className="mb-8 border-primary/20 bg-primary/5">
          <Percent className="h-4 w-4 text-primary" />
          <AlertDescription>
            <strong>Limited Time:</strong> All specials are subject to availability and cannot be combined with other
            offers unless specified. Book early to secure your spot!
          </AlertDescription>
        </Alert>

        {/* Current Specials */}
        <div className="mb-12">
          <h2 className="font-playfair text-3xl font-bold mb-8 text-center">Featured Specials</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {currentSpecials.map((special, index) => {
              const Icon = special.icon
              return (
                <Card key={index} className="relative overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className={`absolute top-0 right-0 ${special.color} text-white px-3 py-1 text-sm font-bold`}>
                    {special.discount}
                  </div>
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`p-2 rounded-full ${special.color} text-white`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <CardTitle className="font-playfair text-xl">{special.title}</CardTitle>
                    </div>
                    <p className="text-muted-foreground">{special.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-4">
                      {special.details.map((detail, idx) => (
                        <li key={idx} className="text-sm flex items-start space-x-2">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        Valid until {special.validUntil}
                      </Badge>
                      <Button size="sm" className="bg-white text-black hover:bg-gray-100 !text-black">
                        Book Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Seasonal Offers */}
        <div className="mb-12">
          <h2 className="font-playfair text-3xl font-bold mb-8 text-center">Seasonal Offers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {seasonalOffers.map((offer, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-playfair text-xl font-bold">{offer.title}</h3>
                    <Badge variant="secondary">{offer.period}</Badge>
                  </div>
                  <p className="text-muted-foreground mb-3">{offer.description}</p>
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <p className="font-semibold text-primary">{offer.offer}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Membership Programs */}
        <div className="mb-12">
          <h2 className="font-playfair text-3xl font-bold mb-8 text-center">Membership Programs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {membershipBenefits.map((membership, index) => (
              <Card key={index} className="relative hover:shadow-xl transition-all duration-300">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Gift className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="font-playfair text-2xl">{membership.title}</CardTitle>
                  <div className="text-3xl font-bold text-primary">{membership.price}</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {membership.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <Star className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                        <span className="text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-6 bg-primary hover:bg-primary/90">Join Now</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Terms and Conditions */}
        <Card className="mb-12 border-muted">
          <CardHeader>
            <CardTitle className="font-playfair text-xl">Terms & Conditions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-muted-foreground">
              <div>
                <h4 className="font-semibold text-foreground mb-2">General Terms</h4>
                <ul className="space-y-1">
                  <li>• Specials cannot be combined unless stated</li>
                  <li>• Valid ID required for all appointments</li>
                  <li>• Deposits still required for all bookings</li>
                  <li>• Subject to artist availability</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Booking Requirements</h4>
                <ul className="space-y-1">
                  <li>• Must mention special at time of booking</li>
                  <li>• Cannot be applied to existing bookings</li>
                  <li>• Some restrictions may apply</li>
                  <li>• Management reserves right to modify offers</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-6 text-center">
              <Calendar className="w-8 h-8 mx-auto mb-4" />
              <h3 className="font-playfair text-xl font-bold mb-2">Ready to Save?</h3>
              <p className="mb-4 opacity-90">Book your appointment and mention your preferred special</p>
              <Button
                asChild
                className="bg-white !bg-white text-black !text-black hover:bg-gray-100 hover:!text-black border border-gray-200"
              >
                <Link href="/book">Book Now</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-secondary text-secondary-foreground">
            <CardContent className="p-6 text-center">
              <Gift className="w-8 h-8 mx-auto mb-4" />
              <h3 className="font-playfair text-xl font-bold mb-2">Gift Cards Available</h3>
              <p className="mb-4 opacity-90">Perfect for tattoo enthusiasts in your life</p>
              <Button
                asChild
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-black bg-transparent"
              >
                <Link href="/gift-cards">Buy Gift Cards</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
