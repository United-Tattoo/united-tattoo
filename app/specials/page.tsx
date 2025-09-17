import { Navigation } from "@/components/navigation"
import { SpecialsPage } from "@/components/specials-page"
import { Footer } from "@/components/footer"

export default function Specials() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-16">
        <SpecialsPage />
      </div>
      <Footer />
    </main>
  )
}
