import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getDB } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = getDB()

    // Get artist statistics
    const artistStats = await db.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN is_active = 0 THEN 1 ELSE 0 END) as inactive
      FROM artists
    `).first()

    // Get appointment statistics
    const appointmentStats = await db.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'PENDING' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'CONFIRMED' THEN 1 ELSE 0 END) as confirmed,
        SUM(CASE WHEN status = 'IN_PROGRESS' THEN 1 ELSE 0 END) as inProgress,
        SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'CANCELLED' THEN 1 ELSE 0 END) as cancelled,
        SUM(CASE WHEN strftime('%Y-%m', start_time) = strftime('%Y-%m', 'now') THEN 1 ELSE 0 END) as thisMonth,
        SUM(CASE WHEN strftime('%Y-%m', start_time) = strftime('%Y-%m', 'now', '-1 month') THEN 1 ELSE 0 END) as lastMonth,
        SUM(CASE WHEN status = 'COMPLETED' THEN COALESCE(total_amount, 0) ELSE 0 END) as revenue
      FROM appointments
    `).first()

    // Get portfolio statistics
    const portfolioStats = await db.prepare(`
      SELECT 
        COUNT(*) as totalImages,
        SUM(CASE WHEN date(created_at) >= date('now', '-7 days') THEN 1 ELSE 0 END) as recentUploads
      FROM portfolio_images
      WHERE is_public = 1
    `).first()

    // Get file upload statistics
    const fileStats = await db.prepare(`
      SELECT 
        COUNT(*) as totalUploads,
        SUM(size) as totalSize,
        SUM(CASE WHEN date(created_at) >= date('now', '-7 days') THEN 1 ELSE 0 END) as recentUploads
      FROM file_uploads
    `).first()

    // Get monthly appointment data for the last 6 months
    const monthlyData = await db.prepare(`
      SELECT 
        strftime('%Y-%m', start_time) as month,
        COUNT(*) as appointments,
        SUM(CASE WHEN status = 'COMPLETED' THEN COALESCE(total_amount, 0) ELSE 0 END) as revenue
      FROM appointments
      WHERE start_time >= date('now', '-6 months')
      GROUP BY strftime('%Y-%m', start_time)
      ORDER BY month
    `).all()

    // Format monthly data
    const formattedMonthlyData = (monthlyData.results || []).map((row: any) => ({
      month: new Date(row.month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      appointments: row.appointments || 0,
      revenue: row.revenue || 0,
    }))

    // Create status distribution data
    const statusData = [
      {
        name: 'Pending',
        value: (appointmentStats as any)?.pending || 0,
        color: '#f59e0b',
      },
      {
        name: 'Confirmed',
        value: (appointmentStats as any)?.confirmed || 0,
        color: '#3b82f6',
      },
      {
        name: 'In Progress',
        value: (appointmentStats as any)?.inProgress || 0,
        color: '#10b981',
      },
      {
        name: 'Completed',
        value: (appointmentStats as any)?.completed || 0,
        color: '#6b7280',
      },
      {
        name: 'Cancelled',
        value: (appointmentStats as any)?.cancelled || 0,
        color: '#ef4444',
      },
    ].filter(item => item.value > 0) // Only include statuses with values

    const stats = {
      artists: {
        total: (artistStats as any)?.total || 0,
        active: (artistStats as any)?.active || 0,
        inactive: (artistStats as any)?.inactive || 0,
      },
      appointments: {
        total: (appointmentStats as any)?.total || 0,
        pending: (appointmentStats as any)?.pending || 0,
        confirmed: (appointmentStats as any)?.confirmed || 0,
        inProgress: (appointmentStats as any)?.inProgress || 0,
        completed: (appointmentStats as any)?.completed || 0,
        cancelled: (appointmentStats as any)?.cancelled || 0,
        thisMonth: (appointmentStats as any)?.thisMonth || 0,
        lastMonth: (appointmentStats as any)?.lastMonth || 0,
        revenue: (appointmentStats as any)?.revenue || 0,
      },
      portfolio: {
        totalImages: (portfolioStats as any)?.totalImages || 0,
        recentUploads: (portfolioStats as any)?.recentUploads || 0,
      },
      files: {
        totalUploads: (fileStats as any)?.totalUploads || 0,
        totalSize: (fileStats as any)?.totalSize || 0,
        recentUploads: (fileStats as any)?.recentUploads || 0,
      },
      monthlyData: formattedMonthlyData,
      statusData,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    )
  }
}
