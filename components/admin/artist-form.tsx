"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { X, Plus, Upload } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useFileUpload } from '@/hooks/use-file-upload'
import type { Artist } from '@/types/database'

const artistFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  bio: z.string().min(10, 'Bio must be at least 10 characters'),
  specialties: z.array(z.string()).min(1, 'At least one specialty is required'),
  instagramHandle: z.string().optional(),
  hourlyRate: z.number().min(0).optional(),
  isActive: z.boolean().default(true),
  email: z.string().email().optional(),
})

type ArtistFormData = z.infer<typeof artistFormSchema>

interface ArtistFormProps {
  artist?: Artist
  onSuccess?: () => void
}

export function ArtistForm({ artist, onSuccess }: ArtistFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newSpecialty, setNewSpecialty] = useState('')
  
  const {
    uploadFiles,
    progress,
    isUploading,
    error: uploadError,
    clearProgress
  } = useFileUpload({
    maxFiles: 10,
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  })

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<ArtistFormData>({
    resolver: zodResolver(artistFormSchema),
    defaultValues: {
      name: artist?.name || '',
      bio: artist?.bio || '',
      specialties: artist?.specialties ? (typeof artist.specialties === 'string' ? JSON.parse(artist.specialties) : artist.specialties) : [],
      instagramHandle: artist?.instagramHandle || '',
      hourlyRate: artist?.hourlyRate || undefined,
      isActive: artist?.isActive !== false,
      email: '',
    }
  })

  const specialties = watch('specialties')

  const addSpecialty = () => {
    if (newSpecialty.trim() && !specialties.includes(newSpecialty.trim())) {
      setValue('specialties', [...specialties, newSpecialty.trim()])
      setNewSpecialty('')
    }
  }

  const removeSpecialty = (specialty: string) => {
    setValue('specialties', specialties.filter(s => s !== specialty))
  }

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    const fileArray = Array.from(files)
    await uploadFiles(fileArray, {
      keyPrefix: artist ? `portfolio/${artist.id}` : 'temp-portfolio'
    })
  }

  const onSubmit = async (data: ArtistFormData) => {
    setIsSubmitting(true)
    
    try {
      const url = artist ? `/api/artists/${artist.id}` : '/api/artists'
      const method = artist ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save artist')
      }

      const result = await response.json()
      
      toast({
        title: 'Success',
        description: artist ? 'Artist updated successfully' : 'Artist created successfully',
      })

      onSuccess?.()
      
      if (!artist) {
        router.push(`/admin/artists/${result.artist.id}`)
      }
    } catch (error) {
      console.error('Form submission error:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save artist',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {artist ? 'Edit Artist' : 'Create New Artist'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="Artist name"
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="artist@unitedtattoo.com"
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Bio *</Label>
              <Textarea
                id="bio"
                {...register('bio')}
                placeholder="Tell us about this artist..."
                rows={4}
              />
              {errors.bio && (
                <p className="text-sm text-red-600">{errors.bio.message}</p>
              )}
            </div>

            {/* Specialties */}
            <div className="space-y-2">
              <Label>Specialties *</Label>
              <div className="flex gap-2">
                <Input
                  value={newSpecialty}
                  onChange={(e) => setNewSpecialty(e.target.value)}
                  placeholder="Add a specialty"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialty())}
                />
                <Button type="button" onClick={addSpecialty} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {specialties.map((specialty) => (
                  <Badge key={specialty} variant="secondary" className="flex items-center gap-1">
                    {specialty}
                    <button
                      type="button"
                      onClick={() => removeSpecialty(specialty)}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              {errors.specialties && (
                <p className="text-sm text-red-600">{errors.specialties.message}</p>
              )}
            </div>

            {/* Social Media & Rates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="instagramHandle">Instagram Handle</Label>
                <Input
                  id="instagramHandle"
                  {...register('instagramHandle')}
                  placeholder="@username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  step="0.01"
                  {...register('hourlyRate', { valueAsNumber: true })}
                  placeholder="150.00"
                />
              </div>
            </div>

            {/* Active Status */}
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={watch('isActive')}
                onCheckedChange={(checked) => setValue('isActive', checked)}
              />
              <Label htmlFor="isActive">Active Artist</Label>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : artist ? 'Update Artist' : 'Create Artist'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Portfolio Upload Section */}
      {artist && (
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <Label htmlFor="portfolio-upload" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      Upload portfolio images
                    </span>
                    <span className="mt-1 block text-sm text-gray-500">
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
                  />
                </div>
              </div>

              {/* Upload Progress */}
              {progress.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Upload Progress</h4>
                  {progress.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">{file.filename}</span>
                      <div className="flex items-center gap-2">
                        {file.status === 'uploading' && (
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${file.progress}%` }}
                            />
                          </div>
                        )}
                        {file.status === 'complete' && (
                          <Badge variant="default">Complete</Badge>
                        )}
                        {file.status === 'error' && (
                          <Badge variant="destructive">Error</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={clearProgress}
                  >
                    Clear Progress
                  </Button>
                </div>
              )}

              {uploadError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                  {uploadError}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
