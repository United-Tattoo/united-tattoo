# Data, MCP, Codegen, Migrations, File Uploads

## MCP Requirements
- All DB access (dev/prod/migrations/scripts) via **Cloudflare MCP**
- Context7 MCP required for: new deps, framework upgrades, DS changes
- Cache/pin Context7 outputs; PRs require justification to override

## Data Layer & Codegen (choose one)
- **Prisma**: schema as SSoT; generated client/types committed
- **or Kysely**: typed SQL builder; generate DB types; commit outputs
- PRs fail on type/codegen drift

## Migrations
- Source of truth in `sql/`
- Executed via MCP; CI does migration dry‑run on ephemeral DB

## File Uploads
- S3‑compatible storage with signed URLs (no direct multipart to app)
- MCP writes file metadata (size/mime/checksum) to DB
- Resumable uploads (TUS) allowed when needed