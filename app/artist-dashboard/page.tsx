import { redirect } from "next/navigation"
import Link from "next/link"
import { getArtistSession } from "@/lib/auth"
import { getArtistWithPortfolio } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Image as ImageIcon, User, ExternalLink } from "lucide-react"

async function getArtistStats(artistId: string) {
  const artist = await getArtistWithPortfolio(artistId)
  
  if (!artist) {
    return {
      totalImages: 0,
      activeImages: 0,
      lastUpdated: new Date()
    }
  }

  const totalImages = artist.portfolioImages.length
  const activeImages = artist.portfolioImages.filter(img => img.isPublic).length

  return {
    totalImages,
    activeImages,
    lastUpdated: artist.updatedAt
  }
}

export default async function ArtistDashboardPage() {
  const artistSession = await getArtistSession()

  if (!artistSession) {
    redirect("/auth/signin")
  }

  const { artist } = artistSession
  const stats = await getArtistStats(artist.id)

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome to Your Dashboard
        </h2>
        <p className="text-gray-600">
          Manage your portfolio, update your profile, and track your presence on United Tattoo.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Portfolio Images
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalImages}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {stats.activeImages} public
                </p>
              </div>
              <ImageIcon className="h-12 w-12 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Profile Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">
                  {artist.isActive ? "Active" : "Inactive"}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {artist.specialties.length} specialties
                </p>
              </div>
              <User className="h-12 w-12 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Last Updated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <p className="text-lg font-semibold text-gray-900">
                {stats.lastUpdated.toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {stats.lastUpdated.toLocaleTimeString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/artist-dashboard/portfolio">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-base">Upload New Work</CardTitle>
                <CardDescription>
                  Add images to your portfolio
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/artist-dashboard/profile">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-base">Update Profile</CardTitle>
                <CardDescription>
                  Edit your bio and specialties
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href={`/artists/${artist.slug}`} target="_blank">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  View Public Profile
                  <ExternalLink className="h-4 w-4" />
                </CardTitle>
                <CardDescription>
                  See how your profile appears to clients
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Card className="bg-gray-50">
            <CardHeader>
              <CardTitle className="text-base text-gray-600">
                Coming Soon
              </CardTitle>
              <CardDescription>
                View analytics and booking requests
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Profile Completion */}
      {(!artist.bio || artist.specialties.length === 0 || stats.totalImages === 0) && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-amber-900 mb-2">
            Complete Your Profile
          </h3>
          <p className="text-amber-800 mb-4">
            Make your profile stand out by completing these steps:
          </p>
          <ul className="space-y-2">
            {!artist.bio && (
              <li className="flex items-start gap-2 text-amber-900">
                <span className="text-amber-600">•</span>
                <span>
                  Add a bio to tell clients about your experience
                  <Link href="/artist-dashboard/profile" className="ml-2 text-amber-700 underline hover:text-amber-900">
                    Add bio
                  </Link>
                </span>
              </li>
            )}
            {artist.specialties.length === 0 && (
              <li className="flex items-start gap-2 text-amber-900">
                <span className="text-amber-600">•</span>
                <span>
                  List your specialties to help clients find you
                  <Link href="/artist-dashboard/profile" className="ml-2 text-amber-700 underline hover:text-amber-900">
                    Add specialties
                  </Link>
                </span>
              </li>
            )}
            {stats.totalImages === 0 && (
              <li className="flex items-start gap-2 text-amber-900">
                <span className="text-amber-600">•</span>
                <span>
                  Upload portfolio images to showcase your work
                  <Link href="/artist-dashboard/portfolio" className="ml-2 text-amber-700 underline hover:text-amber-900">
                    Upload images
                  </Link>
                </span>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
