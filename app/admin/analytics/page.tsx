import { Metadata } from 'next'
import { requireAuth } from '@/lib/auth'
import { UserRole } from '@/types/database'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
// Note: Charts temporarily disabled for build compatibility
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string
  description: string
  trend: 'up' | 'down' | 'neutral'
}

function StatsCard({ title, value, description, trend }: StatsCardProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus
  const trendColor = trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500'
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <TrendIcon className={`h-4 w-4 ${trendColor}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={`text-xs ${trendColor}`}>
          {description}
        </p>
      </CardContent>
    </Card>
  )
}

export const metadata: Metadata = {
  title: 'Analytics - United Tattoo Studio',
  description: 'Analytics and insights for United Tattoo Studio',
}

// Mock data for demonstration
const monthlyBookings = [
  { month: 'Jan', bookings: 45, revenue: 12500 },
  { month: 'Feb', bookings: 52, revenue: 14200 },
  { month: 'Mar', bookings: 48, revenue: 13800 },
  { month: 'Apr', bookings: 61, revenue: 16900 },
  { month: 'May', bookings: 55, revenue: 15200 },
  { month: 'Jun', bookings: 67, revenue: 18500 },
]

const artistPerformance = [
  { name: 'Sarah Chen', bookings: 28, revenue: 8400 },
  { name: 'Marcus Rodriguez', bookings: 24, revenue: 7200 },
  { name: 'Emma Thompson', bookings: 22, revenue: 6600 },
  { name: 'David Kim', bookings: 19, revenue: 5700 },
]

const serviceTypes = [
  { name: 'Traditional', value: 35, color: '#8884d8' },
  { name: 'Realism', value: 25, color: '#82ca9d' },
  { name: 'Geometric', value: 20, color: '#ffc658' },
  { name: 'Watercolor', value: 12, color: '#ff7300' },
  { name: 'Other', value: 8, color: '#00ff88' },
]

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff88']

export default async function AnalyticsPage() {
  // Require admin authentication
  await requireAuth(UserRole.SHOP_ADMIN)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Comprehensive insights and analytics for your tattoo studio
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value="$18,500"
          description="+12% from last month"
          trend="up"
        />
        <StatsCard
          title="Total Bookings"
          value="67"
          description="+8% from last month"
          trend="up"
        />
        <StatsCard
          title="Active Artists"
          value="4"
          description="All artists active"
          trend="neutral"
        />
        <StatsCard
          title="Avg. Session Value"
          value="$276"
          description="+3% from last month"
          trend="up"
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="artists">Artists</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Bookings</CardTitle>
                <CardDescription>
                  Number of bookings over the last 6 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {monthlyBookings.map((month) => (
                    <div key={month.month} className="flex justify-between items-center">
                      <span className="font-medium">{month.month}</span>
                      <span className="text-sm text-muted-foreground">{month.bookings} bookings</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Service Distribution</CardTitle>
                <CardDescription>
                  Breakdown of tattoo styles and services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {serviceTypes.map((service, index) => (
                    <div key={service.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: service.color }}
                        />
                        <span className="font-medium">{service.name}</span>
                      </div>
                      <span className="text-muted-foreground">{service.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trends</CardTitle>
              <CardDescription>
                Monthly revenue over the last 6 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {monthlyBookings.map((month) => (
                  <div key={month.month} className="flex justify-between items-center">
                    <span className="font-medium">{month.month}</span>
                    <span className="text-sm text-muted-foreground">${month.revenue.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="artists" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Artist Performance</CardTitle>
              <CardDescription>
                Bookings and revenue by artist this month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {artistPerformance.map((artist) => (
                  <div key={artist.name} className="flex justify-between items-center">
                    <span className="font-medium">{artist.name}</span>
                    <div className="text-sm text-muted-foreground">
                      {artist.bookings} bookings • ${artist.revenue.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Popular Services</CardTitle>
                <CardDescription>
                  Most requested tattoo styles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {serviceTypes.map((service, index) => (
                    <div key={service.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: service.color }}
                        />
                        <span className="font-medium">{service.name}</span>
                      </div>
                      <span className="text-muted-foreground">{service.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Service Trends</CardTitle>
                <CardDescription>
                  How service preferences have changed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    <p>• Traditional tattoos remain the most popular choice</p>
                    <p>• Realism has grown 15% this quarter</p>
                    <p>• Geometric designs are trending upward</p>
                    <p>• Watercolor requests have stabilized</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
