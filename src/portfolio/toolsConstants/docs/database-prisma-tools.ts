import { ToolDoc, strip } from '../types';

export const databasePrismaTools: ToolDoc = {
  key: 'prisma',
  title: 'Database / Prisma Tools',
  icon: 'Database',
  summary: 'ERD, Prisma docs generator, and migrate status.',
  content: strip(`
Database / Prisma Tools – Portfolio Backend

Prerequisites
- DATABASE_URL configured in your .env (env/local|develop|prod/.env.prisma)
- Create output folder if needed:
  if (!(Test-Path .\\docs)) { New-Item -ItemType Directory -Path .\\docs | Out-Null }

1) Prisma ERD (Entity Relationship Diagram)
Purpose: Generate an ER diagram from prisma/schema.prisma.
Install (once):
- npm i -D prisma-erd-generator
Add to prisma/schema.prisma:
- generator erd {
    provider = "prisma-erd-generator"
    output   = "./../docs/prisma-erd.svg"
  }
Generate:
- npx prisma generate

2) prisma-docs-generator (Model Docs)
Purpose: Generate Markdown/HTML docs from Prisma schema.
Install (once):
- npm i -D prisma-docs-generator @prisma/client
Add to prisma/schema.prisma:
- generator docs {
    provider = "prisma-docs-generator"
    output   = "./../docs/prisma-docs"
  }
Generate:
- npx prisma generate
Output:
- docs/prisma-docs/ (Markdown/HTML files)

3) Prisma Migrate Status (Summary)
Purpose: Summarize the state of migrations against the target DB.
Run:
- npx prisma migrate status | Tee-Object -FilePath .\\docs\\prisma-migrate-status.txt
Notes:
- Requires DB accessible at DATABASE_URL.
`),
  order: 13,
};
