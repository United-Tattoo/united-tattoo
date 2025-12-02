"use client"

import { useState, type ComponentType } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CheckCircle,
  Clock,
  Shield,
  AlertTriangle,
  Droplets,
  Phone,
  Mail,
  Heart,
} from "lucide-react"
import Link from "next/link"
import { SectionWrapper } from "@/components/section-wrapper"

type Phase = {
  phase: string
  icon: ComponentType<{ className?: string }>
  color: string
  bgColor: string
  steps: string[]
}

const generalAftercare: Record<string, Phase> = {
  immediate: {
    phase: "Immediate Aftercare",
    icon: Clock,
    color: "text-primary",
    bgColor: "bg-card",
    steps: [
      "Keep the bandage or dressing on for 1 to 4 hours to prevent exposure to airborne bacteria.",
      "Wash your hands thoroughly before removing the bandage.",
      "Remove the bandage gently and cleanse your tattoo using lukewarm water and mild, unscented antibacterial soap.",
      "Pat dry with a clean paper towel — never touch your tattoo unless you have just washed your hands.",
      "Apply a very light layer of the recommended aftercare product or fragrance-free lotion.",
    ],
  },
  general: {
    phase: "General Aftercare",
    icon: Shield,
    color: "text-accent",
    bgColor: "bg-card",
    steps: [
      "Cleanse your tattoo multiple times a day with lukewarm water and antibacterial soap.",
      "Apply a thin layer of ointment or lotion to keep your tattoo moisturized.",
      "After the first few days, transition to a non-scented lotion.",
      "Avoid wearing tight clothing over your tattoo.",
      "Avoid immersing your tattoo in pools, oceans, lakes, or hot tubs for 2–4 weeks.",
      "Minimize activities that lead to excessive sweating and sun exposure.",
      "Do not pick, peel, or scratch scabbing or hardened layers.",
    ],
  },
  longterm: {
    phase: "Long-term Aftercare",
    icon: Heart,
    color: "text-primary",
    bgColor: "bg-card",
    steps: [
      "Always use a minimum of SPF 30 sunblock to protect your tattoo from UV rays.",
      "Keep your tattoos well-moisturized, especially in areas prone to fading (hands, feet, knees, elbows).",
      "The outermost layer of skin typically takes 2–3 weeks to heal.",
      "Complete healing may take up to 6 months.",
      "Ongoing care will contribute to the longevity and vibrancy of your tattoo.",
    ],
  },
}

const transparentBandage: Record<string, Phase> = {
  removal: {
    phase: "Bandage Removal",
    icon: Droplets,
    color: "text-primary",
    bgColor: "bg-card",
    steps: [
      "Remove bandage in the shower for added comfort — running water helps adhesive detachment.",
      "Peel back in the direction of hair growth.",
      "Wash hands before handling your tattoo.",
      "Cleanse with lukewarm water and mild antibacterial soap multiple times a day.",
      "If the tattoo feels slippery, carefully remove excess plasma to avoid scab formation.",
      "Air dry or gently pat with a paper towel.",
    ],
  },
  reapply: {
    phase: "Bandage Reapplication (If Advised)",
    icon: Shield,
    color: "text-accent",
    bgColor: "bg-card",
    steps: [
      "DO NOT apply ointments or lotions unless directed by your artist.",
      "Apply the bandage only to the tattoo, avoiding surrounding skin.",
      "Cut and trim to fit with ~1 inch around all sides (rounded edges adhere better).",
      "Keep the new bandage on for 3–6 days unless your artist advises otherwise.",
      "Remove earlier if irritation, fluid buildup, or loosening occurs.",
      "Avoid reapplying once the tattoo enters the scabbing or flaking phase.",
    ],
  },
}

const infectionWarning = [
  "Increased redness or swelling that spreads beyond the tattoo",
  "Pain when touching the tattoo or a throbbing sensation",
  "Sensation of heat from the tattoo area",
  "Yellow or green discharge with offensive odor",
  "Fever or chills",
  "Red streaking from the tattoo",
  "Excessive swelling after the first day",
  "Signs of allergic reaction",
]

