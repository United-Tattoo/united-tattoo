'use client'

import * as React from 'react'
import * as ProgressPrimitive from '@radix-ui/react-progress'

import { cn } from '@/lib/utils'

function Progress({
  className,
  value,
  'aria-label': ariaLabel,
  'aria-valuemin': ariaValueMin = 0,
  'aria-valuemax': ariaValueMax = 100,
  'aria-valuenow': ariaValueNow,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & {
  'aria-label'?: string
  'aria-valuemin'?: number
  'aria-valuemax'?: number
  'aria-valuenow'?: number
}) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      role="progressbar"
      aria-label={ariaLabel}
      aria-valuemin={ariaValueMin}
      aria-valuemax={ariaValueMax}
      aria-valuenow={ariaValueNow ?? value}
      className={cn(
        'bg-primary/20 relative h-2 w-full overflow-hidden rounded-full',
        className,
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="bg-primary h-full w-full flex-1 transition-all"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
