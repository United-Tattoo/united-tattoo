# YOUR TASK

- Restyle the website following the design.json
- Preserve the existing layout and UI flow.
- Keep existing animations, parallax effects and smooth scrolling effects.
- Elevate the existing site by modifying the styles and components according to the design system and design.json
- Remove current Hero image and replace with @UP1_00011_.png
- Update the color palette and core components.
- Polish the UI following the design.json

## Resources

Provided and ready for implementation on the live site are a variety of new images in design-language/

There are also three comprehensive design guides that embody the ideals of the new United Tattoo branding for 2026:
@design.json @DESIGN_SYSTEM_SUMMARY.md

@index.html contains an example page (not to be copied) that embodies the style we're going for.

- `design.json`, which outlines our design guidelines in a technical, structured format.
- There is also a design system summary document, which outlines our tone and reinforces the overall design language.
- @CLAUDE.md contains useful development information which will be useful to you as you work.

## Guidelines and Workflow

- You must thoroughly lint and evaluate the code you write as you write it.
- Use the tools at your disposal: Search the web, utilize context7, and use shadcn for components where applicable.
- USE THE BROWSER, you have access to a web browser where you can thoroughly examine the site and test user flows. ALWAYS REFERENCE THE BROWSER VISUALLY TO EVALUATE YOUR PROGRESS.

## Framework and Libraries

**Libraries** *to be applied where applicable*
- Shadcn
- Framer-Motion
- Lenis (smooth scrolling)

**Stack:**
- Next.js 14 (App Router) with TypeScript
- Cloudflare D1 (SQLite) for database
- Cloudflare R2 for file storage
- NextAuth.js for authentication
- Deployed via OpenNext on Cloudflare Workers
- ShadCN UI components + Tailwind CSS
- Vitest for testing
