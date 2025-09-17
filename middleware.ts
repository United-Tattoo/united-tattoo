import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import { UserRole } from "@/types/database"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const { pathname } = req.nextUrl

    // Admin routes protection
    if (pathname.startsWith("/admin")) {
      if (!token) {
        return NextResponse.redirect(new URL("/auth/signin", req.url))
      }

      // Check if user has admin role
      const userRole = token.role as UserRole
      if (userRole !== UserRole.SHOP_ADMIN && userRole !== UserRole.SUPER_ADMIN) {
        return NextResponse.redirect(new URL("/unauthorized", req.url))
      }
    }

    // Artist-specific routes
    if (pathname.startsWith("/artist")) {
      if (!token) {
        return NextResponse.redirect(new URL("/auth/signin", req.url))
      }

      const userRole = token.role as UserRole
      if (userRole !== UserRole.ARTIST && userRole !== UserRole.SHOP_ADMIN && userRole !== UserRole.SUPER_ADMIN) {
        return NextResponse.redirect(new URL("/unauthorized", req.url))
      }
    }

    // API routes protection
    if (pathname.startsWith("/api/admin")) {
      if (!token) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 })
      }

      const userRole = token.role as UserRole
      if (userRole !== UserRole.SHOP_ADMIN && userRole !== UserRole.SUPER_ADMIN) {
        return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Public routes that don't require authentication
        const publicRoutes = [
          "/",
          "/artists",
          "/contact",
          "/book",
          "/aftercare",
          "/gift-cards",
          "/specials",
          "/terms",
          "/privacy",
          "/auth/signin",
          "/auth/error",
          "/unauthorized"
        ]

        // Allow public routes and artist portfolio pages
        if (publicRoutes.some(route => pathname === route || pathname.startsWith(route))) {
          return true
        }

        // Allow individual artist portfolio pages (public access)
        if (pathname.match(/^\/artists\/[^\/]+$/)) {
          return true
        }

        // Allow public API routes
        if (pathname.startsWith("/api/auth") || pathname.startsWith("/api/public")) {
          return true
        }

        // Require authentication for all other routes
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)",
  ],
}
