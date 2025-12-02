# Content Component Library

Pre-built, reusable components for creating marketing and content pages. All components follow the United Tattoo 2026 Design System.

## Quick Start

```tsx
import { Hero, Section, Grid, ContentCard, CallToAction } from '@/components/content'

export default function ServicesPage() {
  return (
    <>
      <Hero
        title="Our Services"
        subtitle="Professional tattoo artistry"
        backgroundImage="/images/hero.jpg"
        cta={{ text: "Book Now", href: "/book" }}
      />

      <Section title="What We Offer">
        <Grid columns={3}>
          <ContentCard
            title="Custom Tattoos"
            description="Work with our artists"
            image="/images/custom.jpg"
            href="/book"
          />
        </Grid>
      </Section>

      <CallToAction
        title="Ready to get inked?"
        primaryAction={{ text: "Book Now", href: "/book" }}
        variant="gradient"
      />
    </>
  )
}
```

## Components

### Hero

Full-width hero section for page headers with optional CTA buttons.

```tsx
<Hero
  title="Welcome to United Tattoo"
  subtitle="Professional tattoo artistry in Fountain, CO"
  backgroundImage="/images/hero.jpg"
  overlayOpacity={50}
  size="lg" // sm | md | lg | full
  align="center" // left | center | right
  cta={{ text: "Book Now", href: "/book", variant: "primary" }}
  secondaryCta={{ text: "View Artists", href: "/artists" }}
/>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | required | Main heading |
| `subtitle` | `string` | - | Optional subtitle |
| `backgroundImage` | `string` | - | Background image URL |
| `cta` | `{ text, href, variant? }` | - | Primary CTA button |
| `secondaryCta` | `{ text, href }` | - | Secondary CTA button |
| `size` | `sm \| md \| lg \| full` | `md` | Height variant |
| `overlayOpacity` | `number` | `50` | Dark overlay opacity (0-100) |
| `align` | `left \| center \| right` | `center` | Text alignment |

### Section

Reusable section wrapper with optional title and subtitle.

```tsx
<Section
  title="Our Services"
  subtitle="What we offer"
  variant="muted" // default | muted | accent
  size="lg" // sm | md | lg | xl
  id="services"
>
  {/* Content */}
</Section>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | Section title |
| `subtitle` | `string` | - | Section subtitle |
| `variant` | `default \| muted \| accent` | `default` | Background variant |
| `size` | `sm \| md \| lg \| xl` | `md` | Padding size |
| `id` | `string` | - | ID for anchor links |

### Grid

Responsive grid layout for content items.

```tsx
<Grid columns={3} gap="md">
  <ContentCard title="Item 1" />
  <ContentCard title="Item 2" />
  <ContentCard title="Item 3" />
</Grid>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `1 \| 2 \| 3 \| 4` | `3` | Number of columns |
| `gap` | `sm \| md \| lg` | `md` | Gap between items |

### ContentCard

Versatile card component for displaying content.

```tsx
<ContentCard
  title="Custom Tattoos"
  description="Work with our artists to create your dream piece"
  image="/images/custom.jpg"
  href="/book"
  variant="elevated" // default | elevated | outlined | ghost
  aspectRatio="video" // square | video | portrait | auto
/>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | required | Card title |
| `description` | `string` | - | Description text |
| `image` | `string` | - | Image URL |
| `imageAlt` | `string` | - | Image alt text (defaults to title) |
| `href` | `string` | - | Link URL (makes card clickable) |
| `icon` | `ReactNode` | - | Icon component (replaces image) |
| `variant` | `default \| elevated \| outlined \| ghost` | `default` | Card style |
| `aspectRatio` | `square \| video \| portrait \| auto` | `video` | Image aspect ratio |

### CallToAction

CTA section for prompting user action.

```tsx
<CallToAction
  title="Ready to get inked?"
  description="Book your consultation today"
  primaryAction={{ text: "Book Now", href: "/book" }}
  secondaryAction={{ text: "View Artists", href: "/artists" }}
  variant="gradient" // default | dark | accent | gradient
  align="center" // left | center
/>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | required | Main heading |
| `description` | `string` | - | Description text |
| `primaryAction` | `{ text, href }` | required | Primary button |
| `secondaryAction` | `{ text, href }` | - | Secondary button |
| `variant` | `default \| dark \| accent \| gradient` | `default` | Color variant |
| `align` | `left \| center` | `center` | Text alignment |

## Design Tokens

All components use the United Tattoo design system:

### Typography
- **Headings:** `font-playfair` (Playfair Display)
- **Body:** `font-grotesk` (Space Grotesk)

### Colors
- **Primary:** `burnt` (#b0471e), `terracotta` (#D87850)
- **Neutrals:** `ink` (#241b16), `charcoal` (#1c1915), `cream` (#fff7ec), `sand` (#f2e3d0)
- **Accent:** `sage` (#a28f79), `moss` (#6f5c49)

### Shadows
- `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl`
- `shadow-button-primary`, `shadow-button-secondary`

### Border Radius
- `rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-3xl`

## Best Practices

1. **Use server components by default** - All content components are server components
2. **Combine with Navigation and Footer** - Import from `@/components/navigation` and `@/components/footer`
3. **Add metadata** - Use `generateMetadata` from `@/lib/metadata` for SEO
4. **Add caching** - Use `export const revalidate = 86400` for static pages
5. **Use loading states** - Add `loading.tsx` for pages with data fetching

## VSCode Snippets

Type these prefixes in `.tsx` files:
- `ut-content-page` - Full content page template
- `ut-page` - Basic page with metadata

