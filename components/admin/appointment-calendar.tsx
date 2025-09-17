'use client'

import { useState, useCallback, useMemo } from 'react'
import { Calendar, momentLocalizer, View, Views } from 'react-big-calendar'
import moment from 'moment'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CalendarIcon, Clock, User, MapPin, DollarSign } from 'lucide-react'
import { cn } from '@/lib/utils'
import 'react-big-calendar/lib/css/react-big-calendar.css'

// Setup the localizer for react-big-calendar
const localizer = momentLocalizer(moment)

interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  resource: {
    appointmentId: string
    artistId: string
    artistName: string
    clientId: string
    clientName: string
    clientEmail: string
    status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
    depositAmount?: number
    totalAmount?: number
    notes?: string
    description?: string
  }
}

interface AppointmentCalendarProps {
  appointments: any[]
  artists: any[]
  onEventSelect?: (event: CalendarEvent) => void
  onSlotSelect?: (slotInfo: { start: Date; end: Date; slots: Date[] }) => void
  onEventUpdate?: (eventId: string, updates: any) => void
  className?: string
}

const statusColors = {
  PENDING: 'bg-yellow-100 border-yellow-300 text-yellow-800',
  CONFIRMED: 'bg-blue-100 border-blue-300 text-blue-800',
  IN_PROGRESS: 'bg-green-100 border-green-300 text-green-800',
  COMPLETED: 'bg-gray-100 border-gray-300 text-gray-800',
  CANCELLED: 'bg-red-100 border-red-300 text-red-800',
}

