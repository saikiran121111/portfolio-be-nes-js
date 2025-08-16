import { ToolDoc, strip } from '../types';

export const swaggerDoc: ToolDoc = {
  key: 'swagger',
  title: 'Swagger / OpenAPI – App Setup and Tips',
  icon: 'BookOpenCheck',
  summary: 'Swagger UI/JSON endpoints and suggested annotations.',
  content: strip(`
Swagger / OpenAPI – Portfolio Backend

What’s configured now
- Location: src/main.ts → setupSwagger(app)
  - DocumentBuilder: title "Portfolio API", description "API documentation for Portfolio project", version "1.0".
  - Swagger UI path: /swagger
  - OpenAPI JSON path: /swagger-json
- Versioning: Header-based (header: "Version"; default "2"). The same route (GET /api/portfolio/user) exists for v1 and v2.
- Decorators already used:
  - Controller: @ApiHeader on both GET /api/portfolio/user (documents the Version header)
  - DTOs: @ApiProperty / @ApiPropertyOptional in PortfolioResponseDto (and nested DTOs)

How to view locally
- UI: http://localhost:3002/swagger
- JSON: http://localhost:3002/swagger-json

Export OpenAPI JSON (PowerShell)
- Create folder if needed: if (!(Test-Path .\\docs)) { New-Item -ItemType Directory -Path .\\docs | Out-Null }
- Fetch JSON: Invoke-WebRequest http://localhost:3002/swagger-json -OutFile .\\docs\\swagger.json

Generate docs and clients from OpenAPI (optional)
- Static HTML docs (Redoc): npx @redocly/cli build-docs .\\docs\\swagger.json -o .\\docs\\index.html
- Markdown docs (Widdershins): npx widdershins .\\docs\\swagger.json -o .\\docs\\api.md
- TypeScript Axios client: npx openapi-generator-cli generate -i .\\docs\\swagger.json -g typescript-axios -o .\\clients\\ts-axios

Grouping and describing endpoints better
- Add tags: use @ApiTags('Portfolio') at class level of PortfolioController, and @ApiTags('Health') on HealthController, to group endpoints in the UI.
- Describe responses: use @ApiOkResponse({ type: PortfolioResponseDto }) on v2 route; for v1 you can use @ApiOkResponse({ schema: { type: 'object' } }) or define a dedicated DTO.
- Request headers/params: you already use @ApiHeader for Version. For path/query params, use @ApiParam / @ApiQuery.
- Examples: use @ApiResponse({ status: 200, schema: { example: { ... } } }) or @ApiOkResponse({ schema: { example: { ... } } }).

Header versioning caveat in docs
- With VersioningType.HEADER, both v1 and v2 share the same path/method in the UI. Swagger UI won’t show distinct versions unless you:
  - Prefix routes in code (not desired), or
  - Generate separate documents per version (advanced), or
  - Annotate descriptions to clarify versions (recommended quick win).

Suggested quick enhancements (non-breaking)
- Add servers in DocumentBuilder so the UI shows environments:
  - .addServer('http://localhost:3002', 'Local')
  - .addServer('https://<develop-host>', 'Develop')
  - .addServer('https://<prod-host>', 'Production')
- Add contact/license to DocumentBuilder: .setContact(...), .setLicense(...)
- Add bearer auth when security is introduced: .addBearerAuth(); then annotate routes with @ApiBearerAuth().

Known operations (current app)
- GET /api/portfolio/user — v1 (raw Prisma shape), v2 (PortfolioResponseDto). Version selected via Version header; default is v2.
- GET /health — simple service status (no DTOs yet; can be documented with a HealthDto for better schema).

Minimal code hints (reference only; not applied yet)
- Controller tags: @ApiTags('Portfolio') above class PortfolioController
- Response for v2: @ApiOkResponse({ type: PortfolioResponseDto }) above getUserV2
- Health: add @ApiTags('Health') and a simple HealthDto with @ApiProperty fields.
- DocumentBuilder extras:
  new DocumentBuilder()
    .setTitle('Portfolio API')
    .setDescription('API documentation for Portfolio project')
    .setVersion('1.0')
    .addServer('http://localhost:3002', 'Local')
    .addServer('https://dev.example.com', 'Develop')
    .addServer('https://api.example.com', 'Production')
    // .addBearerAuth()
    .build();

Planned code annotations (not applied yet)
- PortfolioController
  - Add class tag: @ApiTags('Portfolio')
  - V2 endpoint: @ApiOperation({ summary: 'Get portfolio (v2 mapped DTO)' }) and @ApiOkResponse({ type: PortfolioResponseDto })
  - V1 endpoint: @ApiOperation({ summary: 'Get portfolio (v1 raw)' }) and either @ApiOkResponse({ schema: { type: 'object' } }) or define a dedicated V1 DTO
- HealthController
  - Add class tag: @ApiTags('Health')
  - Consider a HealthDto with fields: status (string), timestamp (string/ISO), dbStatus (string), memoryUsage (object), uptime (number), nodeVersion (string), appVersion (string)
  - Then add @ApiOkResponse({ type: HealthDto })
- Swagger DocumentBuilder additions in src/main.ts
  - .addServer('http://localhost:3002', 'Local')
  - .addServer('https://<develop-host>', 'Develop')
  - .addServer('https://<prod-host>', 'Production')
  - .setContact('Your Name', 'https://<site>', 'you@example.com')
  - .setLicense('MIT', 'https://opensource.org/licenses/MIT')
  - (future) .addBearerAuth() and @ApiBearerAuth() on protected routes

Proposed npm scripts (to add later to package.json)
- docs:swagger
  - powershell -NoProfile -Command "if (!(Test-Path .\\docs)) { New-Item -ItemType Directory -Path .\\docs | Out-Null }; Invoke-WebRequest http://localhost:3002/swagger-json -OutFile .\\docs\\swagger.json"
- docs:redoc
  - npx @redocly/cli build-docs .\\docs\\swagger.json -o .\\docs\\index.html
- docs:md
  - npx widdershins .\\docs\\swagger.json -o .\\docs\\api.md
- client:ts
  - npx openapi-generator-cli generate -i .\\docs\\swagger.json -g typescript-axios -o .\\clients\\ts-axios
- docs:all (run after the server is up)
  - npm run docs:swagger && npm run docs:redoc && npm run docs:md

Optional devDependencies (if you prefer installing the CLIs)
- @redocly/cli
- widdershins
- openapi-generator-cli

Advanced: separate docs per API version (reference)
- Because header versioning reuses the same path, to show v1 and v2 distinctly you can:
  1) Create two Swagger documents by filtering routes by version when calling createDocument twice, then mount at /swagger-v1 and /swagger-v2
  2) Or expose query/header presets in Swagger UI via a plugin to set Version automatically
- For most cases, clarifying version usage in descriptions and examples is sufficient

Postman/clients
- You can import docs/swagger.json directly into Postman to auto-create a collection
- API client stubs can be generated with openapi-generator for many languages (typescript-axios, typescript-fetch, java, python)

Notes for Windows/PowerShell
- When running the PowerShell commands in scripts, npm on Windows uses cmd by default; prefixing with "powershell -NoProfile -Command \"...\"" ensures the PowerShell cmdlets (Test-Path, New-Item, Invoke-WebRequest) are available
- Alternatively, run the listed commands directly in a PowerShell terminal
`),
  order: 22,
};
