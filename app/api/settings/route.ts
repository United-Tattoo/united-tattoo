import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { UserRole } from "@/types/database"
import { updateSiteSettingsSchema } from "@/lib/validations"
import { db } from "@/lib/db"

// GET /api/settings - Fetch site settings (public endpoint)
export async function GET(request: NextRequest) {
  try {
    // TODO: Implement via Supabase MCP
    // const settings = await db.siteSettings.findFirst()
    
    // Mock response for now
    const mockSettings = {
      id: "settings-1",
      studioName: "United Tattoo Studio",
      description: "Premier tattoo studio specializing in custom artwork and professional tattooing services.",
      address: "123 Main Street, Denver, CO 80202",
      phone: "+1 (555) 123-4567",
      email: "info@unitedtattoo.com",
      socialMedia: {
        instagram: "https://instagram.com/unitedtattoo",
        facebook: "https://facebook.com/unitedtattoo",
        twitter: "https://twitter.com/unitedtattoo",
        tiktok: "https://tiktok.com/@unitedtattoo",
      },
      businessHours: [
        { dayOfWeek: 1, openTime: "10:00", closeTime: "20:00", isClosed: false }, // Monday
        { dayOfWeek: 2, openTime: "10:00", closeTime: "20:00", isClosed: false }, // Tuesday
        { dayOfWeek: 3, openTime: "10:00", closeTime: "20:00", isClosed: false }, // Wednesday
        { dayOfWeek: 4, openTime: "10:00", closeTime: "20:00", isClosed: false }, // Thursday
        { dayOfWeek: 5, openTime: "10:00", closeTime: "22:00", isClosed: false }, // Friday
        { dayOfWeek: 6, openTime: "10:00", closeTime: "22:00", isClosed: false }, // Saturday
        { dayOfWeek: 0, openTime: "12:00", closeTime: "18:00", isClosed: false }, // Sunday
      ],
      heroImage: "/united-studio-main.jpg",
      logoUrl: "/united-logo-website.jpg",
      updatedAt: new Date(),
    }

    return NextResponse.json(mockSettings)
  } catch (error) {
    console.error("Error fetching site settings:", error)
    return NextResponse.json(
      { error: "Failed to fetch site settings" },
      { status: 500 }
    )
  }
}

// PUT /api/settings - Update site settings (Admin only)
export async function PUT(request: NextRequest) {
  try {
    // Require admin authentication
    await requireAuth(UserRole.SHOP_ADMIN)
    
    const body = await request.json()
    const validatedData = updateSiteSettingsSchema.parse(body)

    // TODO: Implement via Supabase MCP
    // const updatedSettings = await db.siteSettings.update(validatedData)
    
    // Mock response for now
    const mockUpdatedSettings = {
      id: "settings-1",
      studioName: validatedData.studioName || "United Tattoo Studio",
      description: validatedData.description || "Premier tattoo studio specializing in custom artwork and professional tattooing services.",
      address: validatedData.address || "123 Main Street, Denver, CO 80202",
      phone: validatedData.phone || "+1 (555) 123-4567",
      email: validatedData.email || "info@unitedtattoo.com",
      socialMedia: validatedData.socialMedia || {
        instagram: "https://instagram.com/unitedtattoo",
        facebook: "https://facebook.com/unitedtattoo",
        twitter: "https://twitter.com/unitedtattoo",
        tiktok: "https://tiktok.com/@unitedtattoo",
      },
      businessHours: validatedData.businessHours || [
        { dayOfWeek: 1, openTime: "10:00", closeTime: "20:00", isClosed: false },
        { dayOfWeek: 2, openTime: "10:00", closeTime: "20:00", isClosed: false },
        { dayOfWeek: 3, openTime: "10:00", closeTime: "20:00", isClosed: false },
        { dayOfWeek: 4, openTime: "10:00", closeTime: "20:00", isClosed: false },
        { dayOfWeek: 5, openTime: "10:00", closeTime: "22:00", isClosed: false },
        { dayOfWeek: 6, openTime: "10:00", closeTime: "22:00", isClosed: false },
        { dayOfWeek: 0, openTime: "12:00", closeTime: "18:00", isClosed: false },
      ],
      heroImage: validatedData.heroImage || "/united-studio-main.jpg",
      logoUrl: validatedData.logoUrl || "/united-logo-website.jpg",
      updatedAt: new Date(),
    }

    return NextResponse.json(mockUpdatedSettings)
  } catch (error) {
    console.error("Error updating site settings:", error)
    
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
      { error: "Failed to update site settings" },
      { status: 500 }
    )
  }
}

// POST /api/settings - Initialize site settings (Super Admin only)
export async function POST(request: NextRequest) {
  try {
    // Require super admin authentication
    await requireAuth(UserRole.SUPER_ADMIN)
    
    const body = await request.json()
    const validatedData = updateSiteSettingsSchema.parse(body)

    // TODO: Implement via Supabase MCP
    // Check if settings already exist
    // const existingSettings = await db.siteSettings.findFirst()
    // if (existingSettings) {
    //   return NextResponse.json(
    //     { error: "Site settings already exist. Use PUT to update." },
    //     { status: 409 }
    //   )
    // }

    // const newSettings = await db.siteSettings.create(validatedData)
    
    // Mock response for now
    const mockNewSettings = {
      id: `settings-${Date.now()}`,
      studioName: validatedData.studioName || "United Tattoo Studio",
      description: validatedData.description || "Premier tattoo studio specializing in custom artwork and professional tattooing services.",
      address: validatedData.address || "123 Main Street, Denver, CO 80202",
      phone: validatedData.phone || "+1 (555) 123-4567",
      email: validatedData.email || "info@unitedtattoo.com",
      socialMedia: validatedData.socialMedia || {},
      businessHours: validatedData.businessHours || [],
      heroImage: validatedData.heroImage,
      logoUrl: validatedData.logoUrl,
      updatedAt: new Date(),
    }

    return NextResponse.json(mockNewSettings, { status: 201 })
  } catch (error) {
    console.error("Error creating site settings:", error)
    
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
      { error: "Failed to create site settings" },
      { status: 500 }
    )
  }
}