export function AftercarePage() {
  const [tab, setTab] = useState<"general" | "transparent">("general")

  return (
    <div className="min-h-screen bg-background text-foreground">
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
            <h1 className="font-playfair text-5xl lg:text-7xl font-bold mb-6 tracking-tight">
              Tattoo Aftercare
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Proper aftercare is crucial for the healing and longevity of your new tattoo. Follow these
              instructions carefully to ensure the best results.
            </p>
          </div>
        </div>
      </section>

      {/* Licensing Notice */}
      <SectionWrapper>
        <div className="max-w-4xl mx-auto">
          <Alert className="animate-in fade-in-50 duration-300 motion-reduce:animate-none">
            <Shield className="h-5 w-5" />
            <AlertDescription>
              United Tattoo is proudly licensed by the El Paso County Health Department and fully supports
              health department regulations to protect the health of our customers.
            </AlertDescription>
          </Alert>
        </div>
      </SectionWrapper>

      {/* Tabs: General vs Transparent Bandage */}
      <SectionWrapper className="mt-12">
        <div className="max-w-6xl mx-auto">
          <Tabs value={tab} onValueChange={(v: string) => setTab(v === "general" ? "general" : "transparent")} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted border">
              <TabsTrigger
                value="general">
                General Tattoo Aftercare
              </TabsTrigger>
              <TabsTrigger
                value="transparent">
                Transparent Bandage Aftercare
              </TabsTrigger>
            </TabsList>

            {/* General Aftercare */}
            <TabsContent value="general" className="mt-10">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {Object.values(generalAftercare).map((phase, idx) => {
                  const Icon = phase.icon
                  return (
                    <Card key={idx} className="animate-in fade-in-50 duration-300 motion-reduce:animate-none">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                          <Icon className={`w-5 h-5 ${phase.color}`} />
                          <span className="font-playfair text-xl">{phase.phase}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          {phase.steps.map((s, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>

            {/* Transparent Bandage */}
            <TabsContent value="transparent" className="mt-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {Object.values(transparentBandage).map((phase, idx) => {
                  const Icon = phase.icon
                  return (
                    <Card key={idx} className="animate-in fade-in-50 duration-300 motion-reduce:animate-none">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                          <Icon className={`w-5 h-5 ${phase.color}`} />
                          <span className="font-playfair text-xl">{phase.phase}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          {phase.steps.map((s, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </SectionWrapper>

      {/* Infection Warning */}
      {/* Infection Warning */}
      <SectionWrapper className="mt-16">
        <div className="max-w-6xl mx-auto">
          <Card className="bg-destructive/10 border-destructive/30 animate-in fade-in-50 duration-300 motion-reduce:animate-none">
            <CardHeader className="bg-destructive/10">
              <CardTitle className="flex items-center gap-3 text-destructive">
                <AlertTriangle className="w-5 h-5" />
                Signs of Infection — Seek Medical Attention
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {infectionWarning.map((sign, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                    <span>{sign}</span>
                  </div>
                ))}
              </div>

              <Alert className="mt-6 animate-in fade-in-50 duration-300 motion-reduce:animate-none">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  If you experience any of these symptoms, contact our studio immediately at{" "}
                  <Link href="tel:+17196989004" className="underline">
                    (719) 698-9004
                  </Link>{" "}
                  or seek urgent medical attention.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </SectionWrapper>

      {/* Healing Timeline */}
      {/* Healing Timeline */}
      <SectionWrapper className="mt-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="animate-in fade-in-50 duration-300 motion-reduce:animate-none">
              <CardHeader>
                <CardTitle>Surface Healing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold mb-2">2–3 Weeks</p>
                <p className="text-sm text-muted-foreground">
                  The outermost layer of skin typically heals in 2–3 weeks. Continue following aftercare during this time.
                </p>
              </CardContent>
            </Card>

            <Card className="animate-in fade-in-50 duration-300 motion-reduce:animate-none">
              <CardHeader>
                <CardTitle>Deep Healing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold mb-2">2–4 Months</p>
                <p className="text-sm text-muted-foreground">
                  Deeper layers of skin continue healing. Maintain a consistent moisturizing routine.
                </p>
              </CardContent>
            </Card>

            <Card className="animate-in fade-in-50 duration-300 motion-reduce:animate-none">
              <CardHeader>
                <CardTitle>Complete Healing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold mb-2">Up to 6 Months</p>
                <p className="text-sm text-muted-foreground">
                  Full healing may take up to 6 months. Protect with SPF and keep moisturized.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </SectionWrapper>

      {/* Contact / Help */}
      {/* Contact / Help */}
      <SectionWrapper className="my-16 pb-20">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <h3 className="font-playfair text-3xl font-bold mb-2">Questions?</h3>
              <p className="text-muted-foreground mb-6">
                Reach out if you have any aftercare questions or concerns. We’re here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="outline"
                  asChild
                >
                  <Link href="tel:+17196989004" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    (719) 698-9004
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  asChild
                >
                  <Link href="mailto:appts@united-tattoo.com" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    appts@united-tattoo.com
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </SectionWrapper>
    </div>
  )
}
