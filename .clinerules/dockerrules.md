# Docker & Deployment
- Multi‑stage builds; `next build` with `output: standalone`
- Non‑root user; healthcheck endpoint (`/health`)
- Volumes for persistence (DB/cache)
- Pin base images to minor; scan for vulns
- Node vs Edge runtime documented per route; default Node