import { ToolDoc, strip } from '../types';

export const renderDeploymentOverviewDoc: ToolDoc = {
  key: 'render',
  title: 'Render – Deployment Overview (Backend)',
  icon: 'CloudCog',
  summary: 'Render web service settings, env vars, and build/start commands.',
  content: strip(`
Render – Deployment Overview for portfolio-backend (NestJS)

Service type
- Render Web Service (Node.js)
- Region: choose closest to your users or to NeonDB region

App specifics (from code)
- Framework: NestJS 11 (Express)
- Start binds 0.0.0.0 and uses PORT env (defaults 3002); Render provides PORT automatically
- Swagger UI: /swagger, OpenAPI JSON: /swagger-json
- Health endpoint: GET /health
- CORS is enabled; you should restrict origins to your Vercel domains

Environment variables (Render → Environment)
- PORT: provided by Render (no need to set)
- NODE_ENV: production
- DATABASE_URL: Neon connection string (pooled), e.g.
  postgresql://<user>:<password>@ep-xxxxx-pooler.neon.tech/<db>?sslmode=require&pgbouncer=true
- Optional: APP_VERSION (for health), CORS_ORIGINS (comma-separated) if you later customize CORS

Build & start commands (Render Settings)
- Build Command (recommended): npm run build:deploy
  • Uses: npm install && npx prisma generate && nest build && npx prisma migrate deploy
- Start Command: npm run start:prod
  • Runs: node dist/src/main.js

Prisma migrations on deploy
- build:deploy already runs \`prisma migrate deploy\` against DATABASE_URL
- Ensure Neon database has correct permissions for the role in DATABASE_URL

Autoscaling and instance type
- Instance type: start small (Starter) and scale per CPU/memory needs
- Autoscaling: enable if traffic fluctuates; ensure DB pool can handle concurrent connections

Health checks
- Configure health check path: /health
- Graceful start/stop: Nest starts quickly; leave default timeouts unless using heavy cold starts

CORS for Vercel
- Allow origins like https://yourdomain.com and https://*.vercel.app
- If you add a CORS origin list, ensure both production and preview Vercel URLs are included

Logs and monitoring
- Use Render Logs for runtime visibility
- Consider shipping logs to a provider if needed

CI/CD and deploys
- Connect GitHub repo; auto-deploy on commit to the chosen branch (e.g., master/main)
- For environment-specific DATABASE_URL, use separate Render services or manual toggles

Troubleshooting
- App fails to bind: ensure it listens on 0.0.0.0 and uses PORT (it does)
- DB connection errors on Neon: verify sslmode=require and pgbouncer=true when using the pooler host
- 404 for swagger-json: confirm /swagger-json path and that the service is healthy
`),
  order: 27,
};
