"use client"

import { useMemo } from "react"
import Link from "next/link"
import { StickySplit } from "./sticky-split"
import { SectionLabel } from "./section-label"
import { Reveal } from "./reveal"
import { Button } from "@/components/ui/button" // Shadcn button for variety or United button
// Use United Button
import { Button as UnitedButton } from "./button"

import { artists as staticArtists } from "@/data/artists"
import { useActiveArtists } from "@/hooks/use-artists"

export function NewArtistsSection() {
  // Fetch artists logic
  const { data: dbArtistsData, isLoading, error } = useActiveArtists()

  const artists = useMemo(() => {
      if (isLoading || error || !dbArtistsData) {
          return staticArtists
      }
      return staticArtists.map(staticArtist => {
          const dbArtist = dbArtistsData.artists.find(
              (db) => db.slug === staticArtist.slug || db.name === staticArtist.name
          )
          if (dbArtist && dbArtist.portfolioImages.length > 0) {
              return {
                  ...staticArtist,
                  workImages: dbArtist.portfolioImages.map(img => img.url)
              }
          }
          return staticArtist
      })
  }, [dbArtistsData, isLoading, error])

  return (
    <section id="artists" className="py-[clamp(3.5rem,6vw,6rem)] px-[clamp(1.5rem,4vw,5rem)] max-w-[1600px] mx-auto">
      <StickySplit
        sidebar={
          <div className="space-y-6">
             <SectionLabel>03 • The Team</SectionLabel>
             <h2 className="font-serif text-[clamp(1.9rem,4vw,3rem)] leading-[1.15] text-[var(--ink)]">
               Resident Artists
             </h2>
             <p className="text-[clamp(0.95rem,2vw,1.3rem)] leading-[1.65] text-[var(--ink)]/75 mb-8">
               Each artist brings a unique style and perspective. From realism to traditional, we have a specialist for your idea.
             </p>
             <div className="hidden md:block">
                <Link href="/book">
                   <UnitedButton variant="primary" className="w-full md:w-auto">
                     Book an Artist
                   </UnitedButton>
                </Link>
             </div>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {artists.map((artist, i) => (
             <Reveal key={artist.id} delay={i * 0.1}>
               <Link href={"/artists/" + artist.slug} className="group block h-full">
                 <div className="relative overflow-hidden rounded-[24px] bg-[var(--sage-concrete)] aspect-[3/4] shadow-[var(--shadow-lg)] transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[var(--shadow-bloom)]">
                    {/* Image */}
                    <div className="absolute inset-0">
                       <img 
                         src={artist.faceImage || "/placeholder.svg"} 
                         alt={artist.name}
                         className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                    </div>
                    
                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                       <span className="block text-[0.7rem] uppercase tracking-[0.25em] mb-2 opacity-90">
                         {artist.specialty}
                       </span>
                       <h3 className="font-serif text-2xl mb-2">{artist.name}</h3>
                       <div className="h-1 w-12 bg-[var(--terracotta)] rounded-full transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 delay-100" />
                    </div>
                 </div>
               </Link>
             </Reveal>
           ))}
        </div>
        
        <div className="mt-10 md:hidden">
            <Link href="/book">
               <UnitedButton variant="primary" className="w-full">
                 Book an Artist
               </UnitedButton>
            </Link>
        </div>
      </StickySplit>
    </section>
  )
}
