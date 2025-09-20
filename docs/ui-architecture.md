# United Tattoo — Frontend Architecture Document

Version: 1.0  
Date: 2025-09-17  
Template: .bmad-core/templates/front-end-architecture-tmpl.yaml (frontend-architecture-template-v2)  
Basis: docs/PRD.md, docs/Architecture.md, repo config (Next.js App Router, Tailwind, ShadCN, Lenis, React Query), clinerules

Template and Framework Selection

Starter/Existing Project Decision:
- Existing project using Next.js 14 App Router with ShadCN UI, Tailwind, and OpenNext (Cloudflare).  
- Dependencies of note: next 14.2.16, react 18, @tanstack/react-query, react-hook-form + zod resolver, shadcn primitives (Radix), tailwind v4, lenis (smooth scroll), embla carousel.  
- Folder structure and conventions already aligned to App Router: app/, components/, lib/, hooks/, styles/, public/, sql/.

Change Log

| Date       | Version | Description                              | Author   |
|------------|---------|------------------------------------------|----------|
| 2025-09-17 | 1.0     | Initial frontend architecture document   | Architect |

Frontend Tech Stack

Technology Stack Table (synchronized with Backend Architecture)
| Category           | Technology                     | Version                 | Purpose                                  | Rationale                                                                 |
|--------------------|--------------------------------|-------------------------|------------------------------------------|---------------------------------------------------------------------------|
| Framework          | Next.js (App Router)           | 14.2.16                 | Routing, SSR/ISR, layouts, server comps  | Unified stack, Cloudflare via OpenNext, matches backend architecture      |
| UI Library         | React                          | 18.x                    | Component model                          | Ecosystem, SSR-friendly                                                   |
| Component Library  | ShadCN UI (+ Radix Primitives) | latest (registry-based) | Accessible primitives, consistent UI     | Standardized components, theming, accessibility                           |
| Styling            | Tailwind CSS                   | 4.x                     | Utility-first styling                    | Rapid iteration, design consistency                                       |
| State Management   | React Query (+ Zustand planned)| ^5.89.0 (Query)         | Server state (RQ), local UI state (Z)    | RQ for async/cache; add Zustand for local UI flows where needed           |
| Routing            | Next.js App Router             | 14.2.16                 | File-based routing                       | Built-in layouts, loading/error boundaries                                |
| Forms              | react-hook-form + zod          | ^7.60.0 / ^3.10.0       | Typed form handling + validation         | Lightweight, integrates with zod and ShadCN                               |
| Testing            | Vitest + RTL + JSDOM           | ^3.2.4 / latest         | Unit/component tests                     | Fast TS-native testing                                                    |
| Animation          | tailwindcss-animate + Lenis    | latest                  | Motion primitives & smooth scroll        | Simple, perf-conscious; embla for carousel                                |
| Dev Tools          | ESLint/Prettier + TS + RQ Devtools | latest               | Lint/format/types/diagnostics            | Quality gates + developer experience                                      |

Project Structure

```
app/                         # App Router segments, server components by default
  (marketing)/               # Optional grouping for public pages
  (admin)/                   # Admin area (guarded by middleware)
  api/                       # Route handlers (REST endpoints)
  layout.tsx                 # Root layout (ThemeProvider, font, metadata)
  page.tsx                   # Home
  error.tsx                  # Root error boundary
  loading.tsx                # Root loading state

components/
  ui/                        # ShadCN primitives (registry-managed)
  shared/                    # Reusable presentational components
  composite/                 # Complex composed components (forms, galleries)
  layouts/                   # Layout wrappers (page sections)
  charts/                    # Visualization components if needed

hooks/
  use-mobile.ts              # Existing
  use-toast.ts               # Existing
  use-file-upload.ts         # Existing
  use-query-keys.ts          # Centralized React Query keys
  use-zustand-...ts          # Future local state slices

lib/
  utils.ts                   # cn(), formatting helpers
  api-client.ts              # fetch wrappers, error mapping, tags
  query-client.ts            # React Query client and config (if using RQ Provider)
  validations.ts             # zod schemas (shared)
  types/                     # Shared FE-only types if needed

styles/
  globals.css                # Tailwind base, variables, themes

public/
  ...                        # Static assets

tests/
  components/                # RTL component tests
  e2e/                       # Playwright (planned)

docs/
  ui-architecture.md         # This document
```

Component Standards

Component Template (ShadCN-style, typed, with cn)
```tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-neutral-900 text-white border-transparent",
        outline: "bg-transparent border-neutral-200 text-neutral-900",
        destructive: "bg-red-600 text-white border-transparent",
      },
      size: {
        sm: "text-[10px] px-1.5 py-0.5",
        md: "text-xs px-2 py-1",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, size }), className)} {...props} />
}
```

Naming Conventions
- File names: kebab-case (e.g., booking-form.tsx), directories kebab-case.
- Component names: PascalCase (BookingForm).
- Hooks: use-*.ts, exports useCamelCase.
- Variant utilities via cva(), className merged with cn().
- Group page-level components under components/composite or components/layouts.

State Management

Store Structure (Zustand planned)
```
hooks/
  state/
    ui/
      use-sidebar.ts          # UI toggles
      use-artist-filter.ts    # Local filter state
    booking/
      use-booking-step.ts     # Stepper state (client-only)
```

Zustand Slice Example
```ts
import { create } from "zustand"

interface BookingStepState {
  step: number
  setStep: (n: number) => void
  next: () => void
  prev: () => void
}

export const useBookingStep = create<BookingStepState>((set) => ({
  step: 1,
  setStep: (n) => set({ step: n }),
  next: () => set((s) => ({ step: s.step + 1 })),
  prev: () => set((s) => ({ step: Math.max(1, s.step - 1) })),
}))
```

