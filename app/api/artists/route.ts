import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { UserRole, ArtistFilters } from "@/types/database"
import { createArtistSchema, paginationSchema, artistFiltersSchema } from "@/lib/validations"
import { getPublicArtists, createArtist } from "@/lib/db"
import { Flags } from "@/lib/flags"

export const dynamic = "force-dynamic";

// GET /api/artists - Fetch all artists with optional filtering and pagination
export async function GET(request: NextRequest, { params }: { params?: any } = {}, context?: any) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse and validate query parameters
    const pagination = paginationSchema.parse({
      page: searchParams.get("page") || "1",
      limit: searchParams.get("limit") || "50", // Increased default for artists grid
    })
    
    const filters = artistFiltersSchema.parse({
      isActive: searchParams.get("isActive"),
      specialty: searchParams.get("specialty"),
      search: searchParams.get("search"),
    })

    // Build filters for database query
    const dbFilters: ArtistFilters = {
      specialty: filters.specialty || undefined,
      search: filters.search || undefined,
      isActive: filters.isActive !== undefined ? filters.isActive : true,
      limit: pagination.limit,
      offset: (pagination.page - 1) * pagination.limit,
    }

    // Fetch artists from database with portfolio images
    const artists = await getPublicArtists(dbFilters, context?.env)
    
    // Get total count for pagination (this is a simplified approach)
    // In production, you'd want a separate count query
    const hasMore = artists.length === pagination.limit

    return NextResponse.json({
      artists,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        hasMore,
      },
      filters,
    })
  } catch (error) {
    console.error("Error fetching artists:", error)
    return NextResponse.json(
      { error: "Failed to fetch artists" },
      { status: 500 }
    )
  }
}

// POST /api/artists - Create a new artist (Admin only)
export async function POST(request: NextRequest, { params }: { params?: any } = {}, context?: any) {
  try {
    if (!Flags.ARTISTS_MODULE_ENABLED) {
      return NextResponse.json({ error: 'Artists module disabled' }, { status: 503 })
    }
    // Require admin authentication
    const session = await requireAuth(UserRole.SHOP_ADMIN)
    
    const body = await request.json()
    const validatedData = createArtistSchema.parse(body)

    // Create new artist in database with environment context
    const newArtist = await createArtist({
      ...validatedData,
      userId: session.user.id,
    }, context?.env)

    return NextResponse.json(newArtist, { status: 201 })
  } catch (error) {
    console.error("Error creating artist:", error)
    
    if (error instanceof Error) {
      if (error.message.includes("Authentication required")) {
        return NextResponse.json(
          { error: "Authentication required" },
          { status: 401 }
        )
      }
      if (error.message.includes("Insufficient permissions")) {
        return NextResponse.json(
          { error: "Insufficient permissions" },
          { status: 403 }
        )
      }
    }

    return NextResponse.json(
      { error: "Failed to create artist" },
      { status: 500 }
    )
  }
}
