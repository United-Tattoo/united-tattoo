"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Artist } from "@/types/database"
import { X, Plus, Loader2 } from "lucide-react"

const AVAILABLE_SPECIALTIES = [
  "Traditional",
  "Neo-Traditional",
  "Japanese",
  "Blackwork",
  "Realism",
  "Portraits",
  "Black & Grey",
  "Watercolor",
  "Geometric",
  "Fine Line",
  "Illustrative",
  "Tribal",
  "Biomechanical",
  "Abstract",
  "Minimalist",
  "Dotwork",
  "Lettering",
  "Cover-ups"
]

export default function ArtistProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [artist, setArtist] = useState<Artist | null>(null)

  const [formData, setFormData] = useState({
    bio: "",
    specialties: [] as string[],
    instagramHandle: "",
    hourlyRate: ""
  })

  const [newSpecialty, setNewSpecialty] = useState("")

  // Fetch artist data on mount
  useEffect(() => {
    async function fetchArtist() {
      try {
        const response = await fetch("/api/artists/me")
        if (!response.ok) throw new Error("Failed to fetch artist data")
        
        const data = await response.json()
        setArtist(data)
        setFormData({
          bio: data.bio || "",
          specialties: data.specialties || [],
          instagramHandle: data.instagramHandle || "",
          hourlyRate: data.hourlyRate?.toString() || ""
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchArtist()
  }, [toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch("/api/artists/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bio: formData.bio,
          specialties: formData.specialties,
          instagramHandle: formData.instagramHandle || null,
          hourlyRate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : null
        })
      })

      if (!response.ok) throw new Error("Failed to update profile")

      toast({
        title: "Success",
        description: "Your profile has been updated"
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const addSpecialty = (specialty: string) => {
    if (!formData.specialties.includes(specialty)) {
      setFormData({
        ...formData,
        specialties: [...formData.specialties, specialty]
      })
    }
    setNewSpecialty("")
  }

  const removeSpecialty = (specialty: string) => {
    setFormData({
      ...formData,
      specialties: formData.specialties.filter(s => s !== specialty)
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
        <p className="text-gray-600 mt-1">
          Update your public-facing profile information
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Bio Section */}
        <Card>
          <CardHeader>
            <CardTitle>About You</CardTitle>
            <CardDescription>
              Tell clients about your experience and style
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Describe your tattoo artistry, experience, and what makes your work unique..."
                rows={6}
                className="mt-1"
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.bio.length} characters
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Specialties Section */}
        <Card>
          <CardHeader>
            <CardTitle>Specialties</CardTitle>
            <CardDescription>
              Select the tattoo styles you specialize in
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Your Specialties</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.specialties.map((specialty) => (
                  <Badge key={specialty} variant="secondary" className="text-sm">
                    {specialty}
                    <button
                      type="button"
                      onClick={() => removeSpecialty(specialty)}
                      className="ml-2 hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {formData.specialties.length === 0 && (
                  <p className="text-sm text-gray-500">
                    No specialties selected yet
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label>Add Specialty</Label>
              <div className="flex gap-2 mt-1">
                <select
                  value={newSpecialty}
                  onChange={(e) => setNewSpecialty(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-950"
                >
                  <option value="">Select a specialty...</option>
                  {AVAILABLE_SPECIALTIES.filter(
                    s => !formData.specialties.includes(s)
                  ).map((specialty) => (
                    <option key={specialty} value={specialty}>
                      {specialty}
                    </option>
                  ))}
                </select>
                <Button
                  type="button"
                  onClick={() => newSpecialty && addSpecialty(newSpecialty)}
                  disabled={!newSpecialty}
                  size="sm"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact & Rates Section */}
        <Card>
          <CardHeader>
            <CardTitle>Contact & Rates</CardTitle>
            <CardDescription>
              Optional information for clients
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="instagram">Instagram Handle</Label>
              <div className="flex items-center mt-1">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  @
                </span>
                <Input
                  id="instagram"
                  type="text"
                  value={formData.instagramHandle}
                  onChange={(e) => setFormData({ ...formData, instagramHandle: e.target.value })}
                  placeholder="yourhandle"
                  className="rounded-l-none"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="hourlyRate">Hourly Rate (Optional)</Label>
              <div className="flex items-center mt-1">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  $
                </span>
                <Input
                  id="hourlyRate"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.hourlyRate}
                  onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                  placeholder="150.00"
                  className="rounded-l-none"
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                This is shown on your public profile
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Read-only Fields Info */}
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle className="text-sm">Admin-Only Fields</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600 space-y-2">
            <p>
              <strong>Name:</strong> {artist?.name || "N/A"}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span className={artist?.isActive ? "text-green-600" : "text-red-600"}>
                {artist?.isActive ? "Active" : "Inactive"}
              </span>
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Contact an administrator to change your name or account status
            </p>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/artist-dashboard")}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
