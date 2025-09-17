import { Navigation } from "@/components/navigation"
import { BookingForm } from "@/components/booking-form"
import { Footer } from "@/components/footer"

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
