import { Navigation } from "@/components/navigation"
import { SpecialsPage } from "@/components/specials-page"
import { Footer } from "@/components/footer"
import { generateMetadata as createMetadata } from "@/lib/metadata"

export const metadata = createMetadata({
  title: "Monthly Specials & Promotions",
  description: "Check out United Tattoo's latest specials and promotions. Save on custom tattoos, flash deals, and more. Join our VIP list for exclusive offers!",
  path: "/specials",
  keywords: ["tattoo specials", "tattoo deals", "tattoo promotions", "discounted tattoos", "flash tattoo sale"],
})

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
