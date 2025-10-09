import { Navigation } from "@/components/navigation"
import { DepositPage } from "@/components/deposit-page"
import { Footer } from "@/components/footer"
import { generateMetadata as createMetadata } from "@/lib/metadata"

export const metadata = createMetadata({
  title: "Deposit Policy & Payment Options",
  description: "Learn about United Tattoo's deposit policy and flexible payment options including Afterpay. Secure your appointment with our easy deposit process.",
  path: "/deposit",
  keywords: ["tattoo deposit", "afterpay tattoo", "payment plans", "tattoo payment options"],
})

export default function Deposit() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-16">
        <DepositPage />
      </div>
      <Footer />
    </main>
  )
}
