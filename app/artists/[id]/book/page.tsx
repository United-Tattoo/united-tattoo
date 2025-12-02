import { Navigation } from "@/components/navigation"
import { BookingForm } from "@/components/booking-form"
import { Footer } from "@/components/footer"

interface BookingPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function BookingPage({ params }: BookingPageProps) {
  const { id } = await params
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-16">
        <BookingForm artistId={id} />
      </div>
      <Footer />
    </main>
  )
}
