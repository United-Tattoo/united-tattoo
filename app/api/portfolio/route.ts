import { NextRequest, NextResponse } from "next/server"
import { requireArtistAuth } from "@/lib/auth"
import { addPortfolioImage } from "@/lib/db"
import { uploadToR2 } from "@/lib/r2-upload"

export const dynamic = "force-dynamic"

// POST /api/portfolio - Upload a new portfolio image
export async function POST(
  request: NextRequest,
  { params }: { params?: any } = {},
  context?: any
) {
  try {
    // Require artist authentication
    const { artist } = await requireArtistAuth()

    // Parse form data
    const formData = await request.formData()
    const file = formData.get("file") as File
    const caption = formData.get("caption") as string
    const tagsString = formData.get("tags") as string
    const isPublic = formData.get("isPublic") === "true"

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      )
    }

    // Upload to R2
    const imageUrl = await uploadToR2(file, `portfolio/${artist.id}`, context?.env)

    // Parse tags
    let tags: string[] = []
    try {
      tags = tagsString ? JSON.parse(tagsString) : []
    } catch (e) {
      tags = []
    }

    // Add to database
    const portfolioImage = await addPortfolioImage(
      artist.id,
      {
        url: imageUrl,
        caption: caption || null,
        tags,
        orderIndex: 0,
        isPublic
      },
      context?.env
    )

    return NextResponse.json(portfolioImage, { status: 201 })
  } catch (error) {
    console.error("Error uploading portfolio image:", error)

    if (error instanceof Error) {
      if (error.message.includes("Artist authentication required")) {
        return NextResponse.json(
          { error: "Artist authentication required" },
          { status: 401 }
        )
      }
    }

    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    )
  }
}
