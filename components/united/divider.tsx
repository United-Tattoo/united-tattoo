import * as React from "react"
import { cn } from "@/lib/utils"

export interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {}

const Divider = React.forwardRef<HTMLHRElement, DividerProps>(({ className, ...props }, ref) => {
  return (
    <hr
      ref={ref}
      className={cn(
        "border-0 h-px my-16",
        "bg-gradient-to-r from-transparent via-[rgba(36,27,22,0.15)] to-transparent",
        className,
      )}
      {...props}
    />
  )
})
Divider.displayName = "Divider"

export { Divider }
