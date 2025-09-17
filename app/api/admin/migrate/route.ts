import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { migrateArtistData, getMigrationStats, clearMigratedData } from '@/lib/data-migration'

export async function POST(request: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    const { action } = await request.json()

    switch (action) {
      case 'migrate':
        await migrateArtistData()
        const stats = await getMigrationStats()
        return NextResponse.json({
          success: true,
          message: 'Artist data migration completed successfully',
          stats
        })

      case 'clear':
        await clearMigratedData()
        return NextResponse.json({
          success: true,
          message: 'Migrated data cleared successfully'
        })

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use "migrate" or "clear".' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Migration API error:', error)
    return NextResponse.json(
      { 
        error: 'Migration failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    // Get migration statistics
    const stats = await getMigrationStats()
    
    return NextResponse.json({
      success: true,
      stats
    })
  } catch (error) {
    console.error('Migration stats API error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to get migration stats',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