React Query Patterns
- Use query keys from a central module (hooks/use-query-keys.ts).
- Server components fetch on the server; client components use React Query for hydration and client mutations.
- Mutations return zod-validated payloads; invalidate by tag where feasible.

API Integration

Service Template (fetch wrapper + zod)
```ts
import { z } from "zod"

const Appointment = z.object({
  id: z.string(),
  artistId: z.string(),
  clientId: z.string(),
  title: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  status: z.string(),
})

export type Appointment = z.infer<typeof Appointment>

async function apiFetch<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  })
  if (!res.ok) {
    // Map standard error shape here
    throw new Error(`API ${res.status}`)
  }
  return (await res.json()) as T
}

export const AppointmentsApi = {
  list: async () => {
    const data = await apiFetch<unknown>("/api/appointments")
    return z.array(Appointment).parse(data)
  },
}
```

API Client Config (React Query)
```ts
import { QueryClient } from "@tanstack/react-query"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
    },
    mutations: {
      retry: 0,
    },
  },
})
```

Routing

Route Configuration (App Router patterns)
- Public segments: app/(marketing)/page.tsx, etc.
- Admin segments under app/admin/* (guarded by middleware.ts).
- Provide loading.tsx and error.tsx for key segments.
- Use route groups to separate concerns: (marketing), (catalog), (admin).
- Link client forms to server actions or route handlers as appropriate.

Styling Guidelines

Styling Approach
- Tailwind CSS utilities as primary styling; minimal custom CSS.
- Use cva() for component variants; cn() for class merging.
- Follow ShadCN spacing/typography scales and tokens for consistency.

Global Theme Variables (CSS)
```css
:root {
  --bg: #0a0a0a;
  --fg: #fafafa;
  --muted: #a3a3a3;
  --primary: #111;
  --accent: #b91c1c; /* brand accent */
  --radius: 0.5rem;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0a0a0a;
    --fg: #fafafa;
  }
}

html, body {
  background: var(--bg);
  color: var(--fg);
}
```

Testing Requirements

Component Test Template (Vitest + RTL)
```ts
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Badge } from "@/components/shared/badge"

describe("Badge", () => {
  it("renders with text", () => {
    render(<Badge>New</Badge>)
    expect(screen.getByText("New")).toBeInTheDocument()
  })

  it("applies variant classes", async () => {
    render(<Badge variant="destructive">Danger</Badge>)
    expect(screen.getByText("Danger")).toHaveClass("bg-red-600")
  })
})
```

Testing Best Practices
1. Unit Tests: Test individual components in isolation.  
2. Integration Tests: Compose components and verify interactions.  
3. E2E Tests: Playwright for booking flow, admin CRUD, and uploads (on CF preview).  
4. Coverage: Aim for 80% on component libs; critical flows prioritized.  
5. Test Structure: Arrange-Act-Assert; deterministic tests.  
6. Mock External: Network, router, and provider hooks.

Environment Configuration

Frontend-safe variables (prefix NEXT_PUBLIC_):
- NEXT_PUBLIC_SITE_URL (computed at runtime if not set)
- NEXT_PUBLIC_R2_ASSETS_BASE (if public asset base is needed)
- NEXT_PUBLIC_ANALYTICS_ID (optional)
Guidance:
- Do not expose secrets. Only NEXT_PUBLIC_* keys are readable by the browser.
- Server-only configuration (NEXTAUTH_URL, secrets, Stripe keys, etc.) remains in Wrangler secrets.

Frontend Developer Standards

Critical Coding Rules
- Do not bypass ShadCN patterns; use cva() and cn() for variants/classes.
- Validate all form inputs with zod schemas; surface user-friendly errors.
- Avoid direct window/document access in server components; use “use client” as needed.
- Use React Query for async client-side data; do not roll bespoke caching.
- Keep animations subtle; prefer tailwindcss-animate and Lenis; avoid heavy JS animation libraries unless justified.
- Keep components pure/presentational where possible; contain side effects in hooks.

Quick Reference
- Dev: npm run dev
- Preview (Cloudflare runtime): npm run pages:build && npm run preview
- Build: npm run build
- Test: npm run test / npm run test:ui
- File naming: kebab-case files, PascalCase components
- Import patterns: "@/components/..", "@/lib/..", "@/hooks/.."
- UI composition: Follow ShadCN examples and registry patterns before custom

## Typography Ramp

Authoritative site-wide type scale to enforce consistency across public pages:

- Headings
  - h1: font-playfair text-5xl lg:text-7xl tracking-tight
  - h2: text-4xl md:text-5xl font-semibold
  - h3: text-2xl md:text-3xl font-semibold
- Body
  - Base: text-base leading-relaxed
  - Large: text-xl leading-relaxed (hero/intro copy)
- Muted/Secondary: text-muted-foreground for supporting text and CardContent
- Spacing Patterns:
  - Paragraph stacks: space-y-3
  - Grid gaps: gap-6 (default), escalate by breakpoint as needed (md:gap-8)
  - Section padding: standardized via SectionWrapper (px-8 lg:px-16)

Application
- Apply to: /aftercare, /deposit, /terms, /privacy, /book, /artists (incl. nested)
- Prefer ShadCN token classes over ad-hoc color utilities (e.g., bg-background, text-foreground)
- Decorative icons should omit color overrides and include aria-hidden="true" when appropriate

Audit
- RTL tests should assert:
  - Presence of heading/body classes defined above on representative pages
  - Use of text-muted-foreground for secondary content
  - Standard section paddings via SectionWrapper
