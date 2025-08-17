import { ToolDoc, strip } from '../types';

export const apiOpenapiTools: ToolDoc = {
  key: 'openapi',
  title: 'API / OpenAPI Tools',
  icon: 'FileCode',
  summary: 'Export, lint, diff and generate Postman collections from OpenAPI.',
  content: strip(`
Prerequisites
- App running and OpenAPI JSON available at http://localhost:3002/swagger-json
- Create output folder if needed:
  if (!(Test-Path .\\docs)) { New-Item -ItemType Directory -Path .\\docs | Out-Null }

Export OpenAPI JSON (from running app)
- Invoke-WebRequest http://localhost:3002/swagger-json -OutFile .\\docs\\swagger.json

1) Spectral – OpenAPI Lint
Purpose: Validate the spec against best practices.
Run:
- npx @stoplight/spectral lint .\\docs\\swagger.json | Tee-Object -FilePath .\\docs\\openapi-spectral.txt
Notes: Add a .spectral.yaml to customize rules.

2) Redocly CLI – Bundle & Lint
Purpose: Produce a single-file spec and lint quality.
Run:
- Bundle: npx @redocly/cli bundle .\\docs\\swagger.json -o .\\docs\\openapi.bundle.json
- Lint: npx @redocly/cli lint .\\docs\\swagger.json | Tee-Object -FilePath .\\docs\\openapi-redocly-lint.txt

3) OpenAPI Diff
Purpose: Compare two versions of the spec.
Run (openapi-diff):
- npx openapi-diff .\\docs\\openapi.old.json .\\docs\\openapi.new.json | Tee-Object -FilePath .\\docs\\openapi-diff.txt
Alternative (Redocly diff):
- npx @redocly/cli diff .\\docs\\openapi.old.json .\\docs\\openapi.new.json | Tee-Object -FilePath .\\docs\\openapi-diff.txt

4) OpenAPI → Postman Collection
Purpose: Generate a Postman collection for testing.
Run:
- npx openapi-to-postmanv2 -s .\\docs\\swagger.json -o .\\docs\\postman.collection.json

Tips
- Keep swagger.json under version control if you want deterministic diffs.
- Use the bundled spec (openapi.bundle.json) for client generation/publishing.
`),
  order: 10,
};
