import { Suspense } from 'react'
import { Metadata } from 'next'
import { PortfolioManager } from '@/components/admin/portfolio-manager'
import { LoadingSpinner } from '@/components/admin/loading-states'

export const metadata: Metadata = {
  title: 'Portfolio Management | United Tattoo Admin',
  description: 'Manage portfolio images and galleries',
}

export default function PortfolioPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Portfolio Management</h1>
        <p className="text-muted-foreground">
          Manage portfolio images, organize galleries, and track performance metrics.
        </p>
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <PortfolioManager />
      </Suspense>
    </div>
  )
}
