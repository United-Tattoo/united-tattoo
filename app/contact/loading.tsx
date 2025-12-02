import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Navigation placeholder */}
      <div className="h-16" />

      <div className="container mx-auto px-4 py-8 space-y-8 pt-16">
        {/* Header skeleton */}
        <div className="text-center space-y-4">
          <Skeleton className="h-12 w-56 mx-auto" />
          <Skeleton className="h-6 w-96 mx-auto max-w-full" />
        </div>

        {/* Contact info cards skeleton */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-6 border rounded-2xl space-y-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-6 w-32" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>

        {/* Map placeholder */}
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-80 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  )
}

