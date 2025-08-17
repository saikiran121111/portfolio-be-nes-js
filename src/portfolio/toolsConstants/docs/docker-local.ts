import { ToolDoc, strip } from '../types';

export const dockerLocal: ToolDoc = {
  key: 'docker',
  title: 'Docker (Local) – Compose Summary',
  icon: 'Boxes',
  summary: 'Local Postgres and pgAdmin with docker-compose.',
  content: strip(`
Docker (Local) – Compose Summary

Overview
- File: docker-compose.yml (local-focused setup).
- Services: PostgreSQL 15 (postgres) and pgAdmin 4 (pgadmin).
- Uses env/local/.env.docker for credentials and ports.
- Persistent data via named volume: pgdata.

Services
- postgres
  - Image: postgres:15
  - Restart: unless-stopped
  - env_file: env/local/.env.docker (POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB)
  - Ports: "${'${'}POSTGRES_PORT:-5432}:5432" (host:container)
  - Volumes: pgdata → /var/lib/postgresql/data
- pgadmin
  - Image: dpage/pgadmin4
  - env_file: env/local/.env.docker (PGADMIN_DEFAULT_EMAIL, PGADMIN_DEFAULT_PASSWORD)
  - Ports: "${'${'}PGADMIN_PORT:-8080}:80"

Environment files
- env/local/.env.docker
  - POSTGRES_USER=<your_user>
  - POSTGRES_PASSWORD=<your_password>
  - POSTGRES_DB=<your_db>
  - PGADMIN_DEFAULT_EMAIL=<your_email>
  - PGADMIN_DEFAULT_PASSWORD=<your_pgadmin_password>
  - POSTGRES_PORT=5432
  - PGADMIN_PORT=8080
- env/local/.env.prisma
  - DATABASE_URL="postgresql://<user>:<password>@localhost:5432/<db>?schema=public"

Project scripts (local)
- docker:up / docker:down / docker:logs / docker:ps → compose with env/local/.env.docker.
- prisma:generate:local / prisma:migrate:local / prisma:studio:local → use env/local/.env.prisma.

Connection info
- PostgreSQL: localhost:${'${'}POSTGRES_PORT or 5432}, DB=<db>, user=<user>, password=<password>.
- Prisma: uses DATABASE_URL from env/local/.env.prisma.
- pgAdmin: http://localhost:${'${'}PGADMIN_PORT or 8080} (login with env creds).

Notes
- App itself is not containerized; compose provides local DB + admin UI.
- Change POSTGRES_PORT/PGADMIN_PORT in env/local/.env.docker if ports conflict.
- To reset data, remove the pgdata volume (this will wipe the database).
`),
  order: 14,
};
