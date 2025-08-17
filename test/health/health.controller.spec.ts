import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from '../../src/health/health.controller';
import { HealthService } from '../../src/health/health.service';

describe('HealthController', () => {
  let controller: HealthController;

  const mockHealthService = {
    getHealthStatus: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthService,
          useValue: mockHealthService,
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('healthCheck', () => {
    it('should return health status', async () => {
      const expectedResult = {
        status: 'ok',
        timestamp: '2023-01-01T00:00:00.000Z',
        dbStatus: 'ok',
        memoryUsage: {
          rss: 1000000,
          heapTotal: 2000000,
          heapUsed: 1500000,
          external: 100000,
        },
        uptime: 3600,
        nodeVersion: 'v18.0.0',
        appVersion: '1.0.0',
      };

      mockHealthService.getHealthStatus.mockResolvedValue(expectedResult);

      const result = await controller.healthCheck();

      expect(result).toBe(expectedResult);
      expect(mockHealthService.getHealthStatus).toHaveBeenCalledTimes(1);
    });

    it('should handle service errors', async () => {
      const error = new Error('Service error');
      mockHealthService.getHealthStatus.mockRejectedValue(error);

      await expect(controller.healthCheck()).rejects.toThrow('Service error');
      expect(mockHealthService.getHealthStatus).toHaveBeenCalledTimes(1);
    });

    it('should return the exact response from service', async () => {
      const serviceResponse = {
        status: 'ok',
        timestamp: '2023-12-25T12:00:00.000Z',
        dbStatus: 'error',
        memoryUsage: { rss: 123456 },
        uptime: 7200,
        nodeVersion: 'v20.0.0',
        appVersion: 'unknown',
      };

      mockHealthService.getHealthStatus.mockResolvedValue(serviceResponse);

      const result = await controller.healthCheck();

      expect(result).toEqual(serviceResponse);
      expect(result).toBe(serviceResponse);
    });
  });
});
