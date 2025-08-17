import type { ToolDoc } from './types';

import { apiOpenapiTools } from './docs/api-openapi-tools';
import { backendSummary } from './docs/backend-summary';
import { codeDocsTools } from './docs/code-docs-tools';
import { databasePrismaTools } from './docs/database-prisma-tools';
import { dockerLocal } from './docs/docker-local';
import { docsTools } from './docs/docs-tools';
import { eslintDoc } from './docs/eslint';
import { frontendSummary } from './docs/frontend-summary';
import { framerMotionOverviewDoc } from './docs/framer-motion-overview';
import { lucideReactOverviewDoc } from './docs/lucide-react-overview';
import { neonDbOverviewDoc } from './docs/neondb-overview';
import { postgresPrismaImplementationDoc } from './docs/postgres-prisma-implementation';
import { postmanDoc } from './docs/postman';
import { prettierDoc } from './docs/prettier';
import { projectStatsToolsDoc } from './docs/project-stats-tools';
import { qualitySecurityToolsDoc } from './docs/quality-security-tools';
import { renderDeploymentOverviewDoc } from './docs/render-deployment-overview';
import { swaggerDoc } from './docs/swagger';
import { tailwindOverviewDoc } from './docs/tailwind-overview';
import { vercelDeploymentOverviewDoc } from './docs/vercel-deployment-overview';

export const TOOL_DOCS: ToolDoc[] = [
  apiOpenapiTools,
  backendSummary,
  codeDocsTools,
  databasePrismaTools,
  dockerLocal,
  docsTools,
  eslintDoc,
  frontendSummary,
  postmanDoc,
  prettierDoc,
  projectStatsToolsDoc,
  qualitySecurityToolsDoc,
  swaggerDoc,
  framerMotionOverviewDoc,
  lucideReactOverviewDoc,
  neonDbOverviewDoc,
  postgresPrismaImplementationDoc,
  renderDeploymentOverviewDoc,
  tailwindOverviewDoc,
  vercelDeploymentOverviewDoc,
];

export function getOrderedToolDocs(): ToolDoc[] {
  return [...TOOL_DOCS].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}
