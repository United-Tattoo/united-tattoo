import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import { UserRole } from "@/types/database"

// Simple request logging for debugging
function logRequest(req: Request, pathname: string, duration?: number) {
  // Only log in development or when DEBUG is set
  if (process.env.NODE_ENV !== "development" && !process.env.DEBUG) return

  const method = req.method
  const status = duration !== undefined ? "completed" : "started"
  const timing = duration !== undefined ? `${duration}ms` : ""

  console.log(`[${new Date().toISOString()}] ${method} ${pathname} ${status} ${timing}`.trim())
}

export default withAuth(
  function middleware(req) {
    const startTime = Date.now()
    const token = req.nextauth.token
    const { pathname } = req.nextUrl

    // Log incoming request
    logRequest(req, pathname)

    // Permanent redirect for renamed artist slug
    if (pathname === "/artists/amari-rodriguez") {
      const url = new URL("/artists/amari-kyss", req.url)
      const res = NextResponse.redirect(url, 308)
      return res
    }

    // Allow token-based bypass for admin migrate endpoint (non-interactive deployments)
    const migrateToken = process.env.MIGRATE_TOKEN
    const headerToken = req.headers.get("x-migrate-token")
    const urlToken = req.nextUrl.searchParams.get("token")
    const hasMigrateBypass =
      pathname.startsWith("/api/admin/migrate") &&
      ((headerToken && headerToken === migrateToken) || (urlToken && urlToken === migrateToken))

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

    // Artist dashboard routes
    if (pathname.startsWith("/artist-dashboard")) {
      if (!token) {
        return NextResponse.redirect(new URL("/auth/signin", req.url))
      }

      const userRole = token.role as UserRole
      if (userRole !== UserRole.ARTIST && userRole !== UserRole.SHOP_ADMIN && userRole !== UserRole.SUPER_ADMIN) {
        return NextResponse.redirect(new URL("/unauthorized", req.url))
      }
    }

    // Legacy artist-specific routes (if any)
    if (pathname.startsWith("/artist") && !pathname.startsWith("/artists")) {
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
      // Bypass for migration endpoint with valid token (used for automated deploys)
      if (hasMigrateBypass) {
        return NextResponse.next()
      }

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

        // Token-based bypass for migration endpoint (before auth checks)
        const migrateToken = process.env.MIGRATE_TOKEN
        const headerToken = req.headers.get("x-migrate-token")
        const urlToken = req.nextUrl.searchParams.get("token")
        if (
          pathname.startsWith("/api/admin/migrate") &&
          ((headerToken && headerToken === migrateToken) || (urlToken && urlToken === migrateToken))
        ) {
          return true
        }

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
