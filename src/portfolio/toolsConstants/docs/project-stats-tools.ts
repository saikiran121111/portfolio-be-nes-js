import { ToolDoc, strip } from '../types';

export const projectStatsToolsDoc: ToolDoc = {
  key: 'project-stats',
  title: 'Project Stats Tools',
  icon: 'BarChart3',
  summary: 'cloc for LOC and Jest coverage reports.',
  content: strip(`
Project Stats Tools – Portfolio Backend

Prerequisites
- Create output folder if needed:
  if (!(Test-Path .\\docs)) { New-Item -ItemType Directory -Path .\\docs | Out-Null }

1) cloc – Lines of Code (Markdown)
Purpose: Count lines of code by language and output Markdown.
Run:
- npx cloc . --md | Out-File -Encoding utf8 .\\docs\\loc.md
Notes: Add --exclude-dir=node_modules,dist to speed up.

2) Jest Coverage (Text)
Purpose: Save the summary from test coverage run.
Run:
- npm run test:cov | Tee-Object -FilePath .\\docs\\coverage-summary.txt
Notes: Ensure tests pass for meaningful coverage.
`),
  order: 20,
};
