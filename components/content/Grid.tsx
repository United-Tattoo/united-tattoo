import { cn } from "@/lib/utils"

export interface GridProps {
  /** Number of columns */
  columns?: 1 | 2 | 3 | 4
  /** Gap between items */
  gap?: "sm" | "md" | "lg"
  /** Grid children */
  children: React.ReactNode
  /** Additional CSS classes */
  className?: string
}

const columnStyles = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
}

const gapStyles = {
  sm: "gap-4",
  md: "gap-6",
  lg: "gap-8",
}

/**
 * Responsive grid layout for content pages
 *
 * @example
 * ```tsx
 * <Grid columns={3} gap="md">
 *   <Card title="Item 1" />
 *   <Card title="Item 2" />
 *   <Card title="Item 3" />
 * </Grid>
 * ```
 */
export function Grid({
  columns = 3,
  gap = "md",
  children,
  className,
}: GridProps) {
  return (
    <div
      className={cn(
        "grid",
        columnStyles[columns],
        gapStyles[gap],
        className
      )}
    >
      {children}
    </div>
  )
}

