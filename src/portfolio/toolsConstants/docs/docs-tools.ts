import { ToolDoc, strip } from '../types';

export const docsTools: ToolDoc = {
  key: 'docs',
  title: 'Documentation and Reporting Tools',
  icon: 'FileText',
  summary: 'One-stop list of commands to generate docs and reports.',
  content: strip(`
Documentation and Reporting Tools – Portfolio Backend

Overview
This file lists optional tools you can use to generate documentation and text/JSON summaries from your API, code, and database. All commands assume PowerShell on Windows and will write outputs to the docs/ folder.

Prerequisite
- Ensure the app is running if a tool consumes the live OpenAPI JSON at http://localhost:3002/swagger-json.
- Create output folder when needed: if (!(Test-Path .\\docs)) { New-Item -ItemType Directory -Path .\\docs | Out-Null }

1) Spectral – OpenAPI Lint
Purpose: Lints OpenAPI documents for best practices and quality.
Run (PowerShell):
- npx @stoplight/spectral lint .\\docs\\swagger.json | Tee-Object -FilePath .\\docs\\openapi-spectral.txt
Notes:
- You can add a .spectral.yaml to customize rules.

2) Redocly CLI – Bundle, Lint, Diff
Purpose: Validates and bundles OpenAPI; compares two specs.
Run:
- Bundle: npx @redocly/cli bundle .\\docs\\swagger.json -o .\\docs\\openapi.bundle.json
- Lint: npx @redocly/cli lint .\\docs\\swagger.json | Tee-Object -FilePath .\\docs\\openapi-redocly-lint.txt
- Diff: npx @redocly/cli diff .\\docs\\openapi.old.json .\\docs\\openapi.new.json | Tee-Object -FilePath .\\docs\\openapi-diff.txt
Notes:
- Bundle produces a single self-contained JSON useful for clients/publishing.

3) OpenAPI → Postman Collection
Purpose: Generate a Postman collection from OpenAPI.
Run:
- npx openapi-to-postmanv2 -s .\\docs\\swagger.json -o .\\docs\\postman.collection.json
Notes:
- Import the generated collection into Postman.

4) Compodoc – Nest/Angular Style Docs (HTML)
Purpose: Generates HTML documentation of your TS/Nest code.
Run:
- npx @compodoc/compodoc -p tsconfig.json -d docs/compodoc
Notes:
- Open docs/compodoc/index.html in a browser.

5) TypeDoc (Markdown)
Purpose: Generate Markdown docs from TypeScript types and comments.
Install (once):
- npm i -D typedoc typedoc-plugin-markdown
Run:
- npx typedoc --plugin typedoc-plugin-markdown --out docs/typedoc src
Notes:
- Customize via a typedoc.json if needed.

6) Dependency Cruiser – Dependency Report
Purpose: Text report and validation of module dependencies.
Run:
- npx dependency-cruiser -f text src | Out-File -Encoding utf8 .\\docs\\deps.txt
Notes:
- You can add a .dependency-cruiser.js to define rules (e.g., ban circular deps).

7) Madge – Circular Dependencies
Purpose: Detects circular dependencies and can render graphs.
Run:
- npx madge --circular src | Out-File -Encoding utf8 .\\docs\\circular-deps.txt
Notes:
- For a graph: npx madge --image .\\docs\\deps-graph.svg src (requires Graphviz installed).

8) Prisma ERD – Entity Relationship Diagram
Purpose: Creates an ER diagram from prisma/schema.prisma.
Install (once):
- npm i -D prisma-erd-generator
Configure schema.prisma (generator block):
- generator erd { provider = "prisma-erd-generator" output = "./../docs/prisma-erd.svg" }
Generate:
- npx prisma generate
Notes:
- Output path is relative to the prisma/ folder; adjust as needed.

9) prisma-docs-generator – Prisma Model Docs
Purpose: Markdown/HTML docs for Prisma schema.
Install (once):
- npm i -D prisma-docs-generator @prisma/client
Configure schema.prisma (generator block):
- generator docs { provider = "prisma-docs-generator" output = "./../docs/prisma-docs" }
Generate:
- npx prisma generate
Notes:
- Produces Markdown/HTML files under docs/prisma-docs.

10) Prisma Migrate Status – Migration Summary
Purpose: Summarize the state of migrations.
Run:
- npx prisma migrate status | Tee-Object -FilePath .\\docs\\prisma-migrate-status.txt
Notes:
- Requires DATABASE_URL to be set.

11) ESLint – Text Report
Purpose: Lint code and save a readable report.
Run:
- npx eslint . -f stylish | Tee-Object -FilePath .\\docs\\eslint.txt
Notes:
- Uses your eslint.config.mjs configuration.

12) npm audit – Vulnerabilities
Purpose: Security report of installed packages.
Run:
- npm audit --json | Out-File -Encoding utf8 .\\docs\\npm-audit.json
Notes:
- Internet access required; use --audit-level=moderate to focus on higher severity.

13) License Checker – Dependency Licenses
Purpose: Export licenses for all dependencies.
Run:
- npx license-checker --production --json | Out-File -Encoding utf8 .\\docs\\licenses.json
Notes:
- Use --excludePrivatePackages if needed.

14) cloc – Lines of Code (Markdown)
Purpose: Count LOC by language and output Markdown.
Run:
- npx cloc . --md | Out-File -Encoding utf8 .\\docs\\loc.md
Notes:
- Add --exclude-dir=node_modules,dist to speed up.

15) Jest – Coverage Summary (Text)
Purpose: Save coverage summary from tests.
Run:
- npm run test:cov | Tee-Object -FilePath .\\docs\\coverage-summary.txt
Notes:
- Ensure tests are green for meaningful coverage.

Suggested npm scripts (optional)
- docs:swagger → fetch swagger.json (see Swagger summary file)
- docs:spectral → spectral lint docs/swagger.json
- docs:redocly:bundle → bundle OpenAPI
- docs:redocly:lint → lint OpenAPI
- docs:redocly:diff → diff two OpenAPI files
- docs:postman → openapi-to-postmanv2
- docs:compodoc → compodoc HTML docs
- docs:typedoc → typedoc markdown
- docs:deps → dependency-cruiser text
- docs:circles → madge circular deps
- docs:prisma:erd → prisma generate (with ERD generator)
- docs:prisma:docs → prisma generate (with docs generator)
- docs:prisma:status → prisma migrate status
- docs:eslint → eslint text report
- docs:audit → npm audit json
- docs:licenses → license-checker
- docs:cloc → cloc markdown
- docs:coverage → jest coverage summary

Troubleshooting
- If commands fail with npx not found, ensure Node.js/NPM are installed and on PATH.
- Some tools may prompt to install; confirm when asked.
- For ERD graph images, Graphviz may be required for certain modes; the prisma-erd-generator default output does not need it.
`),
  order: 15,
};
