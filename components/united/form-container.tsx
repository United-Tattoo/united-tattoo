import * as React from "react"
import { cn } from "@/lib/utils"

export interface FormContainerProps extends React.FormHTMLAttributes<HTMLFormElement> {}

const FormContainer = React.forwardRef<HTMLFormElement, FormContainerProps>(({ className, ...props }, ref) => {
  return (
    <form
      ref={ref}
      className={cn(
        "rounded-[22px] p-8",
        "bg-gradient-to-br from-[rgba(242,227,208,0.98)] to-[rgba(255,247,236,0.95)]",
        "border border-[rgba(210,106,50,0.2)]",
        "shadow-[0_14px_24px_rgba(31,27,23,0.18)]",
        "grid gap-6",
        className,
      )}
      {...props}
    />
  )
})
FormContainer.displayName = "FormContainer"

export { FormContainer }
