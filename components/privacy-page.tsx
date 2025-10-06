"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Shield, Lock, Cookie, Globe, Mail, Info } from "lucide-react"
import Link from "next/link"
import { SectionWrapper } from "@/components/section-wrapper"

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero / Header */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]">
          <img
            src="/united-logo-full.jpg"
            alt=""
            className="w-full h-full object-cover object-center scale-150 blur-[2px]"
          />
        </div>

        <div className="relative z-10 pt-28 pb-16 px-8 lg:px-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-playfair text-5xl lg:text-7xl font-bold mb-6 tracking-tight">Privacy Policy</h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              We respect your privacy. This policy explains what information we collect, how we use it, and the choices
              you have. We keep it practical and transparent.
            </p>
            <div className="mt-6">
              <Badge variant="outline">Last updated: 2025-09-16</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Summary Notice */}
      <SectionWrapper>
        <div className="max-w-4xl mx-auto">
          <Alert className="animate-in fade-in-50 duration-300 motion-reduce:animate-none">
            <Info className="h-5 w-5" aria-hidden="true" />
            <AlertDescription>
              This Privacy Policy applies to united-tattoo.com and services offered by United Tattoo. For questions, email{" "}
              <Link href="mailto:info@united-tattoo.com" className="underline">info@united-tattoo.com</Link> or call{" "}
              <Link href="tel:+17196989004" className="underline">(719) 698-9004</Link>.
            </AlertDescription>
          </Alert>
        </div>
      </SectionWrapper>

      {/* Sections */}
      <SectionWrapper className="mt-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Information We Collect */}
          <Card className="animate-in fade-in-50 duration-300 motion-reduce:animate-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" /> Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-3">
              <p>• Contact details (name, email, phone) when booking or contacting us.</p>
              <p>• Tattoo consultation details you provide (style, size, placement, references).</p>
              <p>• Basic device/browser data for site functionality and security.</p>
              <p>• Optional social media links you share for portfolio references.</p>
            </CardContent>
          </Card>

          {/* How We Use Information */}
          <Card className="animate-in fade-in-50 duration-300 motion-reduce:animate-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" /> How We Use Your Info
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-3">
              <p>• To schedule appointments and communicate about your booking.</p>
              <p>• To match you with an artist that fits your style and timeline.</p>
              <p>• To improve the website experience and studio operations.</p>
              <p>• To comply with health and safety regulations where applicable.</p>
            </CardContent>
          </Card>

          {/* Cookies */}
          <Card className="animate-in fade-in-50 duration-300 motion-reduce:animate-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cookie className="w-5 h-5" /> Cookies & Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-3">
              <p>• We may use basic cookies for site functionality (e.g., forms, navigation).</p>
              <p>• We may use privacy-friendly analytics to understand site usage at an aggregate level.</p>
              <p>• You can control cookies via your browser settings.</p>
            </CardContent>
          </Card>

          {/* Data Sharing */}
          <Card className="animate-in fade-in-50 duration-300 motion-reduce:animate-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" /> Sharing & Third Parties
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-3">
              <p>• We do not sell your personal information.</p>
              <p>• We may share information with service providers (e.g., payment processors) to complete your request.</p>
              <p>• If legally required, we may disclose information to comply with applicable laws.</p>
            </CardContent>
          </Card>

          {/* Retention & Security */}
          <Card className="animate-in fade-in-50 duration-300 motion-reduce:animate-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" /> Retention & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-3">
              <p>• We retain information only as long as necessary for the purpose it was collected.</p>
              <p>• We implement reasonable safeguards to protect your information.</p>
              <p>• No method of transmission or storage is 100% secure, but we take your privacy seriously.</p>
            </CardContent>
          </Card>

          {/* Your Choices */}
          <Card className="animate-in fade-in-50 duration-300 motion-reduce:animate-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" /> Your Choices & Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-3">
              <p>• You can request updates, corrections, or deletion of your information where applicable.</p>
              <p>
                • To exercise your choices, contact us at{" "}
                <Link href="mailto:info@united-tattoo.com" className="underline">info@united-tattoo.com</Link>{" "}
                or call{" "}
                <Link href="tel:+17196989004" className="underline">(719) 698-9004</Link>.
              </p>
              <p>• We&apos;ll respond within a reasonable timeframe.</p>
            </CardContent>
          </Card>

          {/* Changes */}
          <Card className="lg:col-span-2 animate-in fade-in-50 duration-300 motion-reduce:animate-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5" /> Updates to This Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-3">
              <p>
                We may update this Privacy Policy as our practices evolve. We&apos;ll post the latest version on this page
                with the updated date. Continued use of our services means you accept any changes.
              </p>
            </CardContent>
          </Card>
        </div>
      </SectionWrapper>

      {/* Footer Note */}
      {/* Footer Note */}
      <SectionWrapper className="mt-12 pb-24">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-6 text-muted-foreground">
              <p>If you have privacy concerns, reach out. We&apos;re real humans and we&apos;ll help you out.</p>
            </CardContent>
          </Card>
        </div>
      </SectionWrapper>
    </div>
  )
}
