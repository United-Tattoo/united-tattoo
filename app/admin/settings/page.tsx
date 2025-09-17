import { Suspense } from 'react'
import { Metadata } from 'next'
import { SettingsManager } from '@/components/admin/settings-manager'
import { LoadingSpinner } from '@/components/admin/loading-states'

export const metadata: Metadata = {
  title: 'Settings | United Tattoo Admin',
  description: 'Manage studio settings and configuration',
}

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage studio settings, user permissions, and system configuration.
        </p>
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <SettingsManager />
      </Suspense>
    </div>
  )
}
