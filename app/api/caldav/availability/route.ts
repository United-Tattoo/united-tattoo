import { NextRequest, NextResponse } from 'next/server'
import { checkArtistAvailability } from '@/lib/calendar-sync'
import { z } from 'zod'

export const dynamic = "force-dynamic"

const availabilitySchema = z.object({
  artistId: z.string().min(1),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
})

/**
 * GET /api/caldav/availability
 * 
 * Check availability for an artist at a specific time slot
 * 
 * Query params:
 * - artistId: string
 * - startTime: ISO datetime string
 * - endTime: ISO datetime string
 */
export async function GET(request: NextRequest, { params }: { params?: any } = {}, context?: any) {
  try {
    const { searchParams } = new URL(request.url)
    
    const artistId = searchParams.get('artistId')
    const startTime = searchParams.get('startTime')
    const endTime = searchParams.get('endTime')

    // Validate inputs
    const validatedData = availabilitySchema.parse({
      artistId,
      startTime,
      endTime,
    })

    const startDate = new Date(validatedData.startTime)
    const endDate = new Date(validatedData.endTime)

    // Check availability (checks both CalDAV and database)
    const result = await checkArtistAvailability(
      validatedData.artistId,
      startDate,
      endDate,
      context
    )

    return NextResponse.json({
      artistId: validatedData.artistId,
      startTime: validatedData.startTime,
      endTime: validatedData.endTime,
      available: result.available,
      reason: result.reason,
    })
  } catch (error) {
    console.error('Error checking availability:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request parameters', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to check availability' },
      { status: 500 }
    )
  }
}

