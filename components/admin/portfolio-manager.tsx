'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'
import { useFileUpload } from '@/hooks/use-file-upload'
import { LoadingSpinner } from './loading-states'
import { ErrorBoundary } from './error-boundary'
import { 
  Upload, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Eye, 
  Edit, 
  Trash2, 
  Download, 
  Star, 
  Calendar,
  User,
  Tag,
  BarChart3,
  Image as ImageIcon,
  Plus,
  X
} from 'lucide-react'
import Image from 'next/image'
import { PortfolioImage, Artist } from '@/types/database'

interface PortfolioStats {
  totalImages: number
  totalViews: number
  totalLikes: number
  averageRating: number
  storageUsed: string
  recentUploads: number
}

export function PortfolioManager() {
  const [portfolioImages, setPortfolioImages] = useState<PortfolioImage[]>([])
  const [artists, setArtists] = useState<Artist[]>([])
  const [stats, setStats] = useState<PortfolioStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedArtist, setSelectedArtist] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set())
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  
  const { toast } = useToast()
  const { uploadFiles, isUploading, progress } = useFileUpload({
    maxFiles: 20,
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  })

  useEffect(() => {
    loadPortfolioData()
    loadArtists()
    loadStats()
  }, [])

  const loadPortfolioData = async () => {
    try {
      const response = await fetch('/api/portfolio')
      if (!response.ok) throw new Error('Failed to load portfolio')
      const data = await response.json()
      setPortfolioImages(data)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load portfolio images',
        variant: 'destructive',
      })
    }
  }

  const loadArtists = async () => {
    try {
      const response = await fetch('/api/artists')
      if (!response.ok) throw new Error('Failed to load artists')
      const data = await response.json()
      setArtists(data)
    } catch (error) {
      console.error('Failed to load artists:', error)
    }
  }

  const loadStats = async () => {
    try {
      const response = await fetch('/api/portfolio/stats')
      if (!response.ok) throw new Error('Failed to load stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Failed to load stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (files: FileList) => {
    try {
      const fileArray = Array.from(files)
      await uploadFiles(fileArray)
      await loadPortfolioData()
      await loadStats()
      setShowUploadDialog(false)
      toast({
        title: 'Success',
        description: `Uploaded ${fileArray.length} images successfully`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload images',
        variant: 'destructive',
      })
    }
  }

  const handleDeleteImage = async (imageId: string) => {
    try {
      const response = await fetch(`/api/portfolio/${imageId}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete image')
      
      await loadPortfolioData()
      await loadStats()
      toast({
        title: 'Success',
        description: 'Image deleted successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete image',
        variant: 'destructive',
      })
    }
  }

  const handleBulkDelete = async () => {
    try {
      const response = await fetch('/api/portfolio/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageIds: Array.from(selectedImages) }),
      })
      if (!response.ok) throw new Error('Failed to delete images')
      
      await loadPortfolioData()
      await loadStats()
      setSelectedImages(new Set())
      toast({
        title: 'Success',
        description: `Deleted ${selectedImages.size} images successfully`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete images',
        variant: 'destructive',
      })
    }
  }

  const toggleImageSelection = (imageId: string) => {
    const newSelection = new Set(selectedImages)
    if (newSelection.has(imageId)) {
      newSelection.delete(imageId)
    } else {
      newSelection.add(imageId)
    }
    setSelectedImages(newSelection)
  }

  const selectAllImages = () => {
    setSelectedImages(new Set(filteredImages.map(img => img.id)))
  }

  const clearSelection = () => {
    setSelectedImages(new Set())
  }

  const filteredImages = portfolioImages.filter(image => {
    const matchesSearch = image.caption?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         image.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesArtist = selectedArtist === 'all' || image.artistId === selectedArtist
    
    return matchesSearch && matchesArtist
  })

  const categories = ['Traditional', 'Realism', 'Blackwork', 'Watercolor', 'Geometric', 'Japanese']

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Stats Cards */}
        {stats && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Images</CardTitle>
                <ImageIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalImages}</div>
                <p className="text-xs text-muted-foreground">
                  +{stats.recentUploads} this week
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Portfolio engagement
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</div>
                <p className="text-xs text-muted-foreground">
                  Out of 5.0 stars
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.storageUsed}</div>
                <p className="text-xs text-muted-foreground">
                  R2 storage usage
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Management</CardTitle>
            <CardDescription>
              Manage your portfolio images, organize galleries, and track performance.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search and Filters */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-1 items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search images..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Select value={selectedArtist} onValueChange={setSelectedArtist}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by artist" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Artists</SelectItem>
                    {artists.map((artist) => (
                      <SelectItem key={artist.id} value={artist.id}>
                        {artist.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Upload Images
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Upload Portfolio Images</DialogTitle>
                      <DialogDescription>
                        Select multiple images to upload to the portfolio.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="images">Select Images</Label>
                        <Input
                          id="images"
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                          disabled={isUploading}
                        />
                      </div>
                      {isUploading && (
                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">
                            Uploading... {progress.length > 0 ? Math.round(progress[0].progress || 0) : 0}%
                          </div>
                          <div className="w-full bg-secondary rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${progress.length > 0 ? progress[0].progress || 0 : 0}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>

                {selectedImages.size > 0 && (
                  <>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Selected ({selectedImages.size})
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Images</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete {selectedImages.size} selected images? 
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleBulkDelete}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    
                    <Button variant="outline" size="sm" onClick={clearSelection}>
                      <X className="mr-2 h-4 w-4" />
                      Clear Selection
                    </Button>
                  </>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={selectedImages.size === filteredImages.length ? clearSelection : selectAllImages}
                >
                  {selectedImages.size === filteredImages.length ? 'Deselect All' : 'Select All'}
                </Button>
                
                <div className="flex items-center border rounded-md">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Portfolio Grid/List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Portfolio Images ({filteredImages.length})
            </h3>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredImages.map((image) => (
                <Card key={image.id} className="overflow-hidden">
                  <div className="relative aspect-square">
                    <Image
                      src={image.url}
                      alt={image.caption || 'Portfolio image'}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <Checkbox
                        checked={selectedImages.has(image.id)}
                        onCheckedChange={() => toggleImageSelection(image.id)}
                        className="bg-background"
                      />
                    </div>
                    <div className="absolute top-2 right-2 flex space-x-1">
                      <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="destructive" className="h-8 w-8 p-0">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Image</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this image? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteImage(image.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold truncate">{image.caption || 'Untitled'}</h4>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{artists.find(a => a.id === image.artistId)?.name || 'Unknown'}</span>
                        <span>{new Date(image.createdAt).toLocaleDateString()}</span>
                      </div>
                      {image.tags && image.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {image.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {image.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{image.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredImages.map((image) => (
                <Card key={image.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <Checkbox
                        checked={selectedImages.has(image.id)}
                        onCheckedChange={() => toggleImageSelection(image.id)}
                      />
                      <div className="relative h-16 w-16 flex-shrink-0">
                        <Image
                          src={image.url}
                          alt={image.caption || 'Portfolio image'}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <h4 className="font-semibold">{image.caption || 'Untitled'}</h4>
                        <p className="text-sm text-muted-foreground">
                          {artists.find(a => a.id === image.artistId)?.name || 'Unknown Artist'}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">Portfolio</Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(image.createdAt).toLocaleDateString()}
                        </span>
                        <div className="flex space-x-1">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Image</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this image? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteImage(image.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {filteredImages.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No images found</h3>
                <p className="text-muted-foreground text-center mb-4">
                  {searchTerm || selectedArtist !== 'all' || selectedCategory !== 'all'
                    ? 'Try adjusting your search or filters'
                    : 'Upload your first portfolio images to get started'}
                </p>
                {!searchTerm && selectedArtist === 'all' && selectedCategory === 'all' && (
                  <Button onClick={() => setShowUploadDialog(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Upload Images
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ErrorBoundary>
  )
}
