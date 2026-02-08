import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { KeepAliveService } from '../../src/tasks/keep-alive.service';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('KeepAliveService', () => {
  let service: KeepAliveService;
  let prismaService: jest.Mocked<PrismaService>;
  let loggerLogSpy: jest.SpyInstance;
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
    loggerErrorSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should log startup message and ping database', async () => {
      // Arrange
      prismaService.$queryRaw.mockResolvedValue([{ alive: 1 }]);

      // Act
      await service.onModuleInit();

      // Assert
      expect(loggerLogSpy).toHaveBeenCalledWith('=== KeepAliveService STARTED ===');
      expect(loggerLogSpy).toHaveBeenCalledWith(
        'Database will be pinged every 30 seconds to prevent Supabase from sleeping',
      );
      expect(prismaService.$queryRaw).toHaveBeenCalled();
    });
  });

  describe('pingDb', () => {
    it('should successfully ping the database and log success', async () => {
      // Arrange
      prismaService.$queryRaw.mockResolvedValue([{ alive: 1 }]);

      // Act
      await service.pingDb();

      // Assert
      expect(prismaService.$queryRaw).toHaveBeenCalledWith(['SELECT 1 as alive']);
      expect(loggerLogSpy).toHaveBeenCalledWith(expect.stringContaining('Pinging database at'));
      expect(loggerLogSpy).toHaveBeenCalledWith(expect.stringContaining('SUCCESS'));
      expect(loggerLogSpy).toHaveBeenCalledWith(expect.stringContaining('Database is ALIVE'));
    });

    it('should handle database errors and log error', async () => {
      // Arrange
      const errorMessage = 'Database connection failed';
      const error = new Error(errorMessage);
      prismaService.$queryRaw.mockRejectedValue(error);

      // Act
      await service.pingDb();

      // Assert
      expect(prismaService.$queryRaw).toHaveBeenCalledWith(['SELECT 1 as alive']);
      expect(loggerErrorSpy).toHaveBeenCalledWith(expect.stringContaining('FAILED'));
      expect(loggerErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Database ERROR'));
      expect(loggerErrorSpy).toHaveBeenCalledWith(expect.stringContaining(errorMessage));
    });

    it('should handle non-Error objects and log error', async () => {
      // Arrange
      const errorMessage = 'String error';
      prismaService.$queryRaw.mockRejectedValue(errorMessage);

      // Act
      await service.pingDb();

      // Assert
      expect(prismaService.$queryRaw).toHaveBeenCalledWith(['SELECT 1 as alive']);
      expect(loggerErrorSpy).toHaveBeenCalledWith(expect.stringContaining('FAILED'));
      expect(loggerErrorSpy).toHaveBeenCalledWith(expect.stringContaining(errorMessage));
    });

    it('should handle null/undefined errors gracefully', async () => {
      // Arrange
      prismaService.$queryRaw.mockRejectedValue(null);

      // Act
      await service.pingDb();

      // Assert
      expect(prismaService.$queryRaw).toHaveBeenCalledWith(['SELECT 1 as alive']);
      expect(loggerErrorSpy).toHaveBeenCalledWith(expect.stringContaining('FAILED'));
      expect(loggerErrorSpy).toHaveBeenCalledWith(expect.stringContaining('null'));
    });

    it('should handle database timeout errors', async () => {
      // Arrange
      const timeoutError = new Error('Connection timeout');
      timeoutError.name = 'TimeoutError';
      prismaService.$queryRaw.mockRejectedValue(timeoutError);

      // Act
      await service.pingDb();

      // Assert
      expect(prismaService.$queryRaw).toHaveBeenCalledWith(['SELECT 1 as alive']);
      expect(loggerErrorSpy).toHaveBeenCalledWith(expect.stringContaining('FAILED'));
      expect(loggerErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Connection timeout'));
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
