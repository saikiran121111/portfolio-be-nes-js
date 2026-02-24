import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const MAX_RETRIES = 7;
const BASE_DELAY_MS = 2000; // 2 seconds base, doubles each attempt

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      const logger = new Logger(PrismaService.name);
      logger.error(
        'DATABASE_URL is not set! Make sure your environment variables are loaded. ' +
        'For local dev, use: npm run start:local',
      );
    }

    super({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    });
  }

  // Retry logic for DB connection with exponential backoff
  async onModuleInit() {
    let attempt = 0;

    while (attempt < MAX_RETRIES) {
      try {
        await this.$connect();
        this.logger.log('Database connected successfully');
        return;
      } catch (err) {
        attempt++;
        const waitMs = BASE_DELAY_MS * Math.pow(2, attempt - 1);
        this.logger.warn(
          `DB connection failed (attempt ${attempt}/${MAX_RETRIES}) — retrying in ${waitMs / 1000}s...`,
        );
        if (attempt >= MAX_RETRIES) {
          this.logger.error(
            `Max retries (${MAX_RETRIES}) reached. Could not connect to database.`,
          );
          throw err;
        }
        await this.delay(waitMs);
      }
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Database disconnected');
  }
}
