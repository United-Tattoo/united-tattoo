import { Navigation } from "@/components/navigation"
import { ScrollProgress } from "@/components/scroll-progress"
import { ScrollToSection } from "@/components/scroll-to-section"
import { LenisProvider } from "@/components/smooth-scroll-provider"
import { HeroSection } from "@/components/hero-section"
import { ArtistsSection } from "@/components/artists-section"
import { ServicesSection } from "@/components/services-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { BackgroundStrata } from "@/components/background-strata"
export default function HomePage() {
  return (
    <LenisProvider>
      <main className="relative min-h-screen bg-[#0c0907]">
        <BackgroundStrata />
        <ScrollProgress />
        <ScrollToSection />
        <Navigation />
        <div id="home">
          <HeroSection />
        </div>
        <div id="artists">
          <ArtistsSection />
        </div>
        <div id="services">
          <ServicesSection />
        </div>
        <div id="contact">
          <ContactSection />
        </div>
        <Footer />
      </main>
    </LenisProvider>
  )
}
