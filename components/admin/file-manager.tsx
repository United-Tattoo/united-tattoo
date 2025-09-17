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
  Folder, 
  File,
  Image as ImageIcon,
  FileText,
  Video,
  Music,
  Archive,
  Plus,
  X,
  FolderPlus,
  Move,
  Copy,
  MoreHorizontal,
  Calendar,
  HardDrive,
  BarChart3
} from 'lucide-react'
import Image from 'next/image'
import { FileUpload } from '@/types/database'

interface FileNode {
  id: string
  name: string
  type: 'file' | 'folder'
  size?: number
  mimeType?: string
  url?: string
  createdAt: Date
  children?: FileNode[]
  path: string
}

interface FileStats {
  totalFiles: number
  totalSize: string
  recentUploads: number
  storageUsed: string
  fileTypes: { [key: string]: number }
}

export function FileManager() {
  const [files, setFiles] = useState<FileNode[]>([])
  const [stats, setStats] = useState<FileStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'tree'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set())
  const [currentPath, setCurrentPath] = useState('/')
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  
  const { toast } = useToast()
  const { uploadFiles, isUploading, progress } = useFileUpload({
    maxFiles: 50,
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/*', 'video/*', 'audio/*', 'application/pdf', 'text/*'],
  })

  useEffect(() => {
    loadFiles()
    loadStats()
  }, [currentPath])

  const loadFiles = async () => {
    try {
      const response = await fetch(`/api/files?path=${encodeURIComponent(currentPath)}`)
      if (!response.ok) throw new Error('Failed to load files')
      const data = await response.json()
      setFiles(data)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load files',
        variant: 'destructive',
      })
    }
  }

  const loadStats = async () => {
    try {
      const response = await fetch('/api/files/stats')
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
      await uploadFiles(fileArray, { keyPrefix: currentPath.replace('/', '') })
      await loadFiles()
      await loadStats()
      setShowUploadDialog(false)
      toast({
        title: 'Success',
        description: `Uploaded ${fileArray.length} files successfully`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload files',
        variant: 'destructive',
      })
    }
  }

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return
    
    try {
      const response = await fetch('/api/files/folder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: newFolderName,
          path: currentPath 
        }),
      })
      
      if (!response.ok) throw new Error('Failed to create folder')
      
      await loadFiles()
      setShowNewFolderDialog(false)
      setNewFolderName('')
      toast({
        title: 'Success',
        description: 'Folder created successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create folder',
        variant: 'destructive',
      })
    }
  }

  const handleDeleteFiles = async () => {
    try {
      const response = await fetch('/api/files/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileIds: Array.from(selectedFiles) }),
      })
      
      if (!response.ok) throw new Error('Failed to delete files')
      
      await loadFiles()
      await loadStats()
      setSelectedFiles(new Set())
      toast({
        title: 'Success',
        description: `Deleted ${selectedFiles.size} items successfully`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete files',
        variant: 'destructive',
      })
    }
  }

  const toggleFileSelection = (fileId: string) => {
    const newSelection = new Set(selectedFiles)
    if (newSelection.has(fileId)) {
      newSelection.delete(fileId)
    } else {
      newSelection.add(fileId)
    }
    setSelectedFiles(newSelection)
  }

  const getFileIcon = (file: FileNode) => {
    if (file.type === 'folder') return <Folder className="h-4 w-4" />
    
    if (file.mimeType?.startsWith('image/')) return <ImageIcon className="h-4 w-4" />
    if (file.mimeType?.startsWith('video/')) return <Video className="h-4 w-4" />
    if (file.mimeType?.startsWith('audio/')) return <Music className="h-4 w-4" />
    if (file.mimeType?.includes('pdf')) return <FileText className="h-4 w-4" />
    if (file.mimeType?.includes('zip') || file.mimeType?.includes('archive')) return <Archive className="h-4 w-4" />
    
    return <File className="h-4 w-4" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const breadcrumbs = currentPath.split('/').filter(Boolean)

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
                <CardTitle className="text-sm font-medium">Total Files</CardTitle>
                <File className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalFiles}</div>
                <p className="text-xs text-muted-foreground">
                  +{stats.recentUploads} this week
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
                <HardDrive className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.storageUsed}</div>
                <p className="text-xs text-muted-foreground">
                  R2 storage usage
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Images</CardTitle>
                <ImageIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.fileTypes.image || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Image files
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Documents</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.fileTypes.document || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Document files
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* File Manager Controls */}
        <Card>
          <CardHeader>
            <CardTitle>File Manager</CardTitle>
            <CardDescription>
              Manage your uploaded files and organize your storage.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPath('/')}
                className="h-auto p-1"
              >
                Home
              </Button>
              {breadcrumbs.map((crumb, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span>/</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentPath('/' + breadcrumbs.slice(0, index + 1).join('/'))}
                    className="h-auto p-1"
                  >
                    {crumb}
                  </Button>
                </div>
              ))}
            </div>

            {/* Search and Controls */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-1 items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Dialog open={showNewFolderDialog} onOpenChange={setShowNewFolderDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <FolderPlus className="mr-2 h-4 w-4" />
                      New Folder
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Folder</DialogTitle>
                      <DialogDescription>
                        Enter a name for the new folder.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="folderName">Folder Name</Label>
                        <Input
                          id="folderName"
                          value={newFolderName}
                          onChange={(e) => setNewFolderName(e.target.value)}
                          placeholder="Enter folder name"
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setShowNewFolderDialog(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreateFolder}>
                          Create
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Upload Files
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Upload Files</DialogTitle>
                      <DialogDescription>
                        Select files to upload to the current directory.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="files">Select Files</Label>
                        <Input
                          id="files"
                          type="file"
                          multiple
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
              </div>
            </div>

            {/* Action Bar */}
            {selectedFiles.size > 0 && (
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">
                  {selectedFiles.size} item(s) selected
                </span>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Move className="mr-2 h-4 w-4" />
                    Move
                  </Button>
                  <Button variant="outline" size="sm">
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Files</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete {selectedFiles.size} selected items? 
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteFiles}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <Button variant="outline" size="sm" onClick={() => setSelectedFiles(new Set())}>
                    <X className="mr-2 h-4 w-4" />
                    Clear
                  </Button>
                </div>
              </div>
            )}

            {/* View Mode Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">View:</span>
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
                    className="rounded-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'tree' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('tree')}
                    className="rounded-l-none"
                  >
                    <Folder className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <span className="text-sm text-muted-foreground">
                {filteredFiles.length} items
              </span>
            </div>
          </CardContent>
        </Card>

        {/* File Grid/List */}
        <div className="space-y-4">
          {viewMode === 'grid' ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredFiles.map((file) => (
                <Card key={file.id} className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
                  <div className="relative aspect-square bg-muted flex items-center justify-center">
                    {file.type === 'file' && file.mimeType?.startsWith('image/') && file.url ? (
                      <Image
                        src={file.url}
                        alt={file.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="text-muted-foreground">
                        {getFileIcon(file)}
                      </div>
                    )}
                    <div className="absolute top-2 left-2">
                      <Checkbox
                        checked={selectedFiles.has(file.id)}
                        onCheckedChange={() => toggleFileSelection(file.id)}
                        className="bg-background"
                      />
                    </div>
                    <div className="absolute top-2 right-2">
                      <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold truncate">{file.name}</h4>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{file.type === 'file' && file.size ? formatFileSize(file.size) : 'Folder'}</span>
                        <span>{new Date(file.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredFiles.map((file) => (
                <Card key={file.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <Checkbox
                        checked={selectedFiles.has(file.id)}
                        onCheckedChange={() => toggleFileSelection(file.id)}
                      />
                      <div className="flex items-center space-x-2">
                        {getFileIcon(file)}
                        <span className="font-medium">{file.name}</span>
                      </div>
                      <div className="flex-1" />
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>{file.type === 'file' && file.size ? formatFileSize(file.size) : 'Folder'}</span>
                        <span>{new Date(file.createdAt).toLocaleDateString()}</span>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {filteredFiles.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Folder className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No files found</h3>
                <p className="text-muted-foreground text-center mb-4">
                  {searchTerm 
                    ? 'Try adjusting your search terms'
                    : 'This directory is empty. Upload some files to get started.'}
                </p>
                {!searchTerm && (
                  <Button onClick={() => setShowUploadDialog(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Upload Files
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
