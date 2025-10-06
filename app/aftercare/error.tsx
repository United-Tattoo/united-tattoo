'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ reset }: ErrorProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Alert variant="destructive" className="max-w-2xl mx-auto">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Something went wrong!</AlertTitle>
        <AlertDescription className="space-y-4">
          <p>
            We encountered an error while loading the aftercare information. 
            Please try again or contact support if the problem persists.
          </p>
          <Button 
            onClick={reset}
            variant="outline"
            size="sm"
          >
            Try again
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  )
}
