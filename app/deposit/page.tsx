import { Navigation } from "@/components/navigation"
import { DepositPage } from "@/components/deposit-page"
import { Footer } from "@/components/footer"

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
