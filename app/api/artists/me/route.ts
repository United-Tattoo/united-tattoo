import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { UserRole } from "@/types/database"
import { getArtistByUserId, updateArtist } from "@/lib/db"

export const dynamic = "force-dynamic";

// GET /api/artists/me - Get current logged-in artist's profile
export async function GET(
  request: NextRequest,
  { params }: { params?: any } = {},
  context?: any
) {
  try {
    // Require artist authentication
    const session = await requireAuth(UserRole.ARTIST)
    
    // Fetch artist data by user ID
    const artist = await getArtistByUserId(session.user.id, context?.env)
    
    if (!artist) {
      return NextResponse.json(
        { error: "Artist profile not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(artist)
  } catch (error) {
    console.error("Error fetching artist profile:", error)
    
    if (error instanceof Error) {
      if (error.message.includes("Authentication required")) {
        return NextResponse.json(
          { error: "Authentication required" },
          { status: 401 }
        )
      }
      if (error.message.includes("Insufficient permissions")) {
        return NextResponse.json(
          { error: "You must be an artist to access this endpoint" },
          { status: 403 }
        )
      }
    }

    return NextResponse.json(
      { error: "Failed to fetch artist profile" },
      { status: 500 }
    )
  }
}

// PUT /api/artists/me - Update current logged-in artist's profile
export async function PUT(
  request: NextRequest,
  { params }: { params?: any } = {},
  context?: any
) {
  try {
    // Require artist authentication
    const session = await requireAuth(UserRole.ARTIST)
    
    // Fetch current artist data
    const artist = await getArtistByUserId(session.user.id, context?.env)
    
    if (!artist) {
      return NextResponse.json(
        { error: "Artist profile not found" },
        { status: 404 }
      )
    }

    // Parse request body
    const body = await request.json()
    
    // Artists can only update specific fields
    const allowedUpdates = {
      bio: body.bio,
      specialties: body.specialties,
      instagramHandle: body.instagramHandle,
      hourlyRate: body.hourlyRate
    }

    // Update artist profile
    const updatedArtist = await updateArtist(
      artist.id,
      allowedUpdates,
      context?.env
    )

    return NextResponse.json(updatedArtist)
  } catch (error) {
    console.error("Error updating artist profile:", error)
    
    if (error instanceof Error) {
      if (error.message.includes("Authentication required")) {
        return NextResponse.json(
          { error: "Authentication required" },
          { status: 401 }
        )
      }
      if (error.message.includes("Insufficient permissions")) {
        return NextResponse.json(
          { error: "You must be an artist to access this endpoint" },
          { status: 403 }
        )
      }
    }

    return NextResponse.json(
      { error: "Failed to update artist profile" },
      { status: 500 }
    )
  }
}
