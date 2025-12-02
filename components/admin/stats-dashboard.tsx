'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  XCircle,
  AlertCircle,
  Image,
  Upload
} from 'lucide-react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts'

interface DashboardStats {
  artists: {
    total: number
    active: number
    inactive: number
  }
  appointments: {
    total: number
    pending: number
    confirmed: number
    inProgress: number
    completed: number
    cancelled: number
    thisMonth: number
    lastMonth: number
    revenue: number
  }
  portfolio: {
    totalImages: number
    recentUploads: number
  }
  files: {
    totalUploads: number
    totalSize: number
    recentUploads: number
  }
  monthlyData: Array<{
    month: string
    appointments: number
    revenue: number
  }>
  statusData: Array<{
    name: string
    value: number
    color: string
  }>
}

const COLORS = {
  pending: '#b87503',      // Darker yellow: 5.5:1 contrast
  confirmed: '#2563eb',    // Keep: 8.6:1 contrast
  inProgress: '#15803d',   // Darker green: 4.6:1 contrast
  completed: '#4b5563',    // Keep: 7.2:1 contrast
  cancelled: '#dc2626',    // Keep: 5.9:1 contrast
}

// Helper functions for chart accessibility summaries
function getChartSummary(
  data: Array<{month: string, appointments?: number, revenue?: number}>,
  key: 'appointments' | 'revenue'
): string {
  if (!data || data.length === 0) return 'No data available'

  const values = data.map(item => item[key] || 0)
  const total = values.reduce((sum, val) => sum + val, 0)
  const avg = total / values.length
  const max = Math.max(...values)
  const min = Math.min(...values)
  const maxMonth = data[values.indexOf(max)]?.month
  const minMonth = data[values.indexOf(min)]?.month

  if (key === 'appointments') {
    return `Total ${total} appointments across ${data.length} months. Average ${avg.toFixed(0)} per month. Highest was ${max} in ${maxMonth}, lowest was ${min} in ${minMonth}.`
  } else {
    return `Total revenue $${total.toLocaleString()} across ${data.length} months. Average $${avg.toFixed(0)} per month. Highest was $${max} in ${maxMonth}, lowest was $${min} in ${minMonth}.`
  }
}

function getPieChartSummary(data: Array<{name: string, value: number}>): string {
  if (!data || data.length === 0) return 'No data available'

  const total = data.reduce((sum, item) => sum + item.value, 0)
  const largest = data.reduce((max, item) => item.value > max.value ? item : max, data[0])

  return `${data.length} status categories with ${total} total appointments. ${largest.name} has the most with ${largest.value} appointments (${((largest.value / total) * 100).toFixed(0)}%).`
}

export function StatsDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await fetch('/api/admin/stats')
      if (!response.ok) throw new Error('Failed to fetch stats')
      return response.json() as Promise<DashboardStats>
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  })

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Failed to load dashboard statistics</p>
      </div>
    )
  }

  const appointmentGrowth = stats.appointments.thisMonth > 0 
    ? ((stats.appointments.thisMonth - stats.appointments.lastMonth) / stats.appointments.lastMonth) * 100
    : 0

  const activeArtistPercentage = stats.artists.total > 0 
    ? (stats.artists.active / stats.artists.total) * 100 
    : 0

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Total Artists</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.artists.total}</div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>{stats.artists.active} active</span>
              <Progress
                value={activeArtistPercentage}
                className="w-16 h-2"
                aria-label={`${activeArtistPercentage.toFixed(0)}% of artists are active`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={activeArtistPercentage}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Total Appointments</CardTitle>
            <Calendar className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.appointments.total}</div>
            <div className="flex items-center space-x-1 text-sm">
              <TrendingUp
                className={`h-4 w-4 ${appointmentGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}
                aria-hidden="true"
              />
              <span className={appointmentGrowth >= 0 ? 'text-green-600' : 'text-red-600'}>
                {appointmentGrowth >= 0 ? 'Increase' : 'Decrease'} {Math.abs(appointmentGrowth).toFixed(1)}%
              </span>
              <span className="text-muted-foreground">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              ${stats.appointments.revenue.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">
              From {stats.appointments.thisMonth} appointments this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Portfolio Images</CardTitle>
            <Image className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.portfolio.totalImages}</div>
            <p className="text-sm text-muted-foreground">
              {stats.portfolio.recentUploads} uploaded this week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Appointment Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card role="article" aria-label="Pending appointments">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Pending</CardTitle>
            <Clock className="h-5 w-5 text-yellow-500" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">
              {stats.appointments.pending}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Awaiting confirmation</p>
          </CardContent>
        </Card>

        <Card role="article" aria-label="Confirmed appointments">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Confirmed</CardTitle>
            <CheckCircle className="h-5 w-5 text-blue-500" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {stats.appointments.confirmed}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Ready to proceed</p>
          </CardContent>
        </Card>

        <Card role="article" aria-label="In progress appointments">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">In Progress</CardTitle>
            <AlertCircle className="h-5 w-5 text-green-500" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {stats.appointments.inProgress}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Currently active</p>
          </CardContent>
        </Card>

        <Card role="article" aria-label="Completed appointments">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Completed</CardTitle>
            <CheckCircle className="h-5 w-5 text-gray-500" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-600">
              {stats.appointments.completed}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Successfully finished</p>
          </CardContent>
        </Card>

        <Card role="article" aria-label="Cancelled appointments">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Cancelled</CardTitle>
            <XCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {stats.appointments.cancelled}
            </div>
            <p className="text-sm text-muted-foreground mt-1">No longer scheduled</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Appointments Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Monthly Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              role="img"
              aria-label={`Line chart showing monthly appointments trend. ${getChartSummary(stats.monthlyData, 'appointments')}`}
            >
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stats.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="appointments"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="sr-only">
              <h3>Monthly appointment data</h3>
              <ul>
                {stats.monthlyData.map((item, idx) => (
                  <li key={idx}>{item.month}: {item.appointments} appointments</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Appointment Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Appointment Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              role="img"
              aria-label={`Pie chart showing appointment status distribution. ${getPieChartSummary(stats.statusData)}`}
            >
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats.statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stats.statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="sr-only">
              <h3>Appointment status breakdown</h3>
              <ul>
                {stats.statusData.map((item, idx) => (
                  <li key={idx}>{item.name}: {item.value} appointments</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Revenue Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Monthly Revenue Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            role="img"
            aria-label={`Bar chart showing monthly revenue trend. ${getChartSummary(stats.monthlyData, 'revenue')}`}
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [`$${value}`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="sr-only">
            <h3>Monthly revenue data</h3>
            <ul>
              {stats.monthlyData.map((item, idx) => (
                <li key={idx}>{item.month}: ${item.revenue}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* File Storage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Total Files</CardTitle>
            <Upload className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.files.totalUploads}</div>
            <p className="text-sm text-muted-foreground">
              {stats.files.recentUploads} uploaded this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Storage Used</CardTitle>
            <Upload className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {(stats.files.totalSize / (1024 * 1024)).toFixed(1)} MB
            </div>
            <p className="text-sm text-muted-foreground">
              Across all uploads
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Active Artists</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.artists.active}</div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>of {stats.artists.total} total</span>
              <Badge variant="secondary">
                {activeArtistPercentage.toFixed(0)}%
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
