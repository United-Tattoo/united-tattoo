"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function NewHero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 1000], [0, 200]) 
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  return (
    <header
      ref={ref}
      className="relative h-[95vh] flex flex-col justify-end pb-[10vh] overflow-hidden"
    >
      {/* Parallax Background */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: "url('/images/UP1_00010_.png')",
          y,
        }}
        aria-hidden="true"
      />

       {/* Gradient Scrim for readability */}
       <div className="absolute inset-0 bg-gradient-to-t from-[var(--sand)] to-transparent z-1" style={{
         backgroundImage: "linear-gradient(to top, var(--sand) 0%, rgba(242, 227, 208, 0.85) 20%, rgba(242, 227, 208, 0.5) 40%, transparent 100%)"
       }} />

      {/* Editorial Content */}
      <motion.div 
        className="relative z-10 px-[clamp(1.5rem,5vw,5rem)] w-full max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-end"
        style={{ opacity }}
      >
        <div className="lg:col-span-8">
          <span className="block text-[0.85rem] uppercase tracking-[0.4em] text-[var(--burnt)] font-bold mb-6 animate-fade-in-up">
            Fountain • Colorado
          </span>
          <h1 className="font-serif text-[clamp(3.5rem,8vw,8.5rem)] leading-[0.9] text-[var(--ink)] tracking-tight mb-8 animate-fade-in-up [animation-delay:100ms]">
            UNITED<br/>
            <span className="italic text-[var(--charcoal)]/80">TATTOO</span>
          </h1>
        </div>

        <div className="lg:col-span-4 pb-4 animate-fade-in-up [animation-delay:200ms]">
          <p className="text-[1.1rem] leading-[1.7] text-[var(--ink)]/80 mb-8 max-w-[34ch] border-l border-[var(--terracotta)] pl-6">
            A creative collective specializing in custom narrative work, fine line, and traditional tattooing.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pl-6">
             <Link href="/book">
                <Button 
                  className="bg-[var(--burnt)] text-white hover:bg-[var(--terracotta)] uppercase tracking-widest px-8 py-6 h-auto rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 w-full sm:w-auto"
                >
                  Commission
                </Button>
             </Link>
             <Link href="/artists">
                <Button 
                  variant="ghost"
                  className="text-[var(--ink)] hover:bg-[var(--ink)]/5 uppercase tracking-widest px-8 py-6 h-auto rounded-full transition-all duration-300 border border-[var(--ink)]/10 hover:border-[var(--ink)]/30 w-full sm:w-auto"
                >
                  Portfolio
                </Button>
             </Link>
          </div>
        </div>
      </motion.div>
    </header>
  )
}
