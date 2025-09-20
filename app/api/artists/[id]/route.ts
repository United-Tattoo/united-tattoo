import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { UserRole } from "@/types/database"
import { updateArtistSchema } from "@/lib/validations"
import { db } from "@/lib/db"
import { Flags } from "@/lib/flags"

// GET /api/artists/[id] - Fetch a specific artist
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // TODO: Implement via Supabase MCP
    // const artist = await db.artists.findUnique(id)
    
    // Mock response for now
    const mockArtist = {
      id,
      userId: "user-1",
      name: "Alex Rivera",
      bio: "Specializing in traditional and neo-traditional tattoos with over 8 years of experience.",
      specialties: ["Traditional", "Neo-Traditional", "Color Work"],
      instagramHandle: "alexrivera_tattoo",
      isActive: true,
      hourlyRate: 150,
      portfolioImages: [
        {
          id: "img-1",
          artistId: id,
          url: "/artists/alex-rivera-traditional-rose.jpg",
          caption: "Traditional rose tattoo",
          tags: ["traditional", "rose", "color"],
          order: 1,
          isPublic: true,
          createdAt: new Date(),
        },
      ],
      availability: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    if (!mockArtist) {
      return NextResponse.json(
        { error: "Artist not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(mockArtist)
  } catch (error) {
    console.error("Error fetching artist:", error)
    return NextResponse.json(
      { error: "Failed to fetch artist" },
      { status: 500 }
    )
  }
}

// PUT /api/artists/[id] - Update a specific artist (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!Flags.ARTISTS_MODULE_ENABLED) {
      return NextResponse.json({ error: 'Artists module disabled' }, { status: 503 })
    }
    // Require admin authentication
    const session = await requireAuth(UserRole.SHOP_ADMIN)
    
    const { id } = params
    const body = await request.json()
    const validatedData = updateArtistSchema.parse({ ...body, id })

    // TODO: Implement via Supabase MCP
    // const updatedArtist = await db.artists.update(id, validatedData)
    
    // Mock response for now
    const mockUpdatedArtist = {
      id,
      userId: "user-1",
      name: validatedData.name || "Alex Rivera",
      bio: validatedData.bio || "Updated bio",
      specialties: validatedData.specialties || ["Traditional"],
      instagramHandle: validatedData.instagramHandle,
      isActive: validatedData.isActive ?? true,
      hourlyRate: validatedData.hourlyRate,
      portfolioImages: [],
      availability: [],
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date(),
    }

    return NextResponse.json(mockUpdatedArtist)
  } catch (error) {
    console.error("Error updating artist:", error)
    
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
      { error: "Failed to update artist" },
      { status: 500 }
    )
  }
}

// DELETE /api/artists/[id] - Delete a specific artist (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!Flags.ARTISTS_MODULE_ENABLED) {
      return NextResponse.json({ error: 'Artists module disabled' }, { status: 503 })
    }
    // Require admin authentication
    await requireAuth(UserRole.SHOP_ADMIN)
    
    const { id } = params

    // TODO: Implement via Supabase MCP
    // await db.artists.delete(id)
    
    // Mock response for now
    console.log(`Artist ${id} would be deleted`)

    return NextResponse.json(
      { message: "Artist deleted successfully" },
      { status: 200 }
    )
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
