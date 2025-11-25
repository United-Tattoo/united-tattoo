"use client"

import { StickySplit } from "./sticky-split"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card" // Import from ui/card to check compat or united/card?
// Wait, I moved united/card to components/united/card.tsx.
// United card has variants. Utils/shadcn card does not in the same way. 
import { Card as UnitedCard, CardHeader as UnitedCardHeader, CardTitle as UnitedCardTitle, CardContent as UnitedCardContent } from "./card"
import { ColorSwatch } from "./color-swatch"
import { SectionLabel } from "./section-label"
import { Reveal } from "./reveal"

export function IdentitySection() {
  return (
    <section className="py-[clamp(3.5rem,6vw,6rem)] px-[clamp(1.5rem,4vw,5rem)] max-w-[1600px] mx-auto relative bg-[var(--sand)]/30">
      <StickySplit
        sidebar={
          <div className="space-y-6">
            <SectionLabel>02 • The Studio</SectionLabel>
            <h2 className="font-serif text-[clamp(1.9rem,4vw,3rem)] leading-[1.15] text-[var(--ink)]">
              A space for art, not just ink.
            </h2>
            <p className="text-[clamp(0.95rem,2vw,1.3rem)] leading-[1.65] text-[var(--ink)]/75 max-w-[54ch]">
              Located in Fountain, Colorado, United Tattoo is a collective of artists dedicated to the craft. 
              We prioritize custom work, clean lines, and a welcoming environment.
            </p>
          </div>
        }
      >
        <div className="grid gap-8">
          <Reveal>
            <UnitedCard variant="default" className="backdrop-blur-sm bg-white/60">
              <UnitedCardHeader>
                <UnitedCardTitle>The Philosophy</UnitedCardTitle>
                <span className="text-[0.7rem] uppercase tracking-[0.25em] opacity-80">Est. 2012</span>
              </UnitedCardHeader>
              <UnitedCardContent>
                <p className="text-[var(--ink)]/80 mb-8 leading-relaxed">
                  We believe in tattoos that age as well as you do. Our process is collaborative, 
                  transparent, and focused on creating lasting pieces of art.
                </p>
                
                {/* Decorative swatches to mimic design system look */}
                <div className="hidden md:grid grid-cols-3 gap-4">
                   <div className="h-24 rounded-xl bg-[var(--burnt-orange)] flex items-end p-4 text-white text-xs uppercase tracking-wider font-medium">Bold</div>
                   <div className="h-24 rounded-xl bg-[var(--sage)] flex items-end p-4 text-white text-xs uppercase tracking-wider font-medium">Clean</div>
                   <div className="h-24 rounded-xl bg-[var(--charcoal)] flex items-end p-4 text-white text-xs uppercase tracking-wider font-medium">Lasting</div>
                </div>
              </UnitedCardContent>
            </UnitedCard>
          </Reveal>

          <Reveal delay={0.1}>
             <UnitedCard variant="component" className="bg-white/80 border-dashed border-[var(--sage-concrete)]/40">
              <UnitedCardHeader>
                 <UnitedCardTitle>The Space</UnitedCardTitle>
              </UnitedCardHeader>
              <UnitedCardContent className="space-y-4">
                 <p className="leading-relaxed">
                    Our studio is designed to be a sanctuary. Bright, open, and professional. 
                    We strictly adhere to the highest standards of safety and sterilization.
                 </p>
                 <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="p-4 rounded-lg bg-[var(--sand)]/50 border border-[var(--ink)]/5">
                        <span className="block text-xs uppercase tracking-widest text-[var(--moss)] mb-1">Location</span>
                        <span className="font-medium">Fountain, CO</span>
                    </div>
                    <div className="p-4 rounded-lg bg-[var(--sand)]/50 border border-[var(--ink)]/5">
                        <span className="block text-xs uppercase tracking-widest text-[var(--moss)] mb-1">Atmosphere</span>
                        <span className="font-medium">Private & Relaxed</span>
                    </div>
                 </div>
              </UnitedCardContent>
             </UnitedCard>
          </Reveal>
        </div>
      </StickySplit>
    </section>
  )
}
