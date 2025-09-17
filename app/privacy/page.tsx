import { Navigation } from "@/components/navigation"
import { PrivacyPage } from "@/components/privacy-page"
import { Footer } from "@/components/footer"

export default function Privacy() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-16">
        <PrivacyPage />
      </div>
      <Footer />
    </main>
  )
}
