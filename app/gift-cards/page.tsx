import { Navigation } from "@/components/navigation"
import { GiftCardsPage } from "@/components/gift-cards-page"
import { Footer } from "@/components/footer"
import { generateMetadata as createMetadata } from "@/lib/metadata"

export const metadata = createMetadata({
  title: "Gift Cards",
  description: "Give the gift of art! Purchase United Tattoo gift cards for custom tattoos, piercings, and more. Perfect for any occasion.",
  path: "/gift-cards",
  keywords: ["tattoo gift card", "gift certificate tattoo", "tattoo voucher", "body art gift"],
})

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
