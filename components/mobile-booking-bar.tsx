"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function MobileBookingBar() {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-sand/95 backdrop-blur-xl border-t border-charcoal/5 pb-safe shadow-[0_-10px_30px_rgba(28,25,21,0.05)]">
      <div className="px-[clamp(1.5rem,4vw,5rem)] py-4">
        <Button
          asChild
          className="w-full h-12 bg-burnt text-white hover:bg-burnt/90 py-4 text-sm font-semibold tracking-widest uppercase shadow-[0_8px_20px_rgba(176,71,30,0.2)] rounded-xl transition-all active:scale-[0.98]"
        >
          <Link href="/book">Book Appointment</Link>
        </Button>
      </div>
    </div>
  )
}
