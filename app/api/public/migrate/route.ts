import { NextRequest, NextResponse } from "next/server"
import { migrateArtistData, getMigrationStats } from "@/lib/data-migration"

// Public migration endpoint guarded by MIGRATE_TOKEN (bypasses next-auth + middleware auth)
export async function POST(request: NextRequest) {
  const token =
    request.headers.get("x-migrate-token") ||
    new URL(request.url).searchParams.get("token")

  // Require strict MIGRATE_TOKEN match
  const MIGRATE_TOKEN = process.env.MIGRATE_TOKEN
  if (!token || token !== MIGRATE_TOKEN) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    await migrateArtistData()
    const stats = await getMigrationStats()
    return NextResponse.json(
      {
        success: true,
        message: "Artist data migration completed successfully",
        stats,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Public migration error:", error)
    return NextResponse.json(
      {
        error: "Migration failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const token =
    request.headers.get("x-migrate-token") ||
    new URL(request.url).searchParams.get("token")

  // Require strict MIGRATE_TOKEN match
  const MIGRATE_TOKEN = process.env.MIGRATE_TOKEN
  if (!token || token !== MIGRATE_TOKEN) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const stats = await getMigrationStats()
    return NextResponse.json(
      {
        success: true,
        stats,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Public migration stats error:", error)
    return NextResponse.json(
      {
        error: "Failed to get migration stats",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
