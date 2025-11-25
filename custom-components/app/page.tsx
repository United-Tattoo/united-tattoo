import { Button } from "@/components/united/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/united/card"
import { Toast } from "@/components/united/toast"
import { FormContainer } from "@/components/united/form-container"
import { FormField, Input, Textarea } from "@/components/united/form-field"
import { Calendar } from "@/components/united/calendar"
import { ColorSwatch } from "@/components/united/color-swatch"
import { SectionLabel } from "@/components/united/section-label"
import { Heading } from "@/components/united/heading"
import { LeadText } from "@/components/united/lead-text"
import { HeroOverlay } from "@/components/united/hero-overlay"
import { AnimatedLink } from "@/components/united/animated-link"
import { LiftCard } from "@/components/united/lift-card"
import { MotionCard } from "@/components/united/motion-card"
import { GalleryCard } from "@/components/united/gallery-card"
import { StickySplit } from "@/components/united/sticky-split"
import { Divider } from "@/components/united/divider"
import { Filmstrip } from "@/components/united/filmstrip"
import { Reveal } from "@/components/united/reveal"
import { Metadata } from "@/components/united/metadata"

export default function ComponentLibrary() {
  const calendarDays = [
    { day: 10, isBooked: true },
    { day: 11 },
    { day: 12 },
    { day: 13 },
    { day: 14, isBooked: true },
    { day: 15 },
    { day: 16 },
  ]

  const filmstripItems = [
    { src: "/monument-statue-with-colorful-objects-artistic.jpg", label: "Monument Prep" },
    { src: "/statue-of-liberty-watercolor-painting-pastel.jpg", label: "Avian Story" },
    { src: "/artistic-studio-with-paintbrushes-and-statue.jpg", label: "Architectural Study" },
  ]

  return (
    <div className="w-full max-w-[1600px] mx-auto px-[clamp(1.5rem,4vw,5rem)] pb-16">
      {/* Hero Section */}
      <header className="min-h-[70vh] flex items-center justify-center relative -mx-[clamp(1.5rem,4vw,5rem)] bg-[url('/artistic-painting-statue-of-liberty-with-warm-colo.jpg')] bg-cover bg-center [mask-image:linear-gradient(180deg,black_60%,transparent_100%)]">
        <Reveal>
          <HeroOverlay>
            <SectionLabel>United Tattoo</SectionLabel>
            <Heading level={1}>Design Language Reference</Heading>
            <LeadText className="mx-auto">
              A living style guide documenting color, typography, components, and interaction patterns.
            </LeadText>
          </HeroOverlay>
        </Reveal>
      </header>

      {/* Filmstrip Gallery */}
      <Filmstrip
        items={filmstripItems}
        subtitle="01 • Immersion Gallery"
        title="Sunbleached walls & charcoal studies."
        className="-mx-[clamp(1.5rem,4vw,5rem)]"
      />

      {/* Brand Identity Section */}
      <section className="mt-[clamp(3.5rem,6vw,6rem)]">
        <StickySplit
          sidebar={
            <Reveal>
              <SectionLabel number="02">Brand Identity</SectionLabel>
              <Heading level={2}>Color, typography, and materiality echo sun-washed plaster.</Heading>
              <LeadText>
                Think plaster walls catching a diagonal slice of afternoon light—burnt oranges, desaturated greens, and
                charcoal blacks. Typography feels like museum placards.
              </LeadText>
            </Reveal>
          }
        >
          <div className="grid gap-8">
            <Reveal delay={100}>
              <Card>
                <CardHeader>
                  <CardTitle>Color Language</CardTitle>
                  <Metadata>Ratio — 60 / 25 / 15</Metadata>
                </CardHeader>
                <CardContent>
                  <p className="mb-8 text-[rgba(36,27,22,0.7)]">
                    Primary palette blends burnt oranges with sage concrete.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <ColorSwatch hex="#E67E50" name="Burnt Orange" usage="Hero Gradients" />
                    <ColorSwatch hex="#D87850" name="Terracotta" usage="Interaction" />
                    <ColorSwatch hex="#7A8B8B" name="Sage Concrete" usage="Backgrounds" />
                    <ColorSwatch hex="#1C1915" name="Charcoal" usage="Ink & Type" />
                  </div>
                </CardContent>
              </Card>
            </Reveal>

            <Reveal delay={200}>
              <Card className="bg-[rgba(255,255,255,0.6)]">
                <CardTitle>Typography</CardTitle>
                <CardContent>
                  <div className="grid gap-6 mt-6">
                    <div className="p-6 border border-dashed border-[rgba(122,139,139,0.4)] rounded-[12px]">
                      <SectionLabel>Display / Headlines</SectionLabel>
                      <div className="font-serif text-[2.5rem] leading-[1.1] mt-2">
                        Playfair Display
                        <br />
                        <span className="text-2xl text-[var(--burnt)]">Sculptural Statements</span>
                      </div>
                    </div>
                    <div className="p-6 border border-dashed border-[rgba(122,139,139,0.4)] rounded-[12px]">
                      <SectionLabel>Body / Interface</SectionLabel>
                      <p className="text-base mt-2 max-w-[40ch]">
                        Space Grotesk. Used for body copy and interface elements. Quiet, generous tracking, always
                        legible on textured backgrounds.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Reveal>
          </div>
        </StickySplit>
      </section>

      <Divider />

      {/* Interface Components Section */}
      <section>
        <Reveal className="text-center mb-12">
          <SectionLabel number="03">Interface Components</SectionLabel>
          <Heading level={2}>Micro-interactions that feel tactile.</Heading>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-8">
          <Reveal delay={100}>
            <div>
              <p className="text-[0.75rem] font-semibold uppercase tracking-[0.3em] text-[var(--ink)] mb-6">
                Action Hierarchy
              </p>
              <div className="flex gap-4 flex-wrap mb-12">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost Link</Button>
              </div>

              <p className="text-[0.75rem] font-semibold uppercase tracking-[0.3em] text-[var(--ink)] mb-6">
                Toast States
              </p>
              <div className="grid gap-4">
                <Toast variant="success" title="Deposit Received" description="Confirmation sent to email." />
                <Toast variant="alert" title="Waitlist Update" description="Feb 2026 books just opened." />
              </div>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <FormContainer>
              <SectionLabel className="text-[var(--ink)]">Booking Request</SectionLabel>

              <FormField label="Full Name">
                <Input placeholder="Eden Morales" />
              </FormField>

              <FormField label="Concept Notes">
                <Textarea rows={3} placeholder="Large scale back piece..." />
              </FormField>

              <div className="bg-[rgba(242,227,208,0.5)] p-4 rounded-[12px] mt-2">
                <Calendar
                  title="Availability • Feb 2026"
                  days={calendarDays}
                  className="shadow-none border-0 p-0 bg-transparent"
                />
              </div>
            </FormContainer>
          </Reveal>
        </div>
      </section>

      {/* Layout & Pacing Section */}
      <section className="mt-24">
        <Reveal>
          <SectionLabel number="04">Layout & Pacing</SectionLabel>
          <Heading level={2}>Structure mirrors gallery pacing: spacious, staggered, editorial.</Heading>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <Reveal delay={0}>
            <GalleryCard
              src="/monument-statue-colorful-artistic-display.jpg"
              alt="Hero Canvas"
              label="Hero Canvas • Diptych Pacing"
            />
          </Reveal>
          <Reveal delay={150} className="md:translate-y-12">
            <GalleryCard
              src="/watercolor-statue-of-liberty-painting.jpg"
              alt="Artist Card"
              label="Artist Card • Chip Layout"
            />
          </Reveal>
          <Reveal delay={300}>
            <GalleryCard
              src="/artistic-studio-sculpture-with-dove.jpg"
              alt="Lookbook"
              label="Lookbook • Stagger Grid"
            />
          </Reveal>
        </div>
      </section>

      {/* Motion Principles Section */}
      <section className="mt-32">
        <StickySplit
          sidebar={
            <Reveal>
              <SectionLabel number="05">Motion Principles</SectionLabel>
              <Heading level={2}>Every movement should feel deliberate, like brush strokes.</Heading>
              <div className="mt-8 grid gap-4">
                <MotionCard
                  title="0.8s Ease-Out"
                  description="Used for reveals. Slow entrance, smooth settling."
                  highlight="burnt"
                />
                <MotionCard
                  title="50ms Stagger"
                  description='Creates a "walking past paintings" effect.'
                  highlight="terracotta"
                />
              </div>
            </Reveal>
          }
        >
          <Reveal delay={100}>
            <Card variant="motion" className="p-12">
              <CardTitle>Interaction Demo</CardTitle>
              <p className="mt-2">
                Hover the elements below to see the &quot;Shadow Bloom&quot; and &quot;Scale&quot; effects.
              </p>

              <div className="mt-8 flex flex-col gap-6">
                <div>
                  <Metadata className="block mb-2">Link Underline Draw</Metadata>
                  <AnimatedLink href="#">Visit the Studio</AnimatedLink>
                </div>

                <div>
                  <Metadata className="block mb-2">Card Lift</Metadata>
                  <LiftCard>
                    <strong>Hover Me</strong>
                    <p className="mt-2 text-[0.9rem] opacity-70">Simulates lifting an object off the table.</p>
                  </LiftCard>
                </div>
              </div>
            </Card>
          </Reveal>
        </StickySplit>
      </section>

      {/* Footer */}
      <footer className="mt-24 py-16 text-center border-t border-[rgba(36,27,22,0.1)]">
        <Metadata>United Tattoo • Living Style Brief • Updated Quarterly</Metadata>
      </footer>
    </div>
  )
}
