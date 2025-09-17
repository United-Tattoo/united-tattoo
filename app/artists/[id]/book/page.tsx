import { Navigation } from "@/components/navigation"
import { BookingForm } from "@/components/booking-form"
import { Footer } from "@/components/footer"

interface BookingPageProps {
  params: {
    id: string
  }
}

export default function BookingPage({ params }: BookingPageProps) {
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-16">
        <BookingForm artistId={params.id} />
      </div>
      <Footer />
    </main>
  )
}
