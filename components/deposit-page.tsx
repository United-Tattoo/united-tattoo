"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  CreditCard,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  ShoppingBag,
  Shield,
  X
} from "lucide-react"
import Link from "next/link"

export function DepositPage() {
  const [activeTab, setActiveTab] = useState("policy")

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]">
          <img
            src="/united-logo-full.jpg"
            alt=""
            loading="lazy"
            className="w-full h-full object-cover object-center scale-150 blur-[2px]"
          />
        </div>

        <div className="relative z-10 pt-32 pb-20 px-8 lg:px-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-playfair text-5xl lg:text-7xl font-bold mb-6 tracking-tight">
              LET&apos;S MAKE IT OFFICIAL...
            </h1>
            <h2 className="text-2xl lg:text-3xl font-bold mb-8 text-gray-300">
              Make your appointment deposit now!
            </h2>
            <p className="text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto">
              Secure your tattoo appointment hassle-free with United Tattoo&apos;s deposit payment page.
              Pay conveniently via Square, accepting all major credit and debit cards, including
              American Express and Discover, along with mobile payment options like Apple Pay and
              Google Pay. You can even use Afterpay.
            </p>
          </div>
        </div>
      </section>

      {/* Payment Options Section */}
      <section className="relative bg-black py-20 px-8 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-2xl font-bold text-white mb-2">
              Design now, pay your way, and ink later
            </p>
            <p className="text-xl text-gray-400">
              – your tattoo journey, your terms
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-white/5 border-white/10 hover:border-white/20 transition-all duration-300">
              <CardHeader className="text-center">
                <div className="mx-auto w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-4">
                  <ShoppingBag className="w-10 h-10" aria-hidden="true" />
                </div>
                <CardTitle className="text-2xl font-playfair text-white">Pay with Afterpay</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-400 mb-6">Split your deposit into easy installments</p>
                <Button
                  className="bg-white text-black hover:bg-gray-100 w-full py-6 text-lg font-medium"
                  asChild
                >
                  <Link href="/book">Pay with Afterpay</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 hover:border-white/20 transition-all duration-300">
              <CardHeader className="text-center">
                <div className="mx-auto w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-4">
                  <CreditCard className="w-10 h-10" aria-hidden="true" />
                </div>
                <CardTitle className="text-2xl font-playfair text-white">Credit/Debit Cards</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-400 mb-6">VISA, Mastercard & more (powered by Stripe)</p>
                <Button
                  className="bg-white text-black hover:bg-gray-100 w-full py-6 text-lg font-medium"
                  asChild
                >
                  <Link href="/book">Pay with Card</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Deposit Policy Section */}
      <section className="relative py-20 px-8 lg:px-16 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-5xl font-bold mb-4 text-white">Deposit Policy</h2>
            <div className="w-16 h-0.5 bg-white mx-auto"></div>
          </div>

          {/* Policy Overview */}
          <Card className="bg-white/5 border-white/10 mb-12">
            <CardContent className="p-8">
              <p className="text-gray-300 leading-relaxed mb-6">
                At United Tattoo, we understand that life is unpredictable, and circumstances may
                necessitate changes. This policy was created to foster fairness and understanding
                among all parties involved. Our artists dedicate considerable time to the studio,
                prioritizing their craft above all else.
              </p>
              <p className="text-gray-300 leading-relaxed mb-6">
                The United Tattoo Deposit Policy is designed to honor their commitment and respect
                your time as our valued client. Adhering to this policy ensures that scheduled
                appointments are upheld with care and consideration.
              </p>
              <Alert className="bg-black/50 border-white/20">
                <AlertCircle className="h-4 w-4" aria-hidden="true" />
                <AlertDescription className="text-gray-300 text-sm">
                  All deposits and rescheduling requests are subject to review and approval by
                  LW2 Investments, LLC, which oversees the financial and legal policies of United Tattoo.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Policy Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-white/5 border border-white/10">
              <TabsTrigger
                value="policy"
                className="data-[state=active]:bg-white data-[state=active]:text-black text-white"
              >
                Non-Refundable
              </TabsTrigger>
              <TabsTrigger
                value="transfer"
                className="data-[state=active]:bg-white data-[state=active]:text-black text-white"
              >
                Transferability
              </TabsTrigger>
              <TabsTrigger
                value="reschedule"
                className="data-[state=active]:bg-white data-[state=active]:text-black text-white"
              >
                Rescheduling
              </TabsTrigger>
              <TabsTrigger
                value="tiered"
                className="data-[state=active]:bg-white data-[state=active]:text-black text-white"
              >
                Tiered Policy
              </TabsTrigger>
            </TabsList>

            <TabsContent value="policy" className="mt-8">
              <Card className="bg-red-950/20 border-red-900/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl text-white">
                    <AlertCircle className="w-6 h-6 text-red-400" />
                    NON-REFUNDABLE DEPOSIT
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                      <span className="text-gray-300">
                        All deposits are non-refundable, no exception. This ensures that our artists&apos;
                        time, preparation, and custom artwork are fairly compensated.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                      <span className="text-gray-300">
                        By placing a deposit, you agree to this policy and understand that refund
                        requests will not be considered unless reviewed and approved by LW2 Investments, LLC.
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transfer" className="mt-8">
              <Card className="bg-yellow-950/20 border-yellow-900/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl text-white">
                    <RefreshCw className="w-6 h-6 text-yellow-400" />
                    DEPOSIT TRANSFERABILITY
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
                      <span className="text-gray-300">
                        While deposits are non-refundable, we recognize that unforeseen
                        circumstances may arise.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
                      <span className="text-gray-300">
                        Deposits can be transferred once to a rescheduled appointment, provided
                        proper notice is given (see Rescheduling Policy).
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reschedule" className="mt-8">
              <Card className="bg-blue-950/20 border-blue-900/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl text-white">
                    <Calendar className="w-6 h-6 text-blue-400" />
                    RESCHEDULING POLICY
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                      <span className="text-gray-300">
                        One free reschedule is allowed if notice is given at least 48 hours before
                        the scheduled appointment.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                      <span className="text-gray-300">
                        A rescheduling fee of up to 25% of your deposit may apply to cover
                        administrative costs and ensure our artists&apos; time is respected.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                      <span className="text-gray-300">
                        If you reschedule within 48 hours of your appointment, your deposit is
                        forfeited, and a new deposit will be required.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                      <span className="text-gray-300">
                        Deposits transferred to rescheduled appointments will be credited toward
                        the final cost of the tattoo service.
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tiered" className="mt-8">
              <Card className="bg-green-950/20 border-green-900/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl text-white">
                    <Shield className="w-6 h-6 text-green-400" />
                    TIERED DEPOSIT RETENTION POLICY
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 mb-6 italic">
                    (Reviewed on a case-by-case basis by LW2 Investments, LLC)
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Badge className="bg-green-900/30 text-green-400 border-green-900/50">
                        30+ Days
                      </Badge>
                      <span className="text-gray-300 flex-1">
                        The deposit can be held as shop credit toward a future appointment (not refunded).
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge className="bg-yellow-900/30 text-yellow-400 border-yellow-900/50">
                        14-29 Days
                      </Badge>
                      <span className="text-gray-300 flex-1">
                        50% of the deposit may be credited toward a future appointment; the remaining
                        50% is forfeited.
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge className="bg-red-900/30 text-red-400 border-red-900/50">
                        &lt; 14 Days
                      </Badge>
                      <span className="text-gray-300 flex-1">
                        The deposit is fully forfeited unless the time slot is rebooked.
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* No-Show Policy */}
          <Card className="mt-12 bg-red-950/20 border-red-900/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl text-white">
                <X className="w-5 h-5 text-red-400" />
                NO-CALL & NO-SHOW POLICY
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Failure to show up for your appointment without calling or emailing in advance results
                in the loss of 100% of your deposit. Clients with a no-show history may be required
                to pay in full before booking future appointments.
              </p>
            </CardContent>
          </Card>

          {/* Final Note */}
          <Alert className="mt-12 bg-white/5 border-white/10">
            <Shield className="h-5 w-5" aria-hidden="true" />
            <AlertDescription className="text-gray-300">
              <strong>FINAL DECISIONS & LEGAL OVERSIGHT:</strong> All deposit-related decisions,
              refund requests, and disputes will be reviewed by LW2 Investments, LLC. United Tattoo
              staff cannot override or approve deposit refunds outside the scope of this policy.
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* Contact Section */}
      <section className="relative py-20 px-8 lg:px-16 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-300 mb-8 text-lg">
            By adhering to these policies, we aim to provide consistent, professional, and respectful
            experience for both our clients and our talented artists. We look forward to creating an
            exceptional tattoo experience with you!
          </p>
          <p className="text-gray-400 mb-12">
            If you have any questions or concerns, please contact us directly:
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              className="border-white/30 text-white hover:bg-white hover:text-black bg-transparent"
              asChild
            >
              <Link href="mailto:appts@united-tattoo.com">
                appts@united-tattoo.com
              </Link>
            </Button>
            <Button
              variant="outline"
              className="border-white/30 text-white hover:bg-white hover:text-black bg-transparent"
              asChild
            >
              <Link href="tel:+17196989004">
                (719) 698-9004
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
