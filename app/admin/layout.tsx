import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { UserRole } from "@/types/database"
import { AdminSidebar } from "@/components/admin/sidebar"
import { Flags } from "@/lib/flags"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if (!Flags.ADMIN_ENABLED) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-2xl font-semibold">Admin temporarily unavailable</h1>
          <p className="text-muted-foreground">
            We’re performing maintenance or addressing an incident. Please try again later.
          </p>
        </div>
      </div>
    )
  }
  // Check authentication and authorization
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/auth/signin")
  }
  
  // Check if user has admin role
  if (session.user.role !== UserRole.SHOP_ADMIN && session.user.role !== UserRole.SUPER_ADMIN) {
    redirect("/unauthorized")
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Skip to main content link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        Skip to main content
      </a>

      {/* Sidebar */}
      <nav role="navigation" aria-label="Admin navigation">
        <AdminSidebar user={session.user} />
      </nav>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200" role="banner">
          <div className="flex items-center justify-between px-6 py-4">
            <span className="text-xl font-semibold text-gray-900">
              Admin Dashboard
            </span>
            <div className="flex items-center space-x-4">
              <span className="text-base text-gray-600">
                Welcome, {session.user.name}
              </span>
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={`${session.user.name}'s profile picture`}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <span className="text-base font-medium text-gray-600">
                    {session.user.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main id="main-content" className="flex-1 overflow-y-auto p-6" role="main" aria-label="Admin dashboard content">
          {children}
        </main>
      </div>
    </div>
  )
}
