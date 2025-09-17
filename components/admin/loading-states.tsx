'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Loader2 } from 'lucide-react'

// Generic loading spinner
export function LoadingSpinner({ size = 'default', className = '' }: { 
  size?: 'sm' | 'default' | 'lg'
  className?: string 
}) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    default: 'h-6 w-6',
    lg: 'h-8 w-8'
  }

  return (
    <Loader2 className={`animate-spin ${sizeClasses[size]} ${className}`} />
  )
}

// Full page loading
export function PageLoading({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  )
}

// Dashboard stats loading
export function StatsLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-[60px] mb-2" />
            <Skeleton className="h-3 w-[120px]" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Table loading
export function TableLoading({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-[150px]" />
          <Skeleton className="h-9 w-[100px]" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Table header */}
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
          
          {/* Table rows */}
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <Skeleton key={colIndex} className="h-4 w-full" />
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Calendar loading
export function CalendarLoading() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-[200px]" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-[120px]" />
            <Skeleton className="h-9 w-[100px]" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Calendar header */}
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
          
          {/* Calendar body */}
          {Array.from({ length: 5 }).map((_, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 gap-2">
              {Array.from({ length: 7 }).map((_, dayIndex) => (
                <div key={dayIndex} className="space-y-1">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Form loading
export function FormLoading() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-[200px]" />
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Form fields */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
        
        {/* Form actions */}
        <div className="flex gap-2 pt-4">
          <Skeleton className="h-10 w-[100px]" />
          <Skeleton className="h-10 w-[80px]" />
        </div>
      </CardContent>
    </Card>
  )
}

// Chart loading
export function ChartLoading({ height = 300 }: { height?: number }) {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-[150px]" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-end justify-between" style={{ height: `${height}px` }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton 
                key={i} 
                className="w-8" 
                style={{ height: `${Math.random() * height * 0.8 + height * 0.2}px` }}
              />
            ))}
          </div>
          <div className="flex justify-between">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-3 w-8" />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// List loading
export function ListLoading({ items = 5 }: { items?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-3 w-[150px]" />
              </div>
              <Skeleton className="h-8 w-[80px]" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Image grid loading
export function ImageGridLoading({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  )
}

// Button loading state
export function ButtonLoading({ 
  children, 
  isLoading, 
  ...props 
}: { 
  children: React.ReactNode
  isLoading: boolean
  [key: string]: any 
}) {
  return (
    <button {...props} disabled={isLoading || props.disabled}>
      {isLoading ? (
        <div className="flex items-center gap-2">
          <LoadingSpinner size="sm" />
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  )
}

// Inline loading for small components
export function InlineLoading({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <LoadingSpinner size="sm" />
      <span>{text}</span>
    </div>
  )
}
