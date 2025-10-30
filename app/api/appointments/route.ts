import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getDB } from '@/lib/db'
import { Flags } from '@/lib/flags'
import { 
  syncAppointmentToCalendar, 
  deleteAppointmentFromCalendar,
  checkArtistAvailability,
} from '@/lib/calendar-sync'
import { z } from 'zod'

export const dynamic = "force-dynamic";

const createAppointmentSchema = z.object({
  artistId: z.string().min(1),
  clientId: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  depositAmount: z.number().optional(),
  totalAmount: z.number().optional(),
  notes: z.string().optional(),
})

const updateAppointmentSchema = createAppointmentSchema.partial().extend({
  id: z.string().min(1),
  status: z.enum(['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
})

function bookingDisabledResponse() {
  return NextResponse.json({ error: 'Booking disabled' }, { status: 503 })
}

export async function GET(request: NextRequest, { params }: { params?: any } = {}, context?: any) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const start = searchParams.get('start')
    const end = searchParams.get('end')
    const artistId = searchParams.get('artistId')
    const status = searchParams.get('status')

    const db = getDB(context?.env)
    let query = `
      SELECT 
        a.*,
        ar.name as artist_name,
        u.name as client_name,
        u.email as client_email
      FROM appointments a
      JOIN artists ar ON a.artist_id = ar.id
      JOIN users u ON a.client_id = u.id
      WHERE 1=1
    `
    const params: any[] = []

    if (start) {
      query += ` AND a.start_time >= ?`
      params.push(start)
    }

    if (end) {
      query += ` AND a.end_time <= ?`
      params.push(end)
    }

    if (artistId) {
      query += ` AND a.artist_id = ?`
      params.push(artistId)
    }

    if (status) {
      query += ` AND a.status = ?`
      params.push(status)
    }

    query += ` ORDER BY a.start_time ASC`

    const stmt = db.prepare(query)
    const result = await stmt.bind(...params).all()

    return NextResponse.json({ appointments: result.results })
  } catch (error) {
    console.error('Error fetching appointments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest, { params }: { params?: any } = {}, context?: any) {
  try {
    if (!Flags.BOOKING_ENABLED) {
      return bookingDisabledResponse()
    }
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createAppointmentSchema.parse(body)

    const db = getDB(context?.env)

    // IMPORTANT: Check CalDAV availability first (Nextcloud is source of truth)
    const startDate = new Date(validatedData.startTime)
    const endDate = new Date(validatedData.endTime)
    
    const availabilityCheck = await checkArtistAvailability(
      validatedData.artistId,
      startDate,
      endDate,
      context
    )

    if (!availabilityCheck.available) {
      return NextResponse.json(
        { 
          error: 'Time slot not available',
          reason: availabilityCheck.reason || 'Selected time slot conflicts with existing booking. Please select a different time.'
        },
        { status: 409 }
      )
    }

    // Create appointment in database with PENDING status
    const appointmentId = crypto.randomUUID()
    const insertStmt = db.prepare(`
      INSERT INTO appointments (
        id, artist_id, client_id, title, description, start_time, end_time,
        status, deposit_amount, total_amount, notes, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'PENDING', ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `)

    await insertStmt.bind(
      appointmentId,
      validatedData.artistId,
      validatedData.clientId,
      validatedData.title,
      validatedData.description || null,
      validatedData.startTime,
      validatedData.endTime,
      validatedData.depositAmount || null,
      validatedData.totalAmount || null,
      validatedData.notes || null
    ).run()

    // Fetch the created appointment with related data
    const selectStmt = db.prepare(`
      SELECT 
        a.*,
        ar.name as artist_name,
        u.name as client_name,
        u.email as client_email
      FROM appointments a
      JOIN artists ar ON a.artist_id = ar.id
      JOIN users u ON a.client_id = u.id
      WHERE a.id = ?
    `)

    const appointment = await selectStmt.bind(appointmentId).first()

    // Sync to CalDAV calendar (non-blocking - failure won't prevent appointment creation)
    try {
      await syncAppointmentToCalendar(appointment as any, context)
    } catch (syncError) {
      console.error('Failed to sync appointment to calendar:', syncError)
      // Continue - appointment is created in DB even if CalDAV sync fails
    }

    return NextResponse.json({ appointment }, { status: 201 })
  } catch (error) {
    console.error('Error creating appointment:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid appointment data', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params?: any } = {}, context?: any) {
  try {
    if (!Flags.BOOKING_ENABLED) {
      return bookingDisabledResponse()
    }
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = updateAppointmentSchema.parse(body)

    const db = getDB(context?.env)

    // Check if appointment exists
    const existingStmt = db.prepare('SELECT * FROM appointments WHERE id = ?')
    const existing = await existingStmt.bind(validatedData.id).first()

    if (!existing) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      )
    }

    // Check for conflicts if time is being changed
    if (validatedData.startTime || validatedData.endTime) {
      const startTime = validatedData.startTime || existing.start_time
      const endTime = validatedData.endTime || existing.end_time
      const artistId = validatedData.artistId || existing.artist_id

      const conflictCheck = db.prepare(`
        SELECT id FROM appointments 
        WHERE artist_id = ? 
        AND id != ?
        AND status NOT IN ('CANCELLED', 'COMPLETED')
        AND (
          (start_time <= ? AND end_time > ?) OR
          (start_time < ? AND end_time >= ?) OR
          (start_time >= ? AND end_time <= ?)
        )
      `)

      const conflictResult = await conflictCheck.bind(
        artistId, validatedData.id,
        startTime, startTime,
        endTime, endTime,
        startTime, endTime
      ).all()

      if (conflictResult.results.length > 0) {
        return NextResponse.json(
          { error: 'Time slot conflicts with existing appointment' },
          { status: 409 }
        )
      }
    }

    // Build update query dynamically
    const updateFields = []
    const updateValues = []

    Object.entries(validatedData).forEach(([key, value]) => {
      if (key !== 'id' && value !== undefined) {
        const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase()
        updateFields.push(`${dbKey} = ?`)
        updateValues.push(value)
      }
    })

    if (updateFields.length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      )
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP')
    updateValues.push(validatedData.id)

    const updateStmt = db.prepare(`
      UPDATE appointments 
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `)

    await updateStmt.bind(...updateValues).run()

    // Fetch updated appointment
    const selectStmt = db.prepare(`
      SELECT 
        a.*,
        ar.name as artist_name,
        u.name as client_name,
        u.email as client_email
      FROM appointments a
      JOIN artists ar ON a.artist_id = ar.id
      JOIN users u ON a.client_id = u.id
      WHERE a.id = ?
    `)

    const appointment = await selectStmt.bind(validatedData.id).first()

    // Sync updated appointment to CalDAV (non-blocking)
    try {
      await syncAppointmentToCalendar(appointment as any, context)
    } catch (syncError) {
      console.error('Failed to sync updated appointment to calendar:', syncError)
      // Continue - appointment is updated in DB even if CalDAV sync fails
    }

    return NextResponse.json({ appointment })
  } catch (error) {
    console.error('Error updating appointment:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid appointment data', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update appointment' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params?: any } = {}, context?: any) {
  try {
    if (!Flags.BOOKING_ENABLED) {
      return bookingDisabledResponse()
    }
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Appointment ID is required' },
        { status: 400 }
      )
    }

    const db = getDB(context?.env)
    
    // Fetch appointment before deleting (needed for CalDAV sync)
    const appointment = await db.prepare('SELECT * FROM appointments WHERE id = ?').bind(id).first()
    
    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      )
    }

    // Delete from CalDAV calendar first (non-blocking)
    try {
      await deleteAppointmentFromCalendar(appointment as any, context)
    } catch (syncError) {
      console.error('Failed to delete appointment from calendar:', syncError)
      // Continue with DB deletion even if CalDAV deletion fails
    }

    // Delete from database
    const deleteStmt = db.prepare('DELETE FROM appointments WHERE id = ?')
    await deleteStmt.bind(id).run()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting appointment:', error)
    return NextResponse.json(
      { error: 'Failed to delete appointment' },
      { status: 500 }
    )
  }
}
