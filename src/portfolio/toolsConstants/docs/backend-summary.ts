import { ToolDoc, strip } from '../types';

export const backendSummary: ToolDoc = {
  key: 'nestjs',
  title: 'Portfolio Backend – Codebase Summary',
  icon: 'ServerCog',
  summary: 'NestJS + Prisma stack, modules, versioning, and API overview.',
  content: strip(`
Portfolio Backend – Codebase Summary

Stack and runtime
- NestJS 11 (Express platform) with TypeScript.
- Prisma ORM 6 (PostgreSQL).
- Swagger (OpenAPI) served at /swagger.
- CORS enabled; app listens on 0.0.0.0:<PORT> (default 3002).

App structure
- src/main.ts: Bootstraps app, enables header versioning, default Version header middleware, and Swagger.
- src/app.module.ts: Root module importing PortfolioModule, PrismaModule (global), HealthModule.
- src/constants/headerVersion.ts: HEADER_VERSION = '2'.
- src/middleware/defaultVersionHeader.middleware.ts: Injects Version header when absent.

Modules and routes
- PortfolioModule:
  - Controller: src/portfolio/portfolio.controller.ts
    - GET /api/portfolio/user (v1): returns raw Prisma user with relations.
    - GET /api/portfolio/user (v2, default): returns mapped PortfolioResponseDto; accepts Version header '2' (middleware supplies default).
  - Service: src/portfolio/portfolio.service.ts
    - getPortfolioV1(): prisma.user.findFirst(...) with includes.
    - getPortfolioV2(): same query + maps to domain shape via mapper.
  - Mapper: src/portfolio/mapper/portfolio.mapper.ts
    - Maps Prisma models to IPortfolio (skills, experiences, projects, education, certifications, achievements, languages, scanReports, bottomHeadline).
    - Handles JSON parsing for summary/socials; sorts bottomHeadlines by order.
  - DTOs: src/portfolio/dto/*.ts
    - user.response.dto.ts: fine-grained DTOs for nested entities and ScanReport summary.
    - portfolio.response.dto.ts: top-level response; toPortfolioResponseDto helper.
  - Interfaces: src/portfolio/interface/*.ts
    - IPortfolio plus user sub-interfaces (ISkill, IExperience, IProjects, IEducation, ICertifications, IAchievements, ILanguages, IscanReports, ISummary).

- HealthModule:
  - Controller: src/health/health.controller.ts → GET /health.
  - Service: src/health/health.service.ts → returns status, timestamp, dbStatus (via prisma.$queryRaw \`SELECT 1\`), memoryUsage, uptime, node/app versions.

- PrismaModule (Global):
  - src/prisma/prisma.service.ts extends PrismaClient; uses DATABASE_URL; connects on module init and disconnects on destroy.

Data and persistence
- prisma/schema.prisma: PostgreSQL schema with models:
  - User, Experience, Project, Skill, Education, Certification, Achievement, Language, ScanReport, Setting, BottomHeadline.
  - Relations via userId; arrays for list fields; Json for socials and scan report summary.
- prisma/seed.ts: Seeds a full portfolio for admin@example.com (skills, experiences, projects, education, certifications, achievements, languages, scan reports, bottom headlines).
- prisma/migrations: Versioned SQL migrations (init, add_bottom_headline, add_user_copyrights).

API versioning
- VersioningType.HEADER with header name "Version".
- Default version: 2 (from HEADER_VERSION). Middleware ensures Version header is set when missing.
- Controllers use @Version('1') and @Version(HEADER_VERSION) to expose v1 and v2.

OpenAPI
- DocumentBuilder title: "Portfolio API", description provided, version "1.0".
- Swagger UI available at GET /swagger.

Environment and configuration
- env/local|develop|prod/.env.prisma contain DATABASE_URL and related settings.
- PORT environment variable supported; defaults to 3002.
- docker-compose uses env/local/.env.docker via npm scripts.

NPM scripts (highlights)
- start, start:dev, start:prod, start:local, start:develop.
- build, build:deploy.
- prisma:generate|migrate|deploy|studio|seed for local/develop/prod.
- docker:up|down|logs|ps.
- lint, format, test, test:e2e, test:cov.

Testing
- Jest config in package.json.
- E2E test in test/app.e2e-spec.ts (basic GET /).

Security and middleware
- No authentication/authorization yet.
- defaultVersionHeaderMiddleware mutates request to include Version header when missing.

Integration notes
- Frontend should call GET /api/portfolio/user with header Version: 2 to receive the mapped PortfolioResponseDto. Without the header, the server defaults to v2.
- For legacy/raw Prisma shape, send Version: 1.
- API docs available at /swagger for interactive exploration.
`),
  order: 11,
};
