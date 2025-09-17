import { Navigation } from "@/components/navigation"
import { GiftCardsPage } from "@/components/gift-cards-page"
import { Footer } from "@/components/footer"

export default function GiftCards() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-16">
        <GiftCardsPage />
      </div>
      <Footer />
    </main>
  )
}
