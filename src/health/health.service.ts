import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  async getHealthStatus() {
    // Database connectivity check
    let dbStatus = 'ok';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch (error) {
      dbStatus = 'error';
    }

    // Memory usage
    const memoryUsage = process.memoryUsage();

    // Uptime
    const uptime = process.uptime();

    // Environment info
    const nodeVersion = process.version;
    const appVersion = process.env.npm_package_version || 'unknown';

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      dbStatus,
      memoryUsage,
      uptime,
      nodeVersion,
      appVersion,
    };
  }
}
