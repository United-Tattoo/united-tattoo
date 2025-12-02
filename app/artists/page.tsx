import { Navigation } from "@/components/navigation"
import { ArtistsPageSection } from "@/components/artists-page-section"
import { Footer } from "@/components/footer"
import { generateMetadata as createMetadata } from "@/lib/metadata"

// Revalidate this page every hour (3600 seconds)
export const revalidate = 3600

export const metadata = createMetadata({
  title: "Meet Our Tattoo Artists",
  description: "Discover talented tattoo artists at United Tattoo in Fountain, CO. Specializing in custom designs, portraits, traditional, and contemporary styles. View portfolios and book today!",
  path: "/artists",
  keywords: ["tattoo artists", "fountain colorado tattoo artists", "custom tattoo artists", "portrait tattoos", "traditional tattoos"],
})

export default function ArtistsPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <ArtistsPageSection />
      <Footer />
    </main>
  )
}
