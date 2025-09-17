"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function MobileBookingBar() {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-t border-white/10 pb-safe">
      <div className="px-4 py-3">
        <Button
          asChild
          className="w-full bg-white text-black hover:bg-gray-100 !text-black py-4 text-lg font-semibold tracking-[0.05em] uppercase shadow-xl"
        >
          <Link href="/book">Book Now</Link>
        </Button>
      </div>
    </div>
  )
}
