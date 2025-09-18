# Establish SQL Migrations (Up/Down) and DB Backup — Brownfield Addition (DB-1)

Story ID: DB-1  
Type: Brownfield Story (Single-session)  
Date: 2025-09-18  
Owner: Product Manager (John)  
Related Docs:
- D1 Setup: D1_SETUP.md
- Architecture (Tech): docs/brownfield-architecture-tech.md
- Rollback Strategy: docs/prd/rollback-strategy.md

---

Story Title  
Establish SQL Migrations (Up/Down) and DB Backup — Brownfield Addition

User Story  
As a developer/operator,  
I want a standard migrations structure with up/down scripts and a simple DB backup command,  
So that I can safely evolve the schema and quickly rollback or recover if needed.

Story Context

Existing System Integration
- Integrates with: Cloudflare D1 via wrangler, sql/schema.sql as current schema source of truth, npm scripts for db management.
- Technology: Wrangler CLI, D1 bindings (env.DB), SQL files under repo, Node/npm scripts.
- Follows pattern: Project scripts under package.json, operational notes in D1_SETUP.md and PRD rollback strategy.

Acceptance Criteria

Functional Requirements
1. Create a versioned migrations directory: sql/migrations/  
   - Include initial baseline migration files derived from current sql/schema.sql:
     - sql/migrations/20250918_0001_initial.sql (UP)
     - sql/migrations/20250918_0001_initial_down.sql (DOWN)
   - UP: creates the schema equivalent to current sql/schema.sql.
   - DOWN: drops tables/indexes created by the UP script in safe reverse order.
2. Add npm scripts in package.json:
   - "db:backup": Exports D1 DB to backups/d1-backup-YYYYMMDD-HHMM.sql using wrangler d1 export.
   - "db:migrate:up": Applies a specified migration file to preview or prod (parameterized or documented).
   - "db:migrate:down": Applies the matching down migration file (preview/prod).
   - "db:migrate:latest": Sequentially applies all UP migrations not yet applied (documented approach; simple first version can be manual sequence).
3. Document exact wrangler commands (preview/prod) in D1_SETUP.md and link from docs/prd/rollback-strategy.md.

Integration Requirements
4. Backups directory: backups/ (git-ignored in .gitignore) is used by db:backup; command succeeds locally against the configured DB.  
5. No change to runtime DB access code (lib/db.ts) in this story; focus is structure and scripts only.  
6. Migrations can be dry-run on a preview environment before production execution; commands documented.

Quality Requirements
7. Verify "db:backup" produces a timestamped SQL file under backups/ with expected content.  
8. Verify applying the UP script on an empty DB creates the schema; applying the DOWN script reverts it.  
9. Update D1_SETUP.md with:
   - New migrations folder layout
   - How to run UP/DOWN (preview/prod)
   - How to perform db:backup
10. Update docs/prd/rollback-strategy.md to reference db:backup and migrations rollback steps.

Technical Notes

- Suggested npm scripts (illustrative):
  - "db:backup": "mkdir -p backups && wrangler d1 export united-tattoo > backups/d1-backup-$(date +%Y%m%d-%H%M).sql"
  - "db:migrate:up:preview": "wrangler d1 execute united-tattoo --file=sql/migrations/20250918_0001_initial.sql"
  - "db:migrate:down:preview": "wrangler d1 execute united-tattoo --file=sql/migrations/20250918_0001_initial_down.sql"
  - For production, add --remote or use [env.production] context as required by your wrangler.toml.
- Order and naming convention:
  - YYYYMMDD_NNNN_description.sql to sort deterministically; maintain matching *_down.sql pair.
- Track applied migrations:
  - Minimal approach: maintain a migrations_log table in D1 in a later story; for now, manual sequence is acceptable given small scope.

Definition of Done
- [ ] sql/migrations/ directory exists with 0001 UP/DOWN scripts reflecting current schema.  
- [ ] package.json contains db:backup and migrate script entries (preview/prod documented).  
- [ ] D1_SETUP.md updated with usage instructions and examples.  
- [ ] docs/prd/rollback-strategy.md references backup/migration rollback steps.  
- [ ] Manual verification performed on preview DB: UP then DOWN produce expected effects.

Risk and Compatibility Check

Minimal Risk Assessment
- Primary Risk: DOWN script may drop unintended objects if baseline diverges.  
- Mitigation: Generate initial UP/DOWN from current schema.sql and verify on preview DB first.  
- Rollback: Use db:backup prior to running UP; restore from backup if needed.

Compatibility Verification
- [x] No breaking runtime change (database structure only when migrations applied).  
- [x] No app code dependency in this story.  
- [x] Performance impact: none at runtime.

Validation Checklist

Scope Validation
- [x] Single-session implementable (create scripts, wire npm commands, update docs).  
- [x] Straightforward integration (wrangler, SQL files).  
- [x] Follows existing project scripting conventions.  
- [x] No new design/architecture required.

Clarity Check
- [x] Requirements and commands are explicit.  
- [x] Integration points documented (D1_SETUP.md, rollback strategy).  
- [x] Success criteria testable (UP/DOWN on preview, backup file exists).  
- [x] Rollback approach simple (restore backup or apply DOWN).

References
- D1 Wrangler Docs, Project D1_SETUP.md, Rollback Strategy PRD shard
