import { NextRequest, NextResponse } from "next/server"
import { requireArtistAuth, canEditArtist, isAdmin } from "@/lib/auth"
import { updatePortfolioImage, deletePortfolioImage, getArtistWithPortfolio } from "@/lib/db"
import { getServerSession } from "@/lib/auth"

export const dynamic = "force-dynamic"

// GET /api/portfolio/[id] - Get a single portfolio image
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // This endpoint could be public or require auth depending on requirements
    // For now, making it public since portfolio images are viewable
    
    return NextResponse.json({ message: "Not implemented yet" }, { status: 501 })
  } catch (error) {
    console.error("Error fetching portfolio image:", error)
    return NextResponse.json(
      { error: "Failed to fetch image" },
      { status: 500 }
    )
  }
}

// PUT /api/portfolio/[id] - Update a portfolio image
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
  context?: any
) {
  try {
    const { id } = params

    // Require artist authentication
    const { artist, user } = await requireArtistAuth()

    // Parse request body
    const body = await request.json()

    // Get the image to verify ownership
    const artistWithPortfolio = await getArtistWithPortfolio(artist.id, context?.env)
    const image = artistWithPortfolio?.portfolioImages.find(img => img.id === id)

    if (!image) {
      return NextResponse.json(
        { error: "Image not found" },
        { status: 404 }
      )
    }

    // Verify the image belongs to this artist (or user is admin)
    const session = await getServerSession()
    if (image.artistId !== artist.id && !isAdmin(session!.user.role)) {
      return NextResponse.json(
        { error: "You don't have permission to edit this image" },
        { status: 403 }
      )
    }

    // Update the image
    const updatedImage = await updatePortfolioImage(
      id,
      {
        caption: body.caption,
        tags: body.tags,
        isPublic: body.isPublic,
        orderIndex: body.orderIndex
      },
      context?.env
    )

    return NextResponse.json(updatedImage)
  } catch (error) {
    console.error("Error updating portfolio image:", error)

    if (error instanceof Error) {
      if (error.message.includes("Artist authentication required")) {
        return NextResponse.json(
          { error: "Artist authentication required" },
          { status: 401 }
        )
      }
    }

    return NextResponse.json(
      { error: "Failed to update image" },
      { status: 500 }
    )
  }
}

// DELETE /api/portfolio/[id] - Delete a portfolio image
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
  context?: any
) {
  try {
    const { id } = params

    // Require artist authentication
    const { artist } = await requireArtistAuth()

    // Get the image to verify ownership
    const artistWithPortfolio = await getArtistWithPortfolio(artist.id, context?.env)
    const image = artistWithPortfolio?.portfolioImages.find(img => img.id === id)

    if (!image) {
      return NextResponse.json(
        { error: "Image not found" },
        { status: 404 }
      )
    }

    // Verify the image belongs to this artist (or user is admin)
    const session = await getServerSession()
    if (image.artistId !== artist.id && !isAdmin(session!.user.role)) {
      return NextResponse.json(
        { error: "You don't have permission to delete this image" },
        { status: 403 }
      )
    }

    // Delete the image from database
    await deletePortfolioImage(id, context?.env)

    // TODO: Also delete from R2 storage if needed

    return NextResponse.json({ success: true, message: "Image deleted successfully" })
  } catch (error) {
    console.error("Error deleting portfolio image:", error)

    if (error instanceof Error) {
      if (error.message.includes("Artist authentication required")) {
        return NextResponse.json(
          { error: "Artist authentication required" },
          { status: 401 }
        )
      }
    }

    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    )
  }
}
