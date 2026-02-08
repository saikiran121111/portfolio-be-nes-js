import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class KeepAliveService implements OnModuleInit {
  private readonly logger = new Logger(KeepAliveService.name);

  constructor(private readonly prisma: PrismaService) { }

  // Runs immediately when the app starts
  async onModuleInit() {
    this.logger.log('=== KeepAliveService STARTED ===');
    this.logger.log('Database will be pinged every 3 days to prevent Supabase from sleeping');
    await this.pingDb();
  }

  // Runs every 3 days (259200000 ms) to keep Supabase Postgres from sleeping
  // Supabase free tier goes inactive after 1 week of no queries, so 2 pings per week is sufficient
  @Interval(259200000)
  async pingDb() {
    const startTime = Date.now();
    const timestamp = new Date().toISOString();

    this.logger.log(`Pinging database at ${timestamp}...`);

    try {
      await this.prisma.$queryRaw`SELECT 1 as alive`;
      const responseTime = Date.now() - startTime;
      this.logger.log(`SUCCESS | Response time: ${responseTime}ms | Status: Database is ALIVE`);
    } catch (err) {
      const responseTime = Date.now() - startTime;
      this.logger.error(`FAILED | Response time: ${responseTime}ms | Status: Database ERROR`);
      this.logger.error(`Error details: ${String(err)}`);
    }
  }
}
