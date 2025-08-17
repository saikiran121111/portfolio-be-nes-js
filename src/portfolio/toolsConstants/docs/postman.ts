import { ToolDoc, strip } from '../types';

export const postmanDoc: ToolDoc = {
  key: 'postman',
  title: 'Postman Collections and Newman',
  icon: 'Send',
  summary: 'Build and run Postman collections and reports from OpenAPI.',
  content: strip(`
Postman Collections and Newman – Portfolio Backend

Overview
This file explains how to create and use a Postman collection from the API OpenAPI spec, set up environments, add headers automatically, write tests, and run collections via Newman to generate reports.

Prerequisites
- OpenAPI JSON available at http://localhost:3002/swagger-json or saved at .\\docs\\swagger.json
- Postman (app or web)
- Optional CLI: npx/newman available (Node.js installed)
- Create output folder if needed: if (!(Test-Path .\\docs)) { New-Item -ItemType Directory -Path .\\docs | Out-Null }

1) Create a Postman collection from OpenAPI
- CLI: npx openapi-to-postmanv2 -s .\\docs\\swagger.json -o .\\docs\\postman.collection.json
- Postman UI: Import → Link → paste http://localhost:3002/swagger-json → Import
Notes:
- Re-generate the collection whenever the API changes.

2) Create a Postman environment
Variables to define:
- baseUrl = http://localhost:3002
- version = 2
Options:
- Postman UI: Environments → New → add variables above → Save (e.g., name "Local").
- JSON file (optional): Save as .\\docs\\postman.env.json with a standard Postman environment export structure.

3) Use variables in requests
- Replace absolute URLs with {{baseUrl}} (e.g., GET {{baseUrl}}/api/portfolio/user, GET {{baseUrl}}/health).
- Use {{version}} to control the Version header value.

4) Auto-inject the Version header (collection-level)
Add a Pre-request Script at the collection level:
- If "Version" header is not set, add Version from environment/collection variables.
Pseudo:
  if (!pm.request.headers.has('Version')) {
    const v = (pm.environment.get('version') || pm.collectionVariables.get('version') || '2') + '';
    pm.request.headers.add({ key: 'Version', value: v });
  }
Notes:
- This ensures both v1 and v2 can be exercised by changing the "version" variable.

5) Basic tests examples (add in each request → Tests)
- Status code: pm.test('status 200', () => pm.response.to.have.status(200));
- Response time: pm.test('fast response', () => pm.expect(pm.response.responseTime).to.be.below(1500));
- JSON checks:
  - Health (GET /health): verify keys status, timestamp, dbStatus exist.
  - Portfolio v2 (GET /api/portfolio/user): verify properties like name, email, skills (array) exist.

6) Run collections with Newman (CLI)
- Without environment file:
  npx newman run .\\docs\\postman.collection.json --env-var baseUrl=http://localhost:3002 --env-var version=2 --reporters cli,json --reporter-json-export .\\docs\\newman.json
- With environment file:
  npx newman run .\\docs\\postman.collection.json -e .\\docs\\postman.env.json --reporters cli,json --reporter-json-export .\\docs\\newman.json
- HTML report (optional):
  Install: npm i -D newman-reporter-htmlextra
  Run: npx newman run .\\docs\\postman.collection.json -e .\\docs\\postman.env.json --reporters cli,htmlextra --reporter-htmlextra-export .\\docs\\newman.html
Notes:
- Newman exit codes integrate well with CI (non-zero on failures).

7) Organizing by API version
- Create two foldered requests in the collection: "Portfolio v1" (version=1) and "Portfolio v2" (version=2), or keep one request and switch the version variable.
- Save examples for both versions to aid documentation.

8) Keeping collections in source control
- Commit .\\docs\\postman.collection.json and optional .\\docs\\postman.env.json.
- Prefer not to commit personal access tokens; use environment variables in CI instead.

9) CI/CD tips
- In CI, start the API, wait until /health returns 200, then run the Newman command.
- Artifacts: upload .\\docs\\newman.json and/or .\\docs\\newman.html as build artifacts.

Troubleshooting
- If import fails, ensure the OpenAPI JSON is valid; run Spectral/Redocly lint first.
- If Version header missing errors appear, confirm the Pre-request Script is set at the collection level or the header is added explicitly.
- For SSL/proxy issues in corporate networks, use Newman flags like --insecure or configure proxy settings as needed.
`),
  order: 18,
};
