import { Navigation } from "@/components/navigation"
import { TermsPage } from "@/components/terms-page"
import { Footer } from "@/components/footer"
import { generateMetadata as createMetadata } from "@/lib/metadata"

export const metadata = createMetadata({
  title: "Terms of Service",
  description: "United Tattoo's terms of service. Important information about our services, policies, and client agreements.",
  path: "/terms",
  noIndex: true,
})

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
