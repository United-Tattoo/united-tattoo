"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Shield, Scale, Info } from "lucide-react"
import Link from "next/link"

export function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero / Header */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]">
          <img
            src="/united-logo-full.jpg"
            alt=""
            loading="lazy"
            className="w-full h-full object-cover object-center scale-150 blur-[2px]"
          />
        </div>

        <div className="relative z-10 pt-28 pb-16 px-8 lg:px-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-playfair text-5xl lg:text-7xl font-bold mb-6 tracking-tight">Terms of Service</h1>
            <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
              The following Terms of Service outline how we operate, how bookings work, and what you can expect when
              working with United Tattoo. We try to keep it fair, simple, and respectful for everyone involved.
            </p>
            <div className="mt-6">
              <Badge variant="outline" className="border-white/30 text-white">Last updated: 2025-09-16</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Notice */}
      <section className="px-8 lg:px-16">
        <div className="max-w-4xl mx-auto">
          <Alert className="bg-white/5 border-white/10">
            <Info className="h-5 w-5" aria-hidden="true" />
            <AlertDescription className="text-gray-300">
              By booking an appointment or placing a deposit with United Tattoo, you agree to the terms outlined below.
              If anything is unclear, please reach out at{" "}
              <Link href="mailto:appts@united-tattoo.com" className="underline">
                appts@united-tattoo.com
              </Link>{" "}
              or{" "}
              <Link href="tel:+17196989004" className="underline">
                (719) 698-9004
              </Link>
              .
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* Terms Sections */}
      <section className="px-8 lg:px-16 mt-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white/90 flex items-center gap-2">
                <Shield className="w-5 h-5" /> Appointments & Consultations
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-3">
              <p>• Consultations may be required for larger or custom pieces.</p>
              <p>• We review requests and match you with the best available artist for your style and timeline.</p>
              <p>• Pricing depends on size, detail, placement, and the artist&apos;s rate.</p>
              <p>
                • Walk-ins are welcome based on availability—call ahead for current openings:
                {" "}
                <Link className="underline" href="tel:+17196989004">(719) 698-9004</Link>.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white/90 flex items-center gap-2">
                <Shield className="w-5 h-5" /> Deposits & Rescheduling
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-3">
              <p>• Deposits are required to secure appointments and are applied to the final cost.</p>
              <p>• Deposits are non-refundable. One transfer may be allowed with proper notice.</p>
              <p>• Rescheduling within 48 hours may forfeit the deposit per policy.</p>
              <p>
                • Full deposit terms are available on our{" "}
                <Link href="/deposit" className="underline">
                  Deposit Policy
                </Link>{" "}
                page.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white/90 flex items-center gap-2">
                <Scale className="w-5 h-5" /> Studio Policies & Safety
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-3">
              <p>• Valid government ID is required for all clients. You must be 18+ for tattoos.</p>
              <p>• United Tattoo is licensed by the El Paso County Health Department.</p>
              <p>• We follow strict sanitation standards for the safety of clients and artists.</p>
              <p>
                • Please review our{" "}
                <Link href="/aftercare" className="underline">
                  Aftercare
                </Link>{" "}
                guidelines to help your tattoo heal properly.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white/90 flex items-center gap-2">
                <Scale className="w-5 h-5" /> Artwork, Copyright & Revisions
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-3">
              <p>• All custom artwork remains the intellectual property of the artist.</p>
              <p>• Reference images help guide your piece, but we do not copy other artists&apos; work.</p>
              <p>• Minor revisions to design are typically included; extensive changes may incur extra charges.</p>
              <p>• We reserve the right to refuse service for inappropriate or unsafe requests.</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-white/90 flex items-center gap-2">
                <Info className="w-5 h-5" /> Liability, Allergies & Medical Concerns
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-3">
              <p>
                • Please disclose any allergies, skin sensitivities, or medical conditions prior to your appointment.
              </p>
              <p>• Follow all pre-appointment guidance: rest well, hydrate, avoid alcohol/blood thinners for 24 hours.</p>
              <p>• Adherence to aftercare instructions is essential—complications may occur if not followed.</p>
              <p>
                • If you experience signs of infection, contact us immediately at{" "}
                <Link href="tel:+17196989004" className="underline">
                  (719) 698-9004
                </Link>{" "}
                or seek urgent medical care.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer Note */}
      <section className="px-8 lg:px-16 mt-12 pb-24">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6 text-gray-300">
              <p className="mb-2">
                Final decisions, refund requests, and disputes are reviewed by <strong>LW2 Investments, LLC</strong>.
              </p>
              <p className="text-sm text-gray-400">
                These Terms may be updated periodically. Continued use of our services constitutes acceptance of the latest version.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
