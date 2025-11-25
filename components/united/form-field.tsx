import * as React from "react"
import { cn } from "@/lib/utils"

export interface FormFieldProps {
  label: string
  children: React.ReactNode
  className?: string
}

const FormField = ({ label, children, className }: FormFieldProps) => {
  return (
    <div className={cn("flex flex-col", className)}>
      <label className="block text-[0.75rem] font-semibold uppercase tracking-[0.25em] text-[rgba(31,27,23,0.7)] mb-2">
        {label}
      </label>
      {children}
    </div>
  )
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-[12px] border border-[rgba(210,106,50,0.25)]",
        "px-5 py-4 text-[0.95rem] font-medium",
        "bg-[rgba(255,255,255,0.9)] text-[rgba(31,27,23,0.9)]",
        "placeholder:text-[rgba(31,27,23,0.5)]",
        "transition-all duration-200 ease-out",
        "focus:outline-none focus:border-[var(--terracotta)]",
        "focus:shadow-[0_0_0_3px_rgba(210,106,50,0.2)]",
        "focus:bg-[rgba(255,255,255,0.95)]",
        className,
      )}
      {...props}
    />
  )
})
Input.displayName = "Input"

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "w-full rounded-[12px] border border-[rgba(210,106,50,0.25)]",
        "px-5 py-4 text-[0.95rem] font-medium",
        "bg-[rgba(255,255,255,0.9)] text-[rgba(31,27,23,0.9)]",
        "placeholder:text-[rgba(31,27,23,0.5)]",
        "transition-all duration-200 ease-out",
        "focus:outline-none focus:border-[var(--terracotta)]",
        "focus:shadow-[0_0_0_3px_rgba(210,106,50,0.2)]",
        "focus:bg-[rgba(255,255,255,0.95)]",
        "resize-none",
        className,
      )}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { FormField, Input, Textarea }
