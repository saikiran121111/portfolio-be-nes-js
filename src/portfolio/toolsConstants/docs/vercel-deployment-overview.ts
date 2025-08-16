import { ToolDoc, strip } from '../types';

export const vercelDeploymentOverviewDoc: ToolDoc = {
  key: 'vercel',
  title: 'Vercel – Deployment Overview (Frontend)',
  icon: 'Triangle',
  summary: 'Next.js on Vercel: envs, caching, and troubleshooting.',
  content: strip(`
Vercel – Deployment Overview for portfolio-frontend

Project type
- Framework: Next.js 15 (App Router), React 19, Tailwind CSS 4.
- Build: next build (default), Start: next start (handled by Vercel runtime).
- Output: .next (Vercel detects automatically via Next.js preset).

Current deployment model (from code)
- Homepage (/) is a server component page but static-friendly; no blocking server data.
- Profile page (/profile) renders a client component (ProfileViewClient) that fetches data in the browser from an external API (no Next.js server function required).
- Tools page (/tools) is static-friendly.
- Result: Vercel primarily serves static assets and edge-cached pages; profile data is fetched client-side at runtime.

Environment variables (Vercel Project Settings → Environment Variables)
- NEXT_PUBLIC_API_DOMAIN: base URL for API requests (public; exposed to the browser).
  • Production: set to your production API domain (e.g., https://api.example.com).
  • Preview: set to your staging API domain if available; otherwise the same as production.
  • Development: matches your local .env.local.
- Note: Do not place secrets in NEXT_PUBLIC_* variables; they are accessible to the client.

Vercel project settings
- Framework Preset: Next.js.
- Install command: auto (uses detected package manager); or specify npm ci / pnpm i / yarn install.
- Build command: next build (default).
- Output directory: .next (default; do not change for Next.js 13+ App Router).
- Production Branch: recommend master (matches remote HEAD). Previews for all other branches/PRs.

Git integration and deploy flow (matches repo history)
- Branching: feature → develop → production → master (final).
- Vercel mapping:
  • Production deployment from master branch.
  • Preview deployments for develop, production, and feature branches (PRs) with unique preview URLs.
- Optional: Use Deploy Hooks to trigger builds from external systems.

Routing and runtime
- App Router (src/app). No custom vercel.json required.
- No API routes used; data comes from external domain defined by NEXT_PUBLIC_API_DOMAIN.
- Runtime: default Node.js for Next server; pages are mostly static and served at the edge by Vercel CDN.

Images and static assets
- Uses local images/svgs (public/* and imported PNG for ToolsLink); no remote images configuration needed.
- If adding remote images later, configure images.remotePatterns in next.config.ts for next/image.

Caching and revalidation
- Client fetch in ProfileView uses cache: "no-store" → always fresh from the API (no SWR/ISR layer in Next).
- Static assets and built pages are CDN-cached by Vercel; client data fetching bypasses Next’s data cache.
- If moving data fetching to the server, consider fetch caching (revalidate: <seconds>) or Route Handlers for ISR.

Domains and environments
- Attach a custom domain to the Vercel project for Production.
- Previews receive preview domain URLs automatically.
- Ensure CORS on your API backend allows requests from the Vercel domains (production and preview).

Observability and performance (optional)
- Enable Vercel Analytics and Speed Insights for performance monitoring.
- Use Edge Config or Environment Variables for feature flags (no secrets on client-side flags).

Vercel CLI (optional workflow)
- Install globally and link project: npm i -g vercel; vercel; vercel --prod for production deploys.
- CLI respects your Vercel project and team configuration after login/link.

Troubleshooting
- 404/Network errors on profile data: verify NEXT_PUBLIC_API_DOMAIN in Vercel envs and API CORS settings.
- Build failures: ensure lockfile and Node version (Vercel auto-detects). If needed, set Node version via .nvmrc or Vercel Project Settings.
- Missing styles: ensure Tailwind content globs cover ./src/**/* and that @tailwind directives are present in globals.css.
`),
  order: 29,
};
