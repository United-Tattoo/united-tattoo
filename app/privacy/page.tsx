import { Navigation } from "@/components/navigation"
import { PrivacyPage } from "@/components/privacy-page"
import { Footer } from "@/components/footer"
import { generateMetadata as createMetadata } from "@/lib/metadata"

export const metadata = createMetadata({
  title: "Privacy Policy",
  description: "United Tattoo's privacy policy. Learn how we protect your personal information and respect your privacy.",
  path: "/privacy",
  noIndex: true,
})

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
