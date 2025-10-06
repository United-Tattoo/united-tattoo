"use client"

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Upload, Edit, Trash2, Eye, EyeOff, X, Plus } from 'lucide-react'
import type { PortfolioImage } from '@/types/database'

const imageEditSchema = z.object({
  caption: z.string().optional(),
  tags: z.array(z.string()),
  isPublic: z.boolean(),
})

type ImageEditData = z.infer<typeof imageEditSchema>

interface PortfolioManagerProps {
  artistId: string
  onImagesUpdate?: () => void
}

export function PortfolioManager({ artistId, onImagesUpdate }: PortfolioManagerProps) {
  const { toast } = useToast()
  const [images, setImages] = useState<PortfolioImage[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [editingImage, setEditingImage] = useState<PortfolioImage | null>(null)
  const [deletingImage, setDeletingImage] = useState<PortfolioImage | null>(null)
  const [newTag, setNewTag] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ImageEditData>({
    resolver: zodResolver(imageEditSchema),
    defaultValues: {
      caption: '',
      tags: [],
      isPublic: true,
    }
  })

  const tags = watch('tags')

  const fetchImages = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/artists/${artistId}`)
      if (!response.ok) throw new Error('Failed to fetch images')
      
      const data = await response.json()
      setImages(data.portfolioImages || [])
    } catch (error) {
      console.error('Error fetching images:', error)
      toast({
        title: 'Error',
        description: 'Failed to load portfolio images',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchImages()
  }, [artistId])

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setUploading(true)
    const formData = new FormData()
    formData.append('artistId', artistId)

    Array.from(files).forEach((file) => {
      formData.append('files', file)
    })

    try {
      const response = await fetch('/api/portfolio', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Upload failed')
      }

      toast({
        title: 'Success',
        description: 'Images uploaded successfully',
      })

      fetchImages()
      onImagesUpdate?.()
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to upload images',
        variant: 'destructive',
      })
    } finally {
      setUploading(false)
    }
  }

  const openEditDialog = (image: PortfolioImage) => {
    setEditingImage(image)
    reset({
      caption: image.caption || '',
      tags: image.tags || [],
      isPublic: image.isPublic,
    })
  }

  const closeEditDialog = () => {
    setEditingImage(null)
    reset()
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setValue('tags', [...tags, newTag.trim()])
      setNewTag('')
    }
  }

  const removeTag = (tag: string) => {
    setValue('tags', tags.filter(t => t !== tag))
  }

  const onSubmitEdit = async (data: ImageEditData) => {
    if (!editingImage) return

    try {
      const response = await fetch(`/api/portfolio/${editingImage.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Update failed')
      }

      toast({
        title: 'Success',
        description: 'Image updated successfully',
      })

      closeEditDialog()
      fetchImages()
      onImagesUpdate?.()
    } catch (error) {
      console.error('Update error:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update image',
        variant: 'destructive',
      })
    }
  }

  const handleDelete = async () => {
    if (!deletingImage) return

    try {
      const response = await fetch(`/api/portfolio/${deletingImage.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Delete failed')
      }

      toast({
        title: 'Success',
        description: 'Image deleted successfully',
      })

      setDeletingImage(null)
      fetchImages()
      onImagesUpdate?.()
    } catch (error) {
      console.error('Delete error:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete image',
        variant: 'destructive',
      })
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Images</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Images ({images.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload Section */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <Label htmlFor="portfolio-upload" className="cursor-pointer">
                <span className="mt-2 block text-sm font-medium">
                  {uploading ? 'Uploading...' : 'Upload portfolio images'}
                </span>
                <span className="mt-1 block text-xs text-muted-foreground">
                  PNG, JPG, WebP up to 5MB each
                </span>
              </Label>
              <Input
                id="portfolio-upload"
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files)}
                disabled={uploading}
              />
            </div>
            {uploading && (
              <div className="mt-4">
                <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
              </div>
            )}
          </div>

          {/* Images Grid */}
          {images.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No portfolio images yet. Upload some to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="group relative aspect-square rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  {/* Image */}
                  <Image
                    src={image.url || '/placeholder.svg'}
                    alt={image.caption || 'Portfolio image'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />

                  {/* Visibility Badge */}
                  <div className="absolute top-2 right-2">
                    <Badge variant={image.isPublic ? 'default' : 'secondary'} className="text-xs">
                      {image.isPublic ? (
                        <><Eye className="h-3 w-3 mr-1" /> Public</>
                      ) : (
                        <><EyeOff className="h-3 w-3 mr-1" /> Private</>
                      )}
                    </Badge>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => openEditDialog(image)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setDeletingImage(image)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Caption */}
                  {image.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2">
                      <p className="text-xs text-white line-clamp-2">{image.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingImage} onOpenChange={(open) => !open && closeEditDialog()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Portfolio Image</DialogTitle>
            <DialogDescription>
              Update image details, tags, and visibility
            </DialogDescription>
          </DialogHeader>

          {editingImage && (
            <form onSubmit={handleSubmit(onSubmitEdit)} className="space-y-6">
              {/* Image Preview */}
              <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={editingImage.url || '/placeholder.svg'}
                  alt={editingImage.caption || 'Portfolio image'}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              {/* Caption */}
              <div className="space-y-2">
                <Label htmlFor="caption">Caption</Label>
                <Textarea
                  id="caption"
                  {...register('caption')}
                  placeholder="Describe this work..."
                  rows={3}
                />
                {errors.caption && (
                  <p className="text-sm text-red-600">{errors.caption.message}</p>
                )}
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag (e.g., Traditional, Portrait)"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Visibility */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="isPublic"
                  checked={watch('isPublic')}
                  onCheckedChange={(checked) => setValue('isPublic', checked)}
                />
                <Label htmlFor="isPublic">Public (visible on artist profile)</Label>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={closeEditDialog}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingImage} onOpenChange={(open) => !open && setDeletingImage(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Portfolio Image?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this image from the portfolio.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
