import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

// Keep-alive ping interval: 3 days (259,200,000 ms)
// This is the normal cadence to prevent Supabase from going inactive (1 week threshold)
const KEEP_ALIVE_INTERVAL_MS = 259_200_000;

// Daily health check interval: 24 hours (86,400,000 ms)
// Checks if DB is alive; if not, retries aggressively until it wakes up
const DAILY_CHECK_INTERVAL_MS = 86_400_000;

// Retry interval when database is down: 30 seconds (30,000 ms)
const RETRY_INTERVAL_MS = 30_000;

// Maximum retry attempts before giving up and waiting for the next daily check
const MAX_RETRY_ATTEMPTS = 10;

@Injectable()
export class KeepAliveService implements OnModuleInit {
  private readonly logger = new Logger(KeepAliveService.name);
  private retryTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(private readonly prisma: PrismaService) { }

  async onModuleInit() {
    this.logger.log('=== KeepAliveService STARTED ===');
    this.logger.log('Keep-alive ping: every 3 days');
    this.logger.log('Daily health check: every 24 hours (retries if DB is down)');
    await this.pingDb();
  }

  // Runs every 3 days to keep Supabase Postgres from sleeping
  // Supabase free tier goes inactive after 1 week of no queries
  @Interval(KEEP_ALIVE_INTERVAL_MS)
  async pingDb(): Promise<boolean> {
    const startTime = Date.now();
    const timestamp = new Date().toISOString();

    this.logger.log(`Pinging database at ${timestamp}...`);

    try {
      await this.prisma.$queryRaw`SELECT 1 as alive`;
      const responseTime = Date.now() - startTime;
      this.logger.log(`SUCCESS | Response time: ${responseTime}ms | Status: Database is ALIVE`);
      return true;
    } catch (err) {
      const responseTime = Date.now() - startTime;
      this.logger.error(`FAILED | Response time: ${responseTime}ms | Status: Database ERROR`);
      this.logger.error(`Error details: ${String(err)}`);
      return false;
    }
  }

  // Runs every 24 hours to check if database is still responsive
  // If down, retries every 30s until it wakes up
  @Interval(DAILY_CHECK_INTERVAL_MS)
  async checkDatabaseHealth(): Promise<void> {
    this.logger.log('Running daily database health check...');
    const isAlive = await this.pingDb();

    if (!isAlive) {
      this.logger.warn('Database is DOWN — starting retry loop to wake it up');
      await this.retryUntilAlive();
    }
  }

  private async retryUntilAlive(): Promise<void> {
    for (let attempt = 1; attempt <= MAX_RETRY_ATTEMPTS; attempt++) {
      this.logger.warn(`Retry attempt ${attempt}/${MAX_RETRY_ATTEMPTS} — waiting ${RETRY_INTERVAL_MS / 1000}s...`);
      await this.delay(RETRY_INTERVAL_MS);

      const isAlive = await this.pingDb();
      if (isAlive) {
        this.logger.log(`Database recovered after ${attempt} retry attempt(s)`);
        return;
      }
    }

    this.logger.error(
      `Database still DOWN after ${MAX_RETRY_ATTEMPTS} retries. Will try again at next daily check.`,
    );
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => {
      this.retryTimer = setTimeout(resolve, ms);
    });
  }

  // Clean up any pending retry timers on shutdown
  onModuleDestroy() {
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
      this.retryTimer = null;
    }
  }
}

