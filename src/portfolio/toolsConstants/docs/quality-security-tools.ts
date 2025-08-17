import { ToolDoc, strip } from '../types';

export const qualitySecurityToolsDoc: ToolDoc = {
  key: 'quality-security-tools',
  title: 'Quality and Security Tools',
  icon: 'Shield',
  summary: 'ESLint, npm audit, and dependency license reports.',
  content: strip(`
Quality and Security Tools – Portfolio Backend

Prerequisites
- Create output folder if needed:
  if (!(Test-Path .\\docs)) { New-Item -ItemType Directory -Path .\\docs | Out-Null }

1) ESLint (Text report)
Purpose: Lint code and output a readable report.
Run:
- npx eslint . -f stylish | Tee-Object -FilePath .\\docs\\eslint.txt
Notes: Uses your eslint.config.mjs.

2) npm audit (JSON)
Purpose: Report known vulnerabilities in dependencies.
Run:
- npm audit --json | Out-File -Encoding utf8 .\\docs\\npm-audit.json
Notes: Use --audit-level=moderate to focus on higher severity.

3) License Checker (JSON)
Purpose: Export licenses for production dependencies.
Run:
- npx license-checker --production --json | Out-File -Encoding utf8 .\\docs\\licenses.json
Notes: Add --excludePrivatePackages if needed.
`),
  order: 21,
};
