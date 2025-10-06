"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { PortfolioImage } from "@/types/database"
import { Loader2, Upload, Trash2, Eye, EyeOff } from "lucide-react"
import Image from "next/image"

export default function ArtistPortfolioPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [images, setImages] = useState<PortfolioImage[]>([])
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)

  // Fetch portfolio images on mount
  useEffect(() => {
    async function fetchPortfolio() {
      try {
        const response = await fetch("/api/artists/me")
        if (!response.ok) throw new Error("Failed to fetch artist data")
        
        const artist = await response.json()
        setImages(artist.portfolioImages || [])
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load portfolio images",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPortfolio()
  }, [toast])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(e.target.files)
    }
  }

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one image to upload",
        variant: "destructive"
      })
      return
    }

    setUploading(true)

    try {
      // Upload each file
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i]
        const formData = new FormData()
        formData.append("file", file)
        formData.append("caption", "")
        formData.append("tags", JSON.stringify([]))
        formData.append("isPublic", "true")

        const response = await fetch("/api/portfolio", {
          method: "POST",
          body: formData
        })

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`)
        }
      }

      toast({
        title: "Success",
        description: `${selectedFiles.length} image(s) uploaded successfully`
      })

      // Refresh the page to show new images
      setSelectedFiles(null)
      router.refresh()
      
      // Re-fetch images
      const response = await fetch("/api/artists/me")
      const artist = await response.json()
      setImages(artist.portfolioImages || [])
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload images",
        variant: "destructive"
      })
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (imageId: string) => {
    if (!confirm("Are you sure you want to delete this image?")) {
      return
    }

    try {
      const response = await fetch(`/api/portfolio/${imageId}`, {
        method: "DELETE"
      })

      if (!response.ok) throw new Error("Failed to delete image")

      toast({
        title: "Success",
        description: "Image deleted successfully"
      })

      // Remove from local state
      setImages(images.filter(img => img.id !== imageId))
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete image",
        variant: "destructive"
      })
    }
  }

  const handleToggleVisibility = async (imageId: string, currentVisibility: boolean) => {
    try {
      const response = await fetch(`/api/portfolio/${imageId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublic: !currentVisibility })
      })

      if (!response.ok) throw new Error("Failed to update visibility")

      toast({
        title: "Success",
        description: `Image is now ${!currentVisibility ? "public" : "private"}`
      })

      // Update local state
      setImages(images.map(img => 
        img.id === imageId ? { ...img, isPublic: !currentVisibility } : img
      ))
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update visibility",
        variant: "destructive"
      })
    }
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
        <h2 className="text-2xl font-bold text-gray-900">Portfolio Manager</h2>
        <p className="text-gray-600 mt-1">
          Upload and manage your tattoo portfolio images
        </p>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Images</CardTitle>
          <CardDescription>
            Add new tattoo images to your portfolio
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-900 file:text-white hover:file:bg-gray-800"
            />
            {selectedFiles && (
              <p className="text-sm text-gray-600 mt-2">
                {selectedFiles.length} file(s) selected
              </p>
            )}
          </div>
          <Button
            onClick={handleUpload}
            disabled={!selectedFiles || uploading}
            className="w-full"
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Images
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Portfolio Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Your Portfolio ({images.length} images)</CardTitle>
          <CardDescription>
            Manage visibility and delete images from your portfolio
          </CardDescription>
        </CardHeader>
        <CardContent>
          {images.length === 0 ? (
            <div className="text-center py-12">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No portfolio images yet</p>
              <p className="text-sm text-gray-500 mt-1">
                Upload your first tattoo image above
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((image) => (
                <div key={image.id} className="relative group">
                  <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={image.url}
                      alt={image.caption || "Portfolio image"}
                      fill
                      className="object-cover"
                    />
                    {!image.isPublic && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-semibold">Private</span>
                      </div>
                    )}
                  </div>
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleToggleVisibility(image.id, image.isPublic)}
                      className="shadow-lg"
                    >
                      {image.isPublic ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(image.id)}
                      className="shadow-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {image.caption && (
                    <p className="text-sm text-gray-600 mt-2 truncate">
                      {image.caption}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-blue-900 mb-2">Portfolio Tips</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Upload high-quality images of your best work</li>
            <li>• Use the visibility toggle to hide images from public view</li>
            <li>• Private images won't appear on your public artist profile</li>
            <li>• Coming soon: Add captions, tags, and reorder images</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
