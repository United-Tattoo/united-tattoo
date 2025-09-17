import { Navigation } from "@/components/navigation"
import { AftercarePage } from "@/components/aftercare-page"
import { Footer } from "@/components/footer"

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
