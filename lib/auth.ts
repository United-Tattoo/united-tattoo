import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { env } from "./env"
import { UserRole } from "@/types/database"

export const authOptions: NextAuthOptions = {
  // Note: Database adapter will be configured via Supabase MCP
  // For now, using JWT strategy without database adapter
  providers: [
    // Credentials provider for email/password login
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("Authorize called with:", credentials)
        
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing email or password")
          return null
        }

        console.log("Email received:", credentials.email)
        console.log("Password received:", credentials.password ? "***" : "empty")

        // Seed admin user for nicholai@biohazardvfx.com
        if (credentials.email === "nicholai@biohazardvfx.com") {
          console.log("Admin user recognized!")
          return {
            id: "admin-nicholai",
            email: "nicholai@biohazardvfx.com",
            name: "Nicholai",
            role: UserRole.SUPER_ADMIN,
          }
        }

        // For development: Accept any other email/password combination
        console.log("Using fallback user creation")
        const user = {
          id: "dev-user-" + Date.now(),
          email: credentials.email,
          name: credentials.email.split("@")[0],
          role: UserRole.SUPER_ADMIN, // Give admin access for testing
        }
        
        console.log("Created user:", user)
        return user
      }
    }),
    
    // Google OAuth provider (optional)
    ...(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET ? [
      GoogleProvider({
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      })
    ] : []),
    
    // GitHub OAuth provider (optional)
    ...(env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET ? [
      GitHubProvider({
        clientId: env.GITHUB_CLIENT_ID,
        clientSecret: env.GITHUB_CLIENT_SECRET,
      })
    ] : []),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Add user role to JWT token
      if (user) {
        // Use the role from the user object (set in authorize function)
        token.role = (user as any).role || UserRole.CLIENT
        token.userId = user.id
      }
      return token
    },
    async session({ session, token }) {
      // Add user role and ID to session
      if (token) {
        session.user.id = token.userId as string
        session.user.role = token.role as UserRole
      }
      return session
    },
    async signIn({ user, account, profile }) {
      // Custom sign-in logic
      return true
    },
    async redirect({ url, baseUrl }) {
      // Follows NextAuth.js best practices for redirect
      if (url.startsWith("/")) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return `${baseUrl}/admin`
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      // Log sign-in events
      console.log(`User ${user.email} signed in`)
    },
    async signOut({ session, token }) {
      // Log sign-out events
      console.log(`User signed out`)
    },
  },
  debug: env.NODE_ENV === "development",
}

/**
 * Utility function to get server-side session
 */
export async function getServerSession() {
  const { getServerSession: getNextAuthServerSession } = await import("next-auth/next")
  return getNextAuthServerSession(authOptions)
}

/**
 * Route protection utility
 * @param requiredRole - Minimum role required to access the route
 */
export async function requireAuth(requiredRole?: UserRole) {
  const session = await getServerSession()
  
  if (!session) {
    throw new Error("Authentication required")
  }
  
  if (requiredRole && !hasRole(session.user.role, requiredRole)) {
    throw new Error("Insufficient permissions")
  }
  
  return session
}

/**
 * Check if user has required role or higher
 */
export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  const roleHierarchy = {
    [UserRole.CLIENT]: 0,
    [UserRole.ARTIST]: 1,
    [UserRole.SHOP_ADMIN]: 2,
    [UserRole.SUPER_ADMIN]: 3,
  }
  
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}

/**
 * Check if user is admin (SHOP_ADMIN or SUPER_ADMIN)
 */
export function isAdmin(role: UserRole): boolean {
  return role === UserRole.SHOP_ADMIN || role === UserRole.SUPER_ADMIN
}

/**
 * Check if user is super admin
 */
export function isSuperAdmin(role: UserRole): boolean {
  return role === UserRole.SUPER_ADMIN
}

/**
 * Get current artist session
 * Returns the artist record and user data if the logged-in user is an artist
 */
export async function getArtistSession() {
  const session = await getServerSession()
  
  if (!session?.user) {
    return null
  }
  
  // Check if user has ARTIST role
  const userRole = session.user.role
  if (userRole !== UserRole.ARTIST && !isAdmin(userRole)) {
    return null
  }
  
  // Import db function dynamically to avoid circular dependencies
  const { getArtistByUserId } = await import('@/lib/db')
  const artist = await getArtistByUserId(session.user.id)
  
  if (!artist) {
    return null
  }
  
  return {
    artist,
    user: session.user
  }
}

/**
 * Require artist authentication
 * Throws error if user is not an artist, otherwise returns artist and user data
 */
export async function requireArtistAuth() {
  const artistSession = await getArtistSession()
  
  if (!artistSession) {
    throw new Error("Artist authentication required")
  }
  
  return artistSession
}

/**
 * Check if a user can edit a specific artist profile
 * Returns true if the user is the artist themselves, or has admin privileges
 */
export async function canEditArtist(userId: string, artistId: string): Promise<boolean> {
  const session = await getServerSession()
  
  if (!session?.user) {
    return false
  }
  
  // Admins can edit any artist
  if (isAdmin(session.user.role)) {
    return true
  }
  
  // Check if this user owns the artist profile
  const { getArtistByUserId } = await import('@/lib/db')
  const artist = await getArtistByUserId(userId)
  
  return artist?.id === artistId
}

// Extend NextAuth types
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      image?: string
      role: UserRole
    }
  }
  
  interface User {
    role: UserRole
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: string
    role: UserRole
  }
}
