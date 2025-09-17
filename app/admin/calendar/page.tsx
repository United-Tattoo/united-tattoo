'use client'

import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AppointmentCalendar } from '@/components/admin/appointment-calendar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { CalendarIcon, Plus, Users, Clock, CheckCircle, XCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import moment from 'moment'

const appointmentSchema = z.object({
  artistId: z.string().min(1, 'Artist is required'),
  clientName: z.string().min(1, 'Client name is required'),
  clientEmail: z.string().email('Valid email is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  depositAmount: z.number().optional(),
  totalAmount: z.number().optional(),
  notes: z.string().optional(),
})

type AppointmentFormData = z.infer<typeof appointmentSchema>

export default function CalendarPage() {
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null)
  const queryClient = useQueryClient()

  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      artistId: '',
      clientName: '',
      clientEmail: '',
      title: '',
      description: '',
      startTime: '',
      endTime: '',
      depositAmount: undefined,
      totalAmount: undefined,
      notes: '',
    },
  })

  // Fetch appointments
  const { data: appointmentsData, isLoading: appointmentsLoading } = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const response = await fetch('/api/appointments')
      if (!response.ok) throw new Error('Failed to fetch appointments')
      return response.json()
    },
  })

  // Fetch artists
  const { data: artistsData, isLoading: artistsLoading } = useQuery({
    queryKey: ['artists'],
    queryFn: async () => {
      const response = await fetch('/api/artists')
      if (!response.ok) throw new Error('Failed to fetch artists')
      return response.json()
    },
  })

  // Create appointment mutation
  const createAppointmentMutation = useMutation({
    mutationFn: async (data: AppointmentFormData) => {
      // First, create or find the client user
      const clientResponse = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.clientName,
          email: data.clientEmail,
          role: 'CLIENT',
        }),
      })
      
      let clientId
      if (clientResponse.ok) {
        const client = await clientResponse.json()
        clientId = client.user.id
      } else {
        // If user already exists, try to find them
        const existingUserResponse = await fetch(`/api/users?email=${encodeURIComponent(data.clientEmail)}`)
        if (existingUserResponse.ok) {
          const existingUser = await existingUserResponse.json()
          clientId = existingUser.user.id
        } else {
          throw new Error('Failed to create or find client')
        }
      }

      // Create the appointment
      const appointmentResponse = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          clientId,
          startTime: new Date(data.startTime).toISOString(),
          endTime: new Date(data.endTime).toISOString(),
        }),
      })

      if (!appointmentResponse.ok) {
        const error = await appointmentResponse.json()
        throw new Error(error.error || 'Failed to create appointment')
      }

      return appointmentResponse.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      setIsNewAppointmentOpen(false)
      form.reset()
      toast.success('Appointment created successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  // Update appointment mutation
  const updateAppointmentMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const response = await fetch('/api/appointments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update appointment')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      toast.success('Appointment updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  // Handle slot selection for new appointment
  const handleSlotSelect = (slotInfo: { start: Date; end: Date; slots: Date[] }) => {
    setSelectedSlot({ start: slotInfo.start, end: slotInfo.end })
    form.setValue('startTime', moment(slotInfo.start).format('YYYY-MM-DDTHH:mm'))
    form.setValue('endTime', moment(slotInfo.end).format('YYYY-MM-DDTHH:mm'))
    setIsNewAppointmentOpen(true)
  }

  // Handle event update
  const handleEventUpdate = (eventId: string, updates: any) => {
    updateAppointmentMutation.mutate({ id: eventId, updates })
  }

  const onSubmit = (data: AppointmentFormData) => {
    createAppointmentMutation.mutate(data)
  }

  const appointments = appointmentsData?.appointments || []
  const artists = artistsData?.artists || []

  // Calculate stats
  const stats = {
    total: appointments.length,
    pending: appointments.filter((apt: any) => apt.status === 'PENDING').length,
    confirmed: appointments.filter((apt: any) => apt.status === 'CONFIRMED').length,
    completed: appointments.filter((apt: any) => apt.status === 'COMPLETED').length,
  }

  if (appointmentsLoading || artistsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading calendar...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Appointment Calendar</h1>
          <p className="text-muted-foreground">Manage studio appointments and scheduling</p>
        </div>
        
        <Dialog open={isNewAppointmentOpen} onOpenChange={setIsNewAppointmentOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Appointment</DialogTitle>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="artistId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Artist</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an artist" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {artists.map((artist: any) => (
                            <SelectItem key={artist.id} value={artist.id}>
                              {artist.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="clientName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="clientEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Appointment Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Tattoo Session" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Appointment details..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Time</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Time</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="depositAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deposit Amount</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01" 
                            placeholder="0.00" 
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="totalAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Amount</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01" 
                            placeholder="0.00" 
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Additional notes..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsNewAppointmentOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createAppointmentMutation.isPending}>
                    {createAppointmentMutation.isPending ? 'Creating...' : 'Create Appointment'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.confirmed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar */}
      <AppointmentCalendar
        appointments={appointments}
        artists={artists}
        onSlotSelect={handleSlotSelect}
        onEventUpdate={handleEventUpdate}
      />
    </div>
  )
}
