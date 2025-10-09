import { Navigation } from "@/components/navigation"
import { ContactPage } from "@/components/contact-page"
import { Footer } from "@/components/footer"
import { generateMetadata as createMetadata } from "@/lib/metadata"

export const metadata = createMetadata({
  title: "Contact Us",
  description: "Get in touch with United Tattoo in Fountain, CO. Visit us at 6985 Fountain Mesa Rd or call (719) 390-0039. Walk-ins welcome!",
  path: "/contact",
  keywords: ["contact tattoo studio", "fountain tattoo shop", "tattoo studio location", "united tattoo contact"],
})

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
