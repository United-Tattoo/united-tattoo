"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CreditCard, Search, CheckCircle, XCircle } from "lucide-react"

export function GiftCardBalanceChecker() {
  const [giftCardCode, setGiftCardCode] = useState("")
  const [balance, setBalance] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const checkBalance = async () => {
    if (!giftCardCode.trim()) {
      setError("Please enter a gift card code")
      return
    }

    setIsLoading(true)
    setError("")
    setBalance(null)

    try {
      const response = await fetch(`/api/gift-cards?code=${encodeURIComponent(giftCardCode)}`)
      const data = await response.json()

      if (data.success) {
        setBalance(data.giftCard.remainingBalance)
      } else {
        setError(data.error || "Gift card not found")
      }
    } catch (err) {
      setError("Failed to check balance. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="w-5 h-5" />
          <span>Check Gift Card Balance</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Gift Card Code</label>
          <Input
            value={giftCardCode}
            onChange={(e) => setGiftCardCode(e.target.value.toUpperCase())}
            placeholder="XXXX-XXXX-XXXX"
            maxLength={14}
          />
        </div>

        <Button onClick={checkBalance} disabled={isLoading} className="w-full">
          <Search className="w-4 h-4 mr-2" />
          {isLoading ? "Checking..." : "Check Balance"}
        </Button>

        {balance !== null && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>Balance: ${balance}</strong>
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="border-red-200 bg-red-50">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
