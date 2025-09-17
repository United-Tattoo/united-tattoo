import { Navigation } from "@/components/navigation"
import { ArtistsPageSection } from "@/components/artists-page-section"
import { Footer } from "@/components/footer"

export default function ArtistsPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <ArtistsPageSection />
      <Footer />
    </main>
  )
}
