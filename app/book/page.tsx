import { Navigation } from "@/components/navigation"
import { BookingForm } from "@/components/booking-form"
import { Footer } from "@/components/footer"
import { generateMetadata as createMetadata } from "@/lib/metadata"

export const metadata = createMetadata({
  title: "Book Your Tattoo Appointment",
  description: "Schedule your custom tattoo consultation with United Tattoo in Fountain, CO. Easy online booking with our talented artists. Walk-ins welcome!",
  path: "/book",
  keywords: ["book tattoo", "tattoo appointment", "tattoo consultation", "schedule tattoo", "fountain colorado tattoo"],
})

export default function BookPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-16">
        <BookingForm />
      </div>
      <Footer />
    </main>
  )
}
