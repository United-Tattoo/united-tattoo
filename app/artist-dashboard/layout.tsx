import { redirect } from "next/navigation"
import Link from "next/link"
import { getArtistSession } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Home, User, Image, LogOut } from "lucide-react"

export default async function ArtistDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const artistSession = await getArtistSession()

  if (!artistSession) {
    redirect("/auth/signin")
  }

  const { artist, user } = artistSession

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Artist Dashboard
              </h1>
              <p className="text-sm text-gray-600">
                Welcome back, {artist.name}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="outline" size="sm">
                  View Public Site
                </Button>
              </Link>
              <Link href="/api/auth/signout">
                <Button variant="ghost" size="sm">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <aside className="md:col-span-1">
            <nav className="bg-white rounded-lg shadow-sm p-4 space-y-2">
              <Link href="/artist-dashboard">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  size="sm"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Dashboard Home
                </Button>
              </Link>
              <Link href="/artist-dashboard/profile">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  size="sm"
                >
                  <User className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </Link>
              <Link href="/artist-dashboard/portfolio">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  size="sm"
                >
                  <Image className="h-4 w-4 mr-2" />
                  Manage Portfolio
                </Button>
              </Link>
            </nav>

            {/* Artist Info Card */}
            <div className="bg-white rounded-lg shadow-sm p-4 mt-4">
              <h3 className="font-semibold text-sm text-gray-900 mb-2">
                Your Profile
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <span className="font-medium">Name:</span> {artist.name}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {user.email}
                </p>
                <p>
                  <span className="font-medium">Status:</span>{" "}
                  <span
                    className={
                      artist.isActive ? "text-green-600" : "text-red-600"
                    }
                  >
                    {artist.isActive ? "Active" : "Inactive"}
                  </span>
                </p>
                {artist.instagramHandle && (
                  <p>
                    <span className="font-medium">Instagram:</span> @
                    {artist.instagramHandle}
                  </p>
                )}
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="md:col-span-3">{children}</main>
        </div>
      </div>
    </div>
  )
}