export function AppointmentCalendar({
  appointments,
  artists,
  onEventSelect,
  onSlotSelect,
  onEventUpdate,
  className
}: AppointmentCalendarProps) {
  const [view, setView] = useState<View>(Views.WEEK)
  const [date, setDate] = useState(new Date())
  const [selectedArtist, setSelectedArtist] = useState<string>('all')
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)

  // Convert appointments to calendar events
  const events = useMemo(() => {
    const filteredAppointments = selectedArtist === 'all' 
      ? appointments 
      : appointments.filter(apt => apt.artist_id === selectedArtist)

    return filteredAppointments.map(appointment => ({
      id: appointment.id,
      title: `${appointment.title} - ${appointment.client_name}`,
      start: new Date(appointment.start_time),
      end: new Date(appointment.end_time),
      resource: {
        appointmentId: appointment.id,
        artistId: appointment.artist_id,
        artistName: appointment.artist_name,
        clientId: appointment.client_id,
        clientName: appointment.client_name,
        clientEmail: appointment.client_email,
        status: appointment.status,
        depositAmount: appointment.deposit_amount,
        totalAmount: appointment.total_amount,
        notes: appointment.notes,
        description: appointment.description,
      }
    })) as CalendarEvent[]
  }, [appointments, selectedArtist])

  // Custom event style getter
  const eventStyleGetter = useCallback((event: CalendarEvent) => {
    const status = event.resource.status
    const baseStyle = {
      borderRadius: '4px',
      border: '1px solid',
      fontSize: '12px',
      padding: '2px 4px',
    }

    switch (status) {
      case 'PENDING':
        return {
          style: {
            ...baseStyle,
            backgroundColor: '#fef3c7',
            borderColor: '#fcd34d',
            color: '#92400e',
          }
        }
      case 'CONFIRMED':
        return {
          style: {
            ...baseStyle,
            backgroundColor: '#dbeafe',
            borderColor: '#60a5fa',
            color: '#1e40af',
          }
        }
      case 'IN_PROGRESS':
        return {
          style: {
            ...baseStyle,
            backgroundColor: '#dcfce7',
            borderColor: '#4ade80',
            color: '#166534',
          }
        }
      case 'COMPLETED':
        return {
          style: {
            ...baseStyle,
            backgroundColor: '#f3f4f6',
            borderColor: '#9ca3af',
            color: '#374151',
          }
        }
      case 'CANCELLED':
        return {
          style: {
            ...baseStyle,
            backgroundColor: '#fee2e2',
            borderColor: '#f87171',
            color: '#991b1b',
          }
        }
      default:
        return { style: baseStyle }
    }
  }, [])

  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event)
    onEventSelect?.(event)
  }, [onEventSelect])

  const handleSelectSlot = useCallback((slotInfo: { start: Date; end: Date; slots: Date[] }) => {
    onSlotSelect?.(slotInfo)
  }, [onSlotSelect])

  const handleStatusUpdate = useCallback((eventId: string, newStatus: string) => {
    onEventUpdate?.(eventId, { status: newStatus })
    setSelectedEvent(null)
  }, [onEventUpdate])

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Calendar Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Appointment Calendar</h2>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={selectedArtist} onValueChange={setSelectedArtist}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by artist" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Artists</SelectItem>
              {artists.map(artist => (
                <SelectItem key={artist.id} value={artist.id}>
                  {artist.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={view} onValueChange={(value) => setView(value as View)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={Views.MONTH}>Month</SelectItem>
              <SelectItem value={Views.WEEK}>Week</SelectItem>
              <SelectItem value={Views.DAY}>Day</SelectItem>
              <SelectItem value={Views.AGENDA}>Agenda</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Calendar */}
      <Card>
        <CardContent className="p-4">
          <div style={{ height: '600px' }}>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              view={view}
              onView={setView}
              date={date}
              onNavigate={setDate}
              onSelectEvent={handleSelectEvent}
              onSelectSlot={handleSelectSlot}
              selectable
              eventPropGetter={eventStyleGetter}
              popup
              showMultiDayTimes
              step={30}
              timeslots={2}
              defaultDate={new Date()}
              views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
              messages={{
                next: "Next",
                previous: "Previous",
                today: "Today",
                month: "Month",
                week: "Week",
                day: "Day",
                agenda: "Agenda",
                date: "Date",
                time: "Time",
                event: "Event",
                noEventsInRange: "No appointments in this range",
                showMore: (total) => `+${total} more`,
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Event Details Dialog */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Appointment Details
            </DialogTitle>
          </DialogHeader>
          
          {selectedEvent && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{selectedEvent.resource.clientName}</h3>
                <p className="text-sm text-muted-foreground">{selectedEvent.resource.clientEmail}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{selectedEvent.resource.artistName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{moment(selectedEvent.start).format('MMM D, h:mm A')}</span>
                </div>
              </div>

              <div>
                <Badge className={statusColors[selectedEvent.resource.status]}>
                  {selectedEvent.resource.status}
                </Badge>
              </div>

              {selectedEvent.resource.description && (
                <div>
                  <h4 className="font-medium mb-1">Description</h4>
                  <p className="text-sm text-muted-foreground">{selectedEvent.resource.description}</p>
                </div>
              )}

              {(selectedEvent.resource.depositAmount || selectedEvent.resource.totalAmount) && (
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Deposit:</span>
                    <p>{formatCurrency(selectedEvent.resource.depositAmount)}</p>
                  </div>
                  <div>
                    <span className="font-medium">Total:</span>
                    <p>{formatCurrency(selectedEvent.resource.totalAmount)}</p>
                  </div>
                </div>
              )}

              {selectedEvent.resource.notes && (
                <div>
                  <h4 className="font-medium mb-1">Notes</h4>
                  <p className="text-sm text-muted-foreground">{selectedEvent.resource.notes}</p>
                </div>
              )}

              {/* Status Update Buttons */}
              <div className="flex flex-wrap gap-2 pt-4 border-t">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusUpdate(selectedEvent.resource.appointmentId, 'CONFIRMED')}
                  disabled={selectedEvent.resource.status === 'CONFIRMED'}
                >
                  Confirm
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusUpdate(selectedEvent.resource.appointmentId, 'IN_PROGRESS')}
                  disabled={selectedEvent.resource.status === 'IN_PROGRESS'}
                >
                  Start
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusUpdate(selectedEvent.resource.appointmentId, 'COMPLETED')}
                  disabled={selectedEvent.resource.status === 'COMPLETED'}
                >
                  Complete
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleStatusUpdate(selectedEvent.resource.appointmentId, 'CANCELLED')}
                  disabled={selectedEvent.resource.status === 'CANCELLED'}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
