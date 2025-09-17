import { ArtistForm } from '@/components/admin/artist-form'

export default function NewArtistPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Artist</h1>
        <p className="text-muted-foreground">
          Add a new artist to your tattoo studio
        </p>
      </div>
      
      <ArtistForm />
    </div>
  )
}
