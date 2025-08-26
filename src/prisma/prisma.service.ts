import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
  }

  // Retry logic for DB connection
  async onModuleInit() {
    const maxRetries = 5;
    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
    let attempt = 0;
    while (attempt < maxRetries) {
      try {
        await this.$connect();
        return;
      } catch (err) {
        attempt++;
        if (attempt >= maxRetries) {
          throw err;
        }
        await delay(1000 * attempt); // Exponential backoff
      }
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
