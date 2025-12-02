"use client"

import { Filmstrip } from "./filmstrip"

const immersionImages = [
  { src: "/images/UP1_00007_.png", label: "Monument Prep" },
  { src: "/images/UP1_00009_.png", label: "Avian Story" },
  { src: "/images/UP1_00010_.png", label: "Architectural Study" },
  { src: "/images/UP1_00018_.png", label: "Liberty Detail" },
  { src: "/images/0_1.png", label: "Warm Plaster" },
  { src: "/images/0_3.png", label: "Shadow Glyph" },
]

export function ImmersionSection() {
  return (
    <section className="relative">
      <Filmstrip
        items={immersionImages}
        title="TEMPORARY IMAGES"
        subtitle="01 • TEMPORARY IMAGES"
      />
    </section>
  )
}
