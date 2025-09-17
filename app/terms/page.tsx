import { Navigation } from "@/components/navigation"
import { TermsPage } from "@/components/terms-page"
import { Footer } from "@/components/footer"

export default function Terms() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-16">
        <TermsPage />
      </div>
      <Footer />
    </main>
  )
}
