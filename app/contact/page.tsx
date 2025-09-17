import { Navigation } from "@/components/navigation"
import { ContactPage } from "@/components/contact-page"
import { Footer } from "@/components/footer"

export default function Contact() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-16">
        <ContactPage />
      </div>
      <Footer />
    </main>
  )
}
