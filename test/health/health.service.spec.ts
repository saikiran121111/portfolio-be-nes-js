import { Test, TestingModule } from '@nestjs/testing';
import { HealthService } from '../../src/health/health.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { mockPrismaService } from '../setup';

describe('HealthService', () => {
  let service: HealthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<HealthService>(HealthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getHealthStatus', () => {
    it('should return health status with db ok', async () => {
      mockPrismaService.$queryRaw.mockResolvedValue([{ '?column?': 1 }]);

      const result = await service.getHealthStatus();

      expect(result).toBeDefined();
      expect(result.status).toBe('ok');
      expect(result.dbStatus).toBe('ok');
      expect(result.timestamp).toBeDefined();
      expect(result.memoryUsage).toBeDefined();
      expect(result.uptime).toBeDefined();
      expect(result.nodeVersion).toBeDefined();
      expect(result.appVersion).toBeDefined();
      expect(typeof result.timestamp).toBe('string');
      expect(typeof result.uptime).toBe('number');
      expect(typeof result.nodeVersion).toBe('string');
    });

    it('should return health status with db error when database fails', async () => {
      mockPrismaService.$queryRaw.mockRejectedValue(
        new Error('Database connection failed'),
      );

      const result = await service.getHealthStatus();

      expect(result).toBeDefined();
      expect(result.status).toBe('ok');
      expect(result.dbStatus).toBe('error');
      expect(result.timestamp).toBeDefined();
      expect(result.memoryUsage).toBeDefined();
      expect(result.uptime).toBeDefined();
      expect(result.nodeVersion).toBeDefined();
      expect(result.appVersion).toBeDefined();
    });

    it('should return valid memory usage information', async () => {
      mockPrismaService.$queryRaw.mockResolvedValue([{ '?column?': 1 }]);

      const result = await service.getHealthStatus();

      expect(result.memoryUsage).toBeDefined();
      expect(typeof result.memoryUsage).toBe('object');
      expect(result.memoryUsage).toHaveProperty('rss');
      expect(result.memoryUsage).toHaveProperty('heapTotal');
      expect(result.memoryUsage).toHaveProperty('heapUsed');
      expect(result.memoryUsage).toHaveProperty('external');
    });

    it('should return valid timestamp in ISO format', async () => {
      mockPrismaService.$queryRaw.mockResolvedValue([{ '?column?': 1 }]);

      const result = await service.getHealthStatus();

      expect(result.timestamp).toBeDefined();
      expect(typeof result.timestamp).toBe('string');
      expect(new Date(result.timestamp).toISOString()).toBe(result.timestamp);
    });

    it('should return uptime as a positive number', async () => {
      mockPrismaService.$queryRaw.mockResolvedValue([{ '?column?': 1 }]);

      const result = await service.getHealthStatus();

      expect(result.uptime).toBeDefined();
      expect(typeof result.uptime).toBe('number');
      expect(result.uptime).toBeGreaterThanOrEqual(0);
    });

    it('should handle app version from environment', async () => {
      const originalVersion = process.env.npm_package_version;
      process.env.npm_package_version = '1.0.0';
      mockPrismaService.$queryRaw.mockResolvedValue([{ '?column?': 1 }]);

      const result = await service.getHealthStatus();

      expect(result.appVersion).toBe('1.0.0');

      // Restore original value
      if (originalVersion) {
        process.env.npm_package_version = originalVersion;
      } else {
        delete process.env.npm_package_version;
      }
    });

    it('should return unknown when app version is not available', async () => {
      const originalVersion = process.env.npm_package_version;
      delete process.env.npm_package_version;
      mockPrismaService.$queryRaw.mockResolvedValue([{ '?column?': 1 }]);

      const result = await service.getHealthStatus();

      expect(result.appVersion).toBe('unknown');

      // Restore original value
      if (originalVersion) {
        process.env.npm_package_version = originalVersion;
      }
    });
  });
});
