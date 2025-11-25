import * as React from "react"
import { cn } from "@/lib/utils"

export interface MetadataProps extends React.HTMLAttributes<HTMLSpanElement> {}

const Metadata = React.forwardRef<HTMLSpanElement, MetadataProps>(({ className, ...props }, ref) => {
  return <span ref={ref} className={cn("text-[0.7rem] uppercase tracking-[0.25em] opacity-80", className)} {...props} />
})
Metadata.displayName = "Metadata"

export { Metadata }
