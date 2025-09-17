"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { ArtistForm } from '@/components/admin/artist-form'
import { useToast } from '@/hooks/use-toast'
import type { Artist } from '@/types/database'

export default function EditArtistPage() {
  const params = useParams()
  const { toast } = useToast()
  const [artist, setArtist] = useState<Artist | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchArtist = async () => {
    try {
      const response = await fetch(`/api/artists/${params.id}`)
      if (!response.ok) throw new Error('Failed to fetch artist')
      const data = await response.json()
      setArtist(data.artist)
    } catch (error) {
      console.error('Error fetching artist:', error)
      toast({
        title: 'Error',
        description: 'Failed to load artist',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (params.id) {
      fetchArtist()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading artist...</div>
      </div>
    )
  }

  if (!artist) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Artist not found</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Artist</h1>
        <p className="text-muted-foreground">
          Update {artist.name}'s information and portfolio
        </p>
      </div>
      
      <ArtistForm 
        artist={artist} 
        onSuccess={() => {
          toast({
            title: 'Success',
            description: 'Artist updated successfully',
          })
          fetchArtist() // Refresh the data
        }}
      />
    </div>
  )
}
