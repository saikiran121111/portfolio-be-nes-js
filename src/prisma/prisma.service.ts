import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private keepAliveInterval: NodeJS.Timeout;

  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
  }

  // Retry logic for DB connection + Keep-alive
  async onModuleInit() {
    const maxRetries = 5;
    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        await this.$connect();
        this.logger.log('Database connected');
        break;
      } catch (err) {
        attempt++;
        this.logger.warn(`DB connection failed (attempt ${attempt}/${maxRetries})`);
        if (attempt >= maxRetries) {
          this.logger.error('Max retries reached. Could not connect to DB.');
          throw err;
        }
        await delay(1000 * attempt); // Exponential backoff
      }
    }

    // Keep-alive query every 1 minute
    this.keepAliveInterval = setInterval(async () => {
      try {
        await this.$queryRaw`SELECT 1`;
        this.logger.debug('Keep-alive query executed');
      } catch (err) {
        this.logger.error('Keep-alive query failed', err);
      }
    }, 60000);
  }

  async onModuleDestroy() {
    if (this.keepAliveInterval) {
      clearInterval(this.keepAliveInterval);
    }
    await this.$disconnect();
    this.logger.log('Database disconnected');
  }
}
