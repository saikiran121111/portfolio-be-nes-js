import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { KeepAliveService } from '../../src/tasks/keep-alive.service';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('KeepAliveService', () => {
  let service: KeepAliveService;
  let prismaService: jest.Mocked<PrismaService>;
  let loggerLogSpy: jest.SpyInstance;
  let loggerWarnSpy: jest.SpyInstance;
  let loggerErrorSpy: jest.SpyInstance;

  beforeEach(async () => {
    const mockPrismaService = {
      $queryRaw: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KeepAliveService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<KeepAliveService>(KeepAliveService);
    prismaService = module.get(PrismaService);

    // Spy on logger methods
    loggerLogSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation();
    loggerWarnSpy = jest.spyOn(Logger.prototype, 'warn').mockImplementation();
    loggerErrorSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
    // Clean up any pending timers
    service.onModuleDestroy();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should log startup messages and ping database', async () => {
      // Arrange
      prismaService.$queryRaw.mockResolvedValue([{ alive: 1 }]);

      // Act
      await service.onModuleInit();

      // Assert
      expect(loggerLogSpy).toHaveBeenCalledWith('=== KeepAliveService STARTED ===');
      expect(loggerLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('every 3 days'),
      );
      expect(loggerLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('every 24 hours'),
      );
      expect(prismaService.$queryRaw).toHaveBeenCalled();
    });
  });

  describe('pingDb', () => {
    it('should return true and log success when database is alive', async () => {
      // Arrange
      prismaService.$queryRaw.mockResolvedValue([{ alive: 1 }]);

      // Act
      const result = await service.pingDb();

      // Assert
      expect(result).toBe(true);
      expect(prismaService.$queryRaw).toHaveBeenCalledWith(['SELECT 1 as alive']);
      expect(loggerLogSpy).toHaveBeenCalledWith(expect.stringContaining('Pinging database at'));
      expect(loggerLogSpy).toHaveBeenCalledWith(expect.stringContaining('SUCCESS'));
      expect(loggerLogSpy).toHaveBeenCalledWith(expect.stringContaining('Database is ALIVE'));
    });

    it('should return false and log error when database is down', async () => {
      // Arrange
      const errorMessage = 'Database connection failed';
      prismaService.$queryRaw.mockRejectedValue(new Error(errorMessage));

      // Act
      const result = await service.pingDb();

      // Assert
      expect(result).toBe(false);
      expect(loggerErrorSpy).toHaveBeenCalledWith(expect.stringContaining('FAILED'));
      expect(loggerErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Database ERROR'));
      expect(loggerErrorSpy).toHaveBeenCalledWith(expect.stringContaining(errorMessage));
    });

    it('should handle non-Error objects and log error', async () => {
      // Arrange
      const errorMessage = 'String error';
      prismaService.$queryRaw.mockRejectedValue(errorMessage);

      // Act
      const result = await service.pingDb();

      // Assert
      expect(result).toBe(false);
      expect(loggerErrorSpy).toHaveBeenCalledWith(expect.stringContaining('FAILED'));
      expect(loggerErrorSpy).toHaveBeenCalledWith(expect.stringContaining(errorMessage));
    });

    it('should handle null/undefined errors gracefully', async () => {
      // Arrange
      prismaService.$queryRaw.mockRejectedValue(null);

      // Act
      const result = await service.pingDb();

      // Assert
      expect(result).toBe(false);
      expect(loggerErrorSpy).toHaveBeenCalledWith(expect.stringContaining('FAILED'));
      expect(loggerErrorSpy).toHaveBeenCalledWith(expect.stringContaining('null'));
    });

    it('should log timestamp and response time', async () => {
      // Arrange
      prismaService.$queryRaw.mockResolvedValue([{ alive: 1 }]);

      // Act
      await service.pingDb();

      // Assert
      expect(loggerLogSpy).toHaveBeenCalledWith(expect.stringContaining('Pinging database at'));
      expect(loggerLogSpy).toHaveBeenCalledWith(expect.stringContaining('Response time:'));
    });
  });

  describe('checkDatabaseHealth', () => {
    it('should not retry when database is alive', async () => {
      // Arrange
      prismaService.$queryRaw.mockResolvedValue([{ alive: 1 }]);

      // Act
      await service.checkDatabaseHealth();

      // Assert — only 1 ping call (no retries)
      expect(prismaService.$queryRaw).toHaveBeenCalledTimes(1);
      expect(loggerWarnSpy).not.toHaveBeenCalledWith(
        expect.stringContaining('Database is DOWN'),
      );
    });

    it('should start retry loop when database is down', async () => {
      // Arrange — fail first, then succeed on retry
      prismaService.$queryRaw
        .mockRejectedValueOnce(new Error('DB down'))
        .mockResolvedValueOnce([{ alive: 1 }]);

      // Mock delay to be instant
      jest.spyOn(service as any, 'delay').mockResolvedValue(undefined);

      // Act
      await service.checkDatabaseHealth();

      // Assert
      expect(loggerWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Database is DOWN'),
      );
      expect(prismaService.$queryRaw).toHaveBeenCalledTimes(2);
      expect(loggerLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('Database recovered after 1 retry attempt(s)'),
      );
    });

    it('should retry multiple times before recovery', async () => {
      // Arrange — fail 3 times, then succeed
      prismaService.$queryRaw
        .mockRejectedValueOnce(new Error('DB down'))
        .mockRejectedValueOnce(new Error('DB down'))
        .mockRejectedValueOnce(new Error('DB down'))
        .mockResolvedValueOnce([{ alive: 1 }]);

      jest.spyOn(service as any, 'delay').mockResolvedValue(undefined);

      // Act
      await service.checkDatabaseHealth();

      // Assert — 1 initial + 3 retries before success on 4th
      expect(prismaService.$queryRaw).toHaveBeenCalledTimes(4);
      expect(loggerLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('Database recovered after 3 retry attempt(s)'),
      );
    });

    it('should give up after max retry attempts', async () => {
      // Arrange — always fail
      prismaService.$queryRaw.mockRejectedValue(new Error('DB permanently down'));

      jest.spyOn(service as any, 'delay').mockResolvedValue(undefined);

      // Act
      await service.checkDatabaseHealth();

      // Assert — 1 initial + 10 retries = 11 total
      expect(prismaService.$queryRaw).toHaveBeenCalledTimes(11);
      expect(loggerErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Database still DOWN after 10 retries'),
      );
    });
  });

  describe('onModuleDestroy', () => {
    it('should clean up retry timer', () => {
      // Arrange — set a fake timer
      service['retryTimer'] = setTimeout(() => { }, 100000);

      // Act
      service.onModuleDestroy();

      // Assert
      expect(service['retryTimer']).toBeNull();
    });

    it('should handle no timer gracefully', () => {
      // Act & Assert — should not throw
      expect(() => service.onModuleDestroy()).not.toThrow();
    });
  });

  describe('constructor', () => {
    it('should initialize with PrismaService dependency', () => {
      expect(service).toHaveProperty('prisma');
      expect(service['prisma']).toBe(prismaService);
    });

    it('should initialize logger with correct service name', () => {
      expect(service['logger']).toBeDefined();
      expect(service['logger']).toBeInstanceOf(Logger);
    });
  });
});
