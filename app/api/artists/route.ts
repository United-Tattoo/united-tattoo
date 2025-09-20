import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { UserRole } from "@/types/database"
import { createArtistSchema, paginationSchema, artistFiltersSchema } from "@/lib/validations"
import { getArtists, createArtist } from "@/lib/db"
import { Flags } from "@/lib/flags"

export const dynamic = "force-dynamic";

// GET /api/artists - Fetch all artists with optional filtering and pagination
export async function GET(request: NextRequest, { params }: { params?: any } = {}, context?: any) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse and validate query parameters
    const pagination = paginationSchema.parse({
      page: searchParams.get("page") || "1",
      limit: searchParams.get("limit") || "10",
    })
    
    const filters = artistFiltersSchema.parse({
      isActive: searchParams.get("isActive"),
      specialty: searchParams.get("specialty"),
      search: searchParams.get("search"),
    })

    // Fetch artists from database with environment context
    const artists = await getArtists(context?.env)
    
    // Apply filters
    let filteredArtists = artists
    
    if (filters.isActive !== undefined) {
      filteredArtists = filteredArtists.filter(artist => 
        artist.isActive === filters.isActive
      )
    }
    
    if (filters.specialty) {
      filteredArtists = filteredArtists.filter(artist =>
        artist.specialties.some(specialty => 
          specialty.toLowerCase().includes(filters.specialty!.toLowerCase())
        )
      )
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filteredArtists = filteredArtists.filter(artist =>
        artist.name.toLowerCase().includes(searchTerm) ||
        artist.bio.toLowerCase().includes(searchTerm)
      )
    }
    
    // Apply pagination
    const startIndex = (pagination.page - 1) * pagination.limit
    const endIndex = startIndex + pagination.limit
    const paginatedArtists = filteredArtists.slice(startIndex, endIndex)

    return NextResponse.json({
      artists: paginatedArtists,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: filteredArtists.length,
        totalPages: Math.ceil(filteredArtists.length / pagination.limit),
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
