import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class KeepAliveService {
  private readonly logger = new Logger(KeepAliveService.name);

  constructor(private readonly prisma: PrismaService) {}

  // Runs every 5 minutes to keep Neon/Postgres from idling
  @Cron(CronExpression.EVERY_5_MINUTES)
  async pingDb() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      this.logger.debug('Neon keep-alive ping successful');
    } catch (err) {
      this.logger.warn(`Neon keep-alive ping failed: ${String(err)}`);
    }
  }
}
