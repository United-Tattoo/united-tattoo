import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { UserRole } from "@/types/database"
import { updateArtistSchema } from "@/lib/validations"
import { getArtistWithPortfolio, getArtistBySlug, updateArtist, deleteArtist } from "@/lib/db"

export const dynamic = "force-dynamic";

// GET /api/artists/[id] - Fetch single artist with portfolio
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
  context?: any
) {
  try {
    const { id } = params

    // Try to fetch by ID first, then by slug
    let artist = await getArtistWithPortfolio(id, context?.env)

    if (!artist) {
      artist = await getArtistBySlug(id, context?.env)
    }

    if (!artist) {
      return NextResponse.json(
        { error: "Artist not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(artist, {
      headers: {
        // Cache for 30 minutes, allow stale for 1 hour while revalidating
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
      },
    })
  } catch (error) {
    console.error("Error fetching artist:", error)
    return NextResponse.json(
      { error: "Failed to fetch artist" },
      { status: 500 }
    )
  }
}

// PUT /api/artists/[id] - Update artist (admin or artist themselves)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
  context?: any
) {
  try {
    const { id } = params
    const session = await requireAuth()

    // Get the artist to check ownership
    const artist = await getArtistWithPortfolio(id, context?.env)
    if (!artist) {
      return NextResponse.json(
        { error: "Artist not found" },
        { status: 404 }
      )
    }

    // Check authorization: must be the artist themselves or an admin
    const isOwner = artist.userId === session.user.id
    const isAdmin = [UserRole.SUPER_ADMIN, UserRole.SHOP_ADMIN].includes(session.user.role)

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = updateArtistSchema.parse(body)

    // If artist is updating themselves (not admin), restrict what they can change
    let updateData = validatedData
    if (isOwner && !isAdmin) {
      // Artists can only update: bio, specialties, instagramHandle, hourlyRate
      const { bio, specialties, instagramHandle, hourlyRate } = validatedData
      updateData = { bio, specialties, instagramHandle, hourlyRate }
    }

    const updatedArtist = await updateArtist(id, updateData, context?.env)

    return NextResponse.json(updatedArtist)
  } catch (error) {
    console.error("Error updating artist:", error)

    if (error instanceof Error) {
      if (error.message.includes("Authentication required")) {
        return NextResponse.json(
          { error: "Authentication required" },
          { status: 401 }
        )
      }
    }

    return NextResponse.json(
      { error: "Failed to update artist" },
      { status: 500 }
    )
  }
}

// DELETE /api/artists/[id] - Soft delete artist (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
  context?: any
) {
  try {
    const { id } = params

    // Require admin authentication
    await requireAuth(UserRole.SHOP_ADMIN)

    await deleteArtist(id, context?.env)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting artist:", error)

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
      { error: "Failed to delete artist" },
      { status: 500 }
    )
  }
}
