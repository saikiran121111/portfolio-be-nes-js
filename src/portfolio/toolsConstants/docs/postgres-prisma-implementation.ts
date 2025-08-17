import { ToolDoc, strip } from '../types';

export const postgresPrismaImplementationDoc: ToolDoc = {
  key: 'postgres-prisma',
  title: 'PostgreSQL + Prisma Implementation',
  icon: 'DatabaseZap',
  summary: 'Schema, migrations, seeding, and Prisma usage in NestJS.',
  content: strip(`
PostgreSQL + Prisma Implementation – Portfolio Backend

Overview
- ORM: Prisma 6 with PostgreSQL
- Schema: prisma/schema.prisma defines models (User, Experience, Project, Skill, Education, Certification, Achievement, Language, ScanReport, Setting, BottomHeadline)
- Migrations: prisma/migrations/*; seed: prisma/seed.ts

Environment setup
- Local dev env files:
  • env/local/.env.prisma – contains DATABASE_URL for local or Neon dev branch
  • env/develop/.env.prisma – staging database URL
  • env/prod/.env.prisma – production Neon pooled database URL
- Prisma commands are wrapped with dotenv in package.json scripts

Generating client
- Local: npm run prisma:generate:local
- Develop: npm run prisma:generate:develop
- Prod: npm run prisma:generate:prod

Migrations
- Local dev: npm run prisma:migrate:local → creates a new migration from schema changes
- Develop (shared env): npm run prisma:migrate:develop
- Production: npm run prisma:migrate:prod (uses migrate deploy to apply existing migrations)

Seeding
- Local: npm run prisma:seed:local
- Develop: npm run prisma:seed:develop
- Production: npm run prisma:seed:prod

Prisma usage in NestJS
- Global PrismaModule provides PrismaService (extends PrismaClient)
- Connect onModuleInit and disconnect onModuleDestroy (already implemented)
- Services use prisma.* CRUD; PortfolioService uses prisma.user.findFirst with include trees

Health checks
- HealthService executes prisma.$queryRaw\`SELECT 1\` to verify DB connectivity

Performance & best practices
- Always use include/select to limit payloads
- Index frequently queried fields in schema.prisma
- Use transactions for multi-step writes (prisma.$transaction)
- Prefer connection pooler endpoint for hosted Postgres (Neon); keep sslmode=require

Troubleshooting
- Migration drift: run \`npx prisma migrate resolve\` carefully or reset in dev via \`npm run db:reset\`
- Prisma generate fails: ensure DATABASE_URL is valid in the environment used
- Timeouts/connection limits: use pooler endpoint and keep Prisma version up to date
`),
  order: 26,
};
