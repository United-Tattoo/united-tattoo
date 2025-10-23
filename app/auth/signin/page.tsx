"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Cloud } from "lucide-react"

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()

  const urlError = searchParams.get("error")
  const callbackUrl = searchParams.get("callbackUrl") || "/admin"
  const showAdminLogin = searchParams.get("admin") === "true"

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })
      
      if (result?.error) {
        setError("Invalid email or password. Please try again.")
      } else if (result?.ok) {
        // Successful signin - redirect to admin
        router.push(callbackUrl)
        router.refresh()
      }
    } catch (error) {
      setError("An error occurred during sign in. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleNextcloudSignIn = () => {
    setIsLoading(true)
    setError(null)
    // Redirect to custom OAuth authorization route
    window.location.href = `/api/auth/nextcloud/authorize?callbackUrl=${encodeURIComponent(callbackUrl)}`
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
          <CardDescription>
            {showAdminLogin
              ? "Admin emergency access"
              : "Access the United Tattoo Studio dashboard"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {(error || urlError) && (
            <Alert variant="destructive">
              <AlertDescription>
                {error ||
                  (urlError === "CredentialsSignin"
                    ? "Invalid email or password. Please try again."
                    : urlError === "OAuthSignin"
                    ? "Unable to sign in with Nextcloud. Please ensure you are in the 'artists' or 'shop_admins' group."
                    : "An error occurred during sign in. Please try again.")}
              </AlertDescription>
            </Alert>
          )}

          {!showAdminLogin ? (
            <>
              {/* Nextcloud OAuth Primary Sign In */}
              <Button
                onClick={handleNextcloudSignIn}
                className="w-full"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <Cloud className="mr-2 h-5 w-5" />
                    Sign in with Nextcloud
                  </>
                )}
              </Button>

              {/* Info Text */}
              <div className="text-center text-sm text-gray-600">
                <p>Use your Nextcloud credentials to sign in.</p>
                <p className="text-xs mt-2 text-gray-500">
                  You must be a member of the &apos;artists&apos; or
                  &apos;shop_admins&apos; group.
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Credentials Form (Admin Fallback) */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="nicholai@biohazardvfx.com"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              {/* Development Note */}
              <div className="text-center text-sm text-gray-500">
                <p className="text-xs">
                  Admin emergency access only.<br />
                  For normal sign in, use Nextcloud OAuth.
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
