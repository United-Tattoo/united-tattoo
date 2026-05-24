# SEO Strategy

This document explains how United Tattoo's website is structured for search visibility, local discovery, and AI/LLM citation surfaces.

The goal is practical: help people near Fountain, Colorado Springs, Fort Carson, and nearby areas find the right artist and submit a booking request.

## Primary Outcomes

The site should support three search outcomes:

1. People searching for a tattoo studio near Colorado Springs or Fountain should find United Tattoo.
2. People searching by style, artist fit, or tattoo planning question should land on useful content.
3. People who find the site should have a clear path to `/booking`.

Do not optimize pages only for traffic. A page is successful when it helps the visitor choose an artist, understand the process, or request a consult.

## Core Search Targets

Use natural language around these themes throughout content and metadata:

- United Tattoo
- tattoo studio in Fountain, Colorado
- tattoo shop near Colorado Springs
- tattoo artists near Colorado Springs
- Fountain CO tattoo shop
- Fort Carson tattoo shop
- book a tattoo appointment online
- tattoo consultation
- custom tattoo artists
- fine line tattoos
- black and grey tattoos
- American traditional tattoos
- tattoo cover-ups
- first tattoo preparation
- tattoo aftercare

Avoid keyword stuffing. Use these phrases where they fit the user's actual question.

## Technical Foundations

The SEO foundation is handled in `src/layouts/SiteLayout.astro` and `src/components/Schema.astro`.

Every page should have:

- A unique `<title>`.
- A useful meta description.
- A self-referencing canonical URL.
- Open Graph and Twitter image metadata.
- Schema.org JSON-LD when the page has a clear entity type.

The site currently emits:

- `TattooShop` schema for United Tattoo on all pages.
- `Person` schema on artist profile pages.
- `BlogPosting` schema on article pages.
- `BreadcrumbList` schema when breadcrumbs are provided.

When adding new page types, keep schema close to the real page purpose. Do not add schema types that are not represented by visible page content.

## Local SEO

Local SEO depends on consistent studio identity across the site and third-party profiles.

The canonical business details live in `src/data/site-settings.json` and are exported through `src/consts.ts`:

- Name: `United Tattoo`
- Address: `5160 Fontaine Blvd, Fountain, CO 80817`
- Phone: `+1 719 698 9004`
- Email: `ink@unitedtattoos.com`
- Website: `https://united-tattoos.com`
- Map URL: Google Maps directions URL

Keep these values consistent anywhere the business appears. If a phone number, email, or domain changes, update Site Settings in Decap or edit `src/data/site-settings.json` first, then search for hard-coded older values.

### Third-Party Profiles

Important profile URLs are also centralized in Site Settings:

- Instagram
- YouTube
- Yelp
- InkRoster

These links are used in:

- Local business `sameAs` schema.
- Footer/social surfaces.
- Generated `llms.txt` and `llms-full.txt`.

When adding another official profile, add it to Site Settings/`src/consts.ts`, include it in `sameAs` if it represents the business, and add a visible link only if it helps users.

## Content Strategy

The blog exists to answer real client questions before booking.

Good topics include:

- How to choose an artist.
- How to prepare for an appointment.
- What to include in a booking request.
- Style guides for fine line, traditional, realism, botanical, patchwork, cover-ups, and first tattoos.
- Local planning topics for Fountain, Colorado Springs, and Fort Carson clients.

Each article should:

- Answer one clear question.
- Link naturally to `/artists` and `/booking`.
- Link to relevant artist profile pages when style fit is discussed.
- Use descriptive headings that match how clients ask questions.
- Avoid unsupported claims like "best tattoo shop" or "number one studio."

Prefer grounded language:

- "tattoo shop near Colorado Springs"
- "tattoo studio in Fountain"
- "request a consult"
- "browse artist portfolios"

Avoid vague marketing language:

- "world-class experience"
- "premium solutions"
- "unmatched quality"
- "best in the area"

## Internal Linking

Internal links should help both visitors and crawlers understand the site structure.

Use these patterns:

- Blog posts about style fit should link to relevant artist profiles.
- Artist profile pages should link to `/booking`.
- Booking-oriented posts should link to `/booking` and `/artists`.
- General planning posts should link to deeper related posts when available.
- The homepage should link to artists, booking, journal, and key conversion sections.

Do not add links just to increase link count. Every link should answer a likely next question.

## External Links

External links can support entity trust and topical context, but they should be used carefully.

Use external links when they are:

- Official United Tattoo profiles.
- Third-party studio profiles.
- Articles that mention United Tattoo.
- Relevant tattoo culture or planning resources that fit the article topic.

Current external SEO references:

- YouTube: official United Tattoo channel.
- Yelp: United Tattoo business profile.
- InkRoster: United Tattoo studio profile.
- NewsInsiderPost article about United Tattoo and Colorado Springs.
- JournalPostToday tattoo conventions article.

External links should be contextual, not dumped into unrelated pages. For example, the Colorado Springs article fits the online booking guide, while the tattoo conventions article fits a trends/culture post.

## AI and LLM Surfaces

The site includes generated AI-discovery files:

- `/llms.txt`
- `/llms-full.txt`

Source files:

- `src/pages/llms.txt.ts`
- `src/pages/llms-full.txt.ts`

These files summarize the studio, artists, blog posts, booking flow, contact details, and important external profiles. They are generated during build and should not be edited in `dist/`.

When adding important public profiles, major services, or authoritative articles, update the source files so AI tools can discover the same entity context as search engines.

## Image SEO

The site uses a lot of portfolio imagery, so image hygiene matters.

Follow these rules:

- Prefer AVIF for new site assets when practical.
- Use descriptive `alt` text for content images.
- Keep decorative images empty-alt (`alt=""`) when they do not add meaning.
- Avoid using massive unoptimized source files in public routes.
- Preserve artist/gallery folder conventions under `public/artists/`.

For portfolio-heavy pages, visible performance matters for SEO. Large image changes should be checked with `pnpm build` and a browser pass.

## Page Metadata Rules

For new pages and posts:

- Keep titles specific and readable.
- Put the primary topic near the front of the title.
- Keep descriptions useful in search results, not decorative.
- Include local modifiers only when relevant.
- Make sure the content actually satisfies the title.

Example:

```yaml
title: "How to Book a Tattoo Appointment Online Near Colorado Springs"
description: "A simple walkthrough for using United Tattoo's online booking form, choosing an artist, sending references, and starting a tattoo request without overthinking it."
```

## Maintenance Checklist

Run this checklist before publishing SEO-related changes:

1. Confirm new links use constants if they are studio-wide identity links.
2. Confirm external links are contextual and useful.
3. Confirm article frontmatter validates.
4. Confirm `/booking` remains the main conversion destination.
5. Run `pnpm exec tsc --noEmit --pretty false`.
6. Run `pnpm build`.
7. Run `pnpm lint` and review new warnings.

When changing schema, inspect rendered JSON-LD in a browser or production preview. Do not assume schema is correct from source code alone.

## What Not To Do

Do not:

- Make unverifiable superiority claims.
- Create thin location pages with duplicate content.
- Hide keyword text in layout-only elements.
- Add unrelated outbound links for backlink trading.
- Edit generated files under `dist/`.
- Add schema that contradicts visible content.

The strategy is to make the site genuinely useful, locally specific, technically clear, and easy to book from.
