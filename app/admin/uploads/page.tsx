import { Suspense } from 'react'
import { Metadata } from 'next'
import { FileManager } from '@/components/admin/file-manager'
import { LoadingSpinner } from '@/components/admin/loading-states'

export const metadata: Metadata = {
  title: 'File Manager | United Tattoo Admin',
  description: 'Manage uploaded files and storage',
}

export default function UploadsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">File Manager</h1>
        <p className="text-muted-foreground">
          Manage uploaded files, organize storage, and monitor usage.
        </p>
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <FileManager />
      </Suspense>
    </div>
  )
}
