import * as React from "react"
import { cn } from "@/lib/utils"

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "success" | "alert"
  title: string
  description?: string
  icon?: React.ReactNode
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant = "success", title, description, icon, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center gap-5 px-5 py-4 rounded-[14px] text-white",
          "shadow-[var(--shadow-md)]",
          variant === "success" && "bg-[var(--sage)]",
          variant === "alert" && "bg-[var(--rose)]",
          className,
        )}
        {...props}
      >
        <div className="w-8 h-8 rounded-lg bg-white/20 grid place-items-center font-semibold">
          {icon || (variant === "success" ? "✓" : "!")}
        </div>
        <div>
          <strong className="block text-[0.9rem]">{title}</strong>
          {description && <span className="text-[0.8rem] opacity-90">{description}</span>}
        </div>
      </div>
    )
  },
)
Toast.displayName = "Toast"

export { Toast }
