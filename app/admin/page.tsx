'use client'

import dynamic from 'next/dynamic'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Users, Calendar, Settings, Upload, BarChart3, Plus, CheckCircle, AlertCircle, UserPlus } from 'lucide-react'
import Link from 'next/link'

// Dynamically import heavy dashboard component to reduce initial bundle size
const StatsDashboard = dynamic(
  () => import('@/components/admin/stats-dashboard').then(mod => ({ default: mod.StatsDashboard })),
  {
    loading: () => (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    ),
    ssr: false,
  }
)

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-base text-muted-foreground">
            Welcome to United Tattoo Studio admin panel
          </p>
        </div>

        <div className="flex gap-2">
          <Link href="/admin/artists/new">
            <Button>
              <Plus className="h-5 w-5 mr-2" />
              Add Artist
            </Button>
          </Link>
          <Link href="/admin/calendar">
            <Button variant="outline">
              <Calendar className="h-5 w-5 mr-2" />
              Schedule
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/admin/artists">
          <Card className="hover:shadow-md transition-shadow cursor-pointer" role="article" aria-label="Manage Artists - Add, edit, and manage artist profiles and portfolios">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">Manage Artists</CardTitle>
              <Users className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Add, edit, and manage artist profiles and portfolios
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/calendar">
          <Card className="hover:shadow-md transition-shadow cursor-pointer" role="article" aria-label="Appointments - View and manage studio appointments and scheduling">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">Appointments</CardTitle>
              <Calendar className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                View and manage studio appointments and scheduling
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/uploads">
          <Card className="hover:shadow-md transition-shadow cursor-pointer" role="article" aria-label="File Manager - Upload and manage portfolio images and files">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">File Manager</CardTitle>
              <Upload className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Upload and manage portfolio images and files
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/settings">
          <Card className="hover:shadow-md transition-shadow cursor-pointer" role="article" aria-label="Studio Settings - Configure studio information and preferences">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">Studio Settings</CardTitle>
              <Settings className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Configure studio information and preferences
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Analytics Dashboard */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="h-6 w-6" />
          <h2 className="text-xl font-semibold">Analytics & Statistics</h2>
        </div>
        <StatsDashboard />
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4" role="list" aria-label="Recent activity feed">
            <div className="flex items-center justify-between py-2 border-b" role="listitem">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-green-500" aria-label="Success" />
                <span className="text-sm">New appointment scheduled</span>
              </div>
              <Badge variant="secondary">2 min ago</Badge>
            </div>

            <div className="flex items-center justify-between py-2 border-b" role="listitem">
              <div className="flex items-center gap-3">
                <Upload className="w-4 h-4 text-blue-500" aria-label="Upload" />
                <span className="text-sm">Portfolio image uploaded</span>
              </div>
              <Badge variant="secondary">15 min ago</Badge>
            </div>

            <div className="flex items-center justify-between py-2 border-b" role="listitem">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-4 h-4 text-yellow-500" aria-label="Update" />
                <span className="text-sm">Artist profile updated</span>
              </div>
              <Badge variant="secondary">1 hour ago</Badge>
            </div>

            <div className="flex items-center justify-between py-2" role="listitem">
              <div className="flex items-center gap-3">
                <UserPlus className="w-4 h-4 text-purple-500" aria-label="New user" />
                <span className="text-sm">New client registered</span>
              </div>
              <Badge variant="secondary">3 hours ago</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
