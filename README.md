# Portfolio Backend (NestJS)

Backend API for portfolio website built with NestJS, PostgreSQL, and Prisma.

## 📚 Documentation

All documentation is now in the [`docs/`](./docs) folder:

- **[Local Setup Guide](./docs/LOCAL_SETUP.md)** - How to run the database locally
- **[Git Hooks Guide](./docs/GIT-HOOKS.md)** - Setting up pre-commit hooks
- **[Full Documentation](./docs/README.md)** - Complete project documentation

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start database
npm run docker:up

# 3. Generate Prisma client
npm run prisma:generate:local

# 4. Run migrations and seed data
npm run prisma:migrate:local
npm run prisma:seed:local

# 5. Start the application
npm run start:local
```

👉 **For detailed setup instructions, see [docs/LOCAL_SETUP.md](./docs/LOCAL_SETUP.md)**

## 🛠️ Tech Stack

- **Framework:** NestJS
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Language:** TypeScript
- **Container:** Docker

## 📝 License

UNLICENSED
