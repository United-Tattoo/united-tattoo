import { Navigation } from "@/components/navigation"
import { AftercarePage } from "@/components/aftercare-page"
import { Footer } from "@/components/footer"
import { generateMetadata as createMetadata } from "@/lib/metadata"

// Static content page - cache for 24 hours
export const revalidate = 86400

export const metadata = createMetadata({
  title: "Tattoo Aftercare Instructions",
  description: "Complete aftercare guide for your new tattoo. Learn how to properly care for traditional and transparent bandage tattoos. Expert advice from United Tattoo in Fountain, CO.",
  path: "/aftercare",
  keywords: ["tattoo aftercare", "tattoo care", "tattoo healing", "new tattoo", "saniderm aftercare"],
})

export default function Aftercare() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-16">
        <AftercarePage />
      </div>
      <Footer />
    </main>
  )
}
