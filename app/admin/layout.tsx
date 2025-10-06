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
      {/* Sidebar */}
      <AdminSidebar user={session.user} />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-900">
              Admin Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {session.user.name}
              </span>
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <span className="text-sm font-medium text-gray-600">
                    {session.user.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
