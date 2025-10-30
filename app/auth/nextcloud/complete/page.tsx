"use client"

import { useEffect } from "react"
import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"

/**
 * Nextcloud OAuth Completion Page
 *
 * This page automatically completes the NextAuth sign-in after successful OAuth.
 * It receives a one-time token and submits it to the credentials provider.
 */
export default function NextcloudCompletePage() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const callbackUrl = searchParams.get("callbackUrl") || "/admin"

  useEffect(() => {
    if (!token) {
      // No token, redirect to sign-in
      window.location.href = "/auth/signin?error=SessionError"
      return
    }

    // Auto-submit to NextAuth credentials provider
    const completeSignIn = async () => {
      try {
        const result = await signIn("credentials", {
          nextcloud_token: token,
          redirect: false,
        })

        if (result?.error) {
          console.error("Sign-in error:", result.error)
          window.location.href = "/auth/signin?error=SessionError"
        } else if (result?.ok) {
          // Success! Redirect to callback URL
          window.location.href = callbackUrl
        }
      } catch (error) {
        console.error("Unexpected error during sign-in:", error)
        window.location.href = "/auth/signin?error=SessionError"
      }
    }

    completeSignIn()
  }, [token, callbackUrl])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin mx-auto text-gray-600" />
        <p className="mt-4 text-gray-600">Completing sign-in...</p>
      </div>
    </div>
  )
}
