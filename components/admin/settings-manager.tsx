'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import { LoadingSpinner } from './loading-states'
import { ErrorBoundary } from './error-boundary'
import { 
  Settings, 
  Building, 
  Users, 
  Shield, 
  Bell, 
  Palette, 
  Globe, 
  Mail,
  Phone,
  MapPin,
  Clock,
  Save,
  Upload,
  Image as ImageIcon
} from 'lucide-react'
import { SiteSettings, BusinessHours, SocialMediaLinks } from '@/types/database'

interface StudioSettings extends SiteSettings {
  // Additional settings not in the base type
  emailNotifications: boolean
  smsNotifications: boolean
  bookingEnabled: boolean
  onlinePayments: boolean
  requireDeposit: boolean
  depositAmount: number
  cancellationPolicy: string
  theme: 'light' | 'dark' | 'system'
  language: string
  timezone: string
}

export function SettingsManager() {
  const [settings, setSettings] = useState<Partial<StudioSettings>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  
  const { toast } = useToast()

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/settings')
      if (!response.ok) throw new Error('Failed to load settings')
      const data = await response.json()
      setSettings(data)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load settings',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      
      if (!response.ok) throw new Error('Failed to save settings')
      
      toast({
        title: 'Success',
        description: 'Settings saved successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save settings',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const updateNestedSetting = (parent: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent as keyof StudioSettings] as any),
        [key]: value
      }
    }))
  }

  const updateBusinessHours = (dayIndex: number, field: string, value: any) => {
    const businessHours = [...(settings.businessHours || [])]
    if (!businessHours[dayIndex]) {
      businessHours[dayIndex] = {
        dayOfWeek: dayIndex,
        openTime: '09:00',
        closeTime: '17:00',
        isClosed: false
      }
    }
    businessHours[dayIndex] = { ...businessHours[dayIndex], [field]: value }
    updateSetting('businessHours', businessHours)
  }

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="general">
              <Building className="mr-2 h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="business">
              <Clock className="mr-2 h-4 w-4" />
              Business
            </TabsTrigger>
            <TabsTrigger value="booking">
              <Bell className="mr-2 h-4 w-4" />
              Booking
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="mr-2 h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="appearance">
              <Palette className="mr-2 h-4 w-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="advanced">
              <Settings className="mr-2 h-4 w-4" />
              Advanced
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Studio Information</CardTitle>
                <CardDescription>
                  Basic information about your tattoo studio.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="studioName">Studio Name</Label>
                    <Input
                      id="studioName"
                      value={settings.studioName || ''}
                      onChange={(e) => updateSetting('studioName', e.target.value)}
                      placeholder="United Tattoo Studio"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={settings.phone || ''}
                      onChange={(e) => updateSetting('phone', e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={settings.description || ''}
                    onChange={(e) => updateSetting('description', e.target.value)}
                    placeholder="Describe your studio..."
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={settings.address || ''}
                    onChange={(e) => updateSetting('address', e.target.value)}
                    placeholder="123 Main St, City, State 12345"
                    rows={2}
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Contact Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email || ''}
                    onChange={(e) => updateSetting('email', e.target.value)}
                    placeholder="contact@unitedtattoo.com"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Social Media</CardTitle>
                <CardDescription>
                  Connect your social media accounts.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input
                      id="instagram"
                      value={settings.socialMedia?.instagram || ''}
                      onChange={(e) => updateNestedSetting('socialMedia', 'instagram', e.target.value)}
                      placeholder="@unitedtattoo"
                    />
                  </div>
                  <div>
                    <Label htmlFor="facebook">Facebook</Label>
                    <Input
                      id="facebook"
                      value={settings.socialMedia?.facebook || ''}
                      onChange={(e) => updateNestedSetting('socialMedia', 'facebook', e.target.value)}
                      placeholder="facebook.com/unitedtattoo"
                    />
                  </div>
                  <div>
                    <Label htmlFor="twitter">Twitter</Label>
                    <Input
                      id="twitter"
                      value={settings.socialMedia?.twitter || ''}
                      onChange={(e) => updateNestedSetting('socialMedia', 'twitter', e.target.value)}
                      placeholder="@unitedtattoo"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tiktok">TikTok</Label>
                    <Input
                      id="tiktok"
                      value={settings.socialMedia?.tiktok || ''}
                      onChange={(e) => updateNestedSetting('socialMedia', 'tiktok', e.target.value)}
                      placeholder="@unitedtattoo"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Business Hours */}
          <TabsContent value="business" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Business Hours</CardTitle>
                <CardDescription>
                  Set your studio's operating hours for each day of the week.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {dayNames.map((day, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-24">
                      <Label>{day}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={!settings.businessHours?.[index]?.isClosed}
                        onCheckedChange={(checked) => updateBusinessHours(index, 'isClosed', !checked)}
                      />
                      <span className="text-sm text-muted-foreground">Open</span>
                    </div>
                    {!settings.businessHours?.[index]?.isClosed && (
                      <>
                        <Input
                          type="time"
                          value={settings.businessHours?.[index]?.openTime || '09:00'}
                          onChange={(e) => updateBusinessHours(index, 'openTime', e.target.value)}
                          className="w-32"
                        />
                        <span className="text-muted-foreground">to</span>
                        <Input
                          type="time"
                          value={settings.businessHours?.[index]?.closeTime || '17:00'}
                          onChange={(e) => updateBusinessHours(index, 'closeTime', e.target.value)}
                          className="w-32"
                        />
                      </>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Booking Settings */}
          <TabsContent value="booking" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Booking Configuration</CardTitle>
                <CardDescription>
                  Configure how customers can book appointments.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Online Booking</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow customers to book appointments online
                    </p>
                  </div>
                  <Switch
                    checked={settings.bookingEnabled || false}
                    onCheckedChange={(checked) => updateSetting('bookingEnabled', checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Online Payments</Label>
                    <p className="text-sm text-muted-foreground">
                      Accept payments through the website
                    </p>
                  </div>
                  <Switch
                    checked={settings.onlinePayments || false}
                    onCheckedChange={(checked) => updateSetting('onlinePayments', checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Require Deposit</Label>
                    <p className="text-sm text-muted-foreground">
                      Require a deposit for all bookings
                    </p>
                  </div>
                  <Switch
                    checked={settings.requireDeposit || false}
                    onCheckedChange={(checked) => updateSetting('requireDeposit', checked)}
                  />
                </div>
                
                {settings.requireDeposit && (
                  <div>
                    <Label htmlFor="depositAmount">Deposit Amount ($)</Label>
                    <Input
                      id="depositAmount"
                      type="number"
                      value={settings.depositAmount || 50}
                      onChange={(e) => updateSetting('depositAmount', parseInt(e.target.value))}
                      className="w-32"
                    />
                  </div>
                )}
                
                <div>
                  <Label htmlFor="cancellationPolicy">Cancellation Policy</Label>
                  <Textarea
                    id="cancellationPolicy"
                    value={settings.cancellationPolicy || ''}
                    onChange={(e) => updateSetting('cancellationPolicy', e.target.value)}
                    placeholder="Describe your cancellation policy..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  Configure how you receive booking notifications.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive booking notifications via email
                    </p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications || false}
                    onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive booking notifications via SMS
                    </p>
                  </div>
                  <Switch
                    checked={settings.smsNotifications || false}
                    onCheckedChange={(checked) => updateSetting('smsNotifications', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Management */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage user roles and permissions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  User management features will be implemented in a future update.
                  This will include role-based access control, user invitations, and permission management.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance */}
          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Theme & Appearance</CardTitle>
                <CardDescription>
                  Customize the look and feel of your admin dashboard.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="theme">Theme</Label>
                  <Select
                    value={settings.theme || 'system'}
                    onValueChange={(value) => updateSetting('theme', value)}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={settings.language || 'en'}
                    onValueChange={(value) => updateSetting('language', value)}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={settings.timezone || 'America/New_York'}
                    onValueChange={(value) => updateSetting('timezone', value)}
                  >
                    <SelectTrigger className="w-64">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Chicago">Central Time</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced Settings */}
          <TabsContent value="advanced" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
                <CardDescription>
                  Advanced configuration options for your studio.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Advanced settings such as API configurations, integrations, and system preferences 
                  will be available in future updates.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={saveSettings} disabled={saving}>
            {saving ? (
              <>
                <LoadingSpinner />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </div>
    </ErrorBoundary>
  )
}
