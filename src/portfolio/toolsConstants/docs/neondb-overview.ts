import { ToolDoc, strip } from '../types';

export const neonDbOverviewDoc: ToolDoc = {
  key: 'neondb',
  title: 'NeonDB – Overview and Setup',
  icon: 'Cloud',
  summary: 'Serverless Postgres with pooled connection and Prisma tips.',
  content: strip(`
NeonDB – Overview and Setup for Portfolio Backend

What is Neon
- Serverless Postgres with autoscaling and a connection pooler endpoint
- Free tier suitable for small projects; supports branching and storage autoscaling

Recommended connection (for Render)
- Use the pooled endpoint (…-pooler.neon.tech) to limit connections:
  postgresql://<user>:<pw>@ep-xxxxx-pooler.neon.tech/<db>?sslmode=require&pgbouncer=true

Environment variable
- DATABASE_URL in Render (production) and locally in env/local/.env.prisma
- Example:
  DATABASE_URL="postgresql://<user>:<pw>@ep-abc123-pooler.neon.tech/<db>?sslmode=require&pgbouncer=true"

TLS/SSL
- Neon requires SSL (sslmode=require). Keep it in the URL.

Prisma with Neon
- Prisma 6 works with Neon; prefer the pooler endpoint to stay within connection limits
- For many short-lived connections, consider Prisma Data Proxy (optional) or enabling extended timeouts on Neon

Migrations and seeding
- Deploy: prisma migrate deploy (already in build:deploy script)
- Seed: run a one-off script against the same DATABASE_URL
  Example (PowerShell):
  - dotenv -e env/prod/.env.prisma -- node prisma/seed.ts

Performance tips
- Keep pool size modest; Node client default is fine via Prisma
- Use connection pooler host to share few DB connections across many app instances

Branching (optional)
- Neon supports branching DBs for staging/preview; set a separate DATABASE_URL per environment

Monitoring
- Use Neon dashboard for connection metrics, logs, and CPU/storage usage

Troubleshooting
- Too many connections: confirm you use the pooler endpoint and pgbouncer=true
- SSL errors: ensure sslmode=require is present
- Slow cold queries: initial cold start may incur latency; warm up with a simple SELECT 1 at app start (HealthService already does $queryRaw)
`),
  order: 25,
};
