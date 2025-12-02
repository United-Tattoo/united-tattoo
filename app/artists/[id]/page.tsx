import { Navigation } from "@/components/navigation"
import { ArtistPortfolio } from "@/components/artist-portfolio"
import { Footer } from "@/components/footer"

// Revalidate this page every 30 minutes (1800 seconds)
export const revalidate = 1800

interface ArtistPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ArtistPage({ params }: ArtistPageProps) {
  const { id } = await params
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-16">
        <ArtistPortfolio artistId={id} />
      </div>
      <Footer />
    </main>
  )
}
