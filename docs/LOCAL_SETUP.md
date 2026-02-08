 Local Database Setup Guide

This guide shows you how to run PostgreSQL database on your local machine.

---

 Quick Start (3 Steps)

### Step 1: Start Database
```bash
npm run docker:up
```
This starts PostgreSQL and PgAdmin in Docker containers.

### Step 2: Generate Prisma Client
```bash
npm run prisma:generate:local
```
This creates the code to talk to your database.

### Step 3: Run Migrations & Seed Data
```bash
npm run prisma:migrate:local
npm run prisma:seed:local
```
This creates all tables and adds sample data.

Your database is ready to use.

---

Start Your Application

```bash
npm run start:local
```
This starts your NestJS backend server connected to the local database.

---

View Your Data

### Option 1: Prisma Studio (Recommended)
```bash
npm run prisma:studio:local
```
Opens a nice web interface to see and edit your data.

### Option 2: PgAdmin
Open browser: `http://localhost:8080`
- Email: `admin@example.com`
- Password: `admin`

---

### Useful Commands

### Docker Commands
```bash
npm run docker:up       # Start database
npm run docker:down     # Stop database
npm run docker:ps       # Check if running
npm run docker:logs     # See database logs
```

### Database Commands
```bash
npm run prisma:studio:local    # Open database viewer
npm run prisma:seed:local      # Add sample data again
npm run db:reset               # Delete everything and start fresh (careful!)
```

---

### Database Connection Details

| What | Value |
|------|-------|
| Host | `localhost` |
| Port | `5432` |
| Database Name | `portfolio` |
| Username | `postgres` |
| Password | `postgres` |

**Connection String:**
```
postgresql://postgres:postgres@localhost:5432/portfolio
```

---

## Environment Files

All database settings are in these files:

- `env/local/.env.docker` - Docker container settings
- `env/local/.env.prisma` - Database connection for Prisma

**Don't commit these files to Git!** They are already in `.gitignore`.

---

## Sample Data Included

After running seed, you'll have:
- 1 User (admin)
- 7 Skills
- 2 Work Experiences
- 2 Projects
- 1 Education
- 2 Certifications
- 2 Achievements
- 3 Languages
- 3 Scan Reports

---

## Common Issues

### "Docker is not running"
**Solution:** Start Docker Desktop first, then run `npm run docker:up`

### "Port 5432 already in use"
**Solution:** Another PostgreSQL is running. Stop it or change port in `env/local/.env.docker`

### "Can't connect to database"
**Solution:** 
1. Check if Docker is running: `npm run docker:ps`
2. Restart containers: `npm run docker:down` then `npm run docker:up`

---

## Daily Workflow

**Starting work:**
```bash
npm run docker:up          # Start database
npm run start:local        # Start backend
```

**Ending work:**
```bash
# Press Ctrl+C to stop backend
npm run docker:down        # Stop database
```

---

## Reset Everything

If something goes wrong and you want to start fresh:

```bash
npm run docker:down        # Stop containers
npm run docker:up          # Start containers
npm run db:reset           # Reset database (deletes all data)
npm run prisma:seed:local  # Add sample data again
```

---

## Next Steps

1. ✅ Database is running
2. ✅ Sample data is loaded
3. 👉 Start building your APIs in `src/` folder
4. 👉 Test your endpoints
5. 👉 Add more features!

---

**Need help?** Check the main [README.md](./README.md) or Prisma docs at https://www.prisma.io/docs
