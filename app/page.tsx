import { Navigation } from "@/components/navigation"
import { ScrollProgress } from "@/components/scroll-progress"
import { ScrollToSection } from "@/components/scroll-to-section"
import { LenisProvider } from "@/components/smooth-scroll-provider"
import { Footer } from "@/components/footer"

import { NewHero } from "@/components/united/new-hero"
import { ImmersionSection } from "@/components/united/immersion-section"
import { IdentitySection } from "@/components/united/identity-section"
import { NewArtistsSection } from "@/components/united/new-artists-section"
import { NewContactSection } from "@/components/united/new-contact-section"

export default function HomePage() {
    return (
        <LenisProvider>
            <main className="min-h-screen selection:bg-[var(--terracotta)] selection:text-white">
                <ScrollProgress />
                <ScrollToSection />
                <Navigation />

                <div id="home">
                    <NewHero />
                </div>

                <ImmersionSection />

                <div id="about">
                    <IdentitySection />
                </div>

                <NewArtistsSection />

                <NewContactSection />

                <Footer />
            </main>
        </LenisProvider>
    )
}
