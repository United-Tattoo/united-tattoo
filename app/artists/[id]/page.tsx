import { Navigation } from "@/components/navigation"
import { ArtistPortfolio } from "@/components/artist-portfolio"
import { Footer } from "@/components/footer"

// Revalidate this page every 30 minutes (1800 seconds)
export const revalidate = 1800

interface ArtistPageProps {
  params: {
    id: string
  }
}

export default function ArtistPage({ params }: ArtistPageProps) {
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-16">
        <ArtistPortfolio artistId={params.id} />
      </div>
      <Footer />
    </main>
  )
}
