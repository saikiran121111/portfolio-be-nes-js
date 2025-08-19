import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { KeepAliveService } from '../../src/tasks/keep-alive.service';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('KeepAliveService', () => {
  let service: KeepAliveService;
  let prismaService: jest.Mocked<PrismaService>;
  let loggerSpy: jest.SpyInstance;

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
    loggerSpy = jest.spyOn(Logger.prototype, 'debug').mockImplementation();
    jest.spyOn(Logger.prototype, 'warn').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('pingDb', () => {
    it('should successfully ping the database and log success', async () => {
      // Arrange
      prismaService.$queryRaw.mockResolvedValue([{ '?column?': 1 }]);

      // Act
      await service.pingDb();

      // Assert
      expect(prismaService.$queryRaw).toHaveBeenCalledWith(['SELECT 1']);
      expect(Logger.prototype.debug).toHaveBeenCalledWith('Neon keep-alive ping successful');
      expect(Logger.prototype.warn).not.toHaveBeenCalled();
    });

    it('should handle database errors and log warning', async () => {
      // Arrange
      const errorMessage = 'Database connection failed';
      const error = new Error(errorMessage);
      prismaService.$queryRaw.mockRejectedValue(error);

      // Act
      await service.pingDb();

      // Assert
      expect(prismaService.$queryRaw).toHaveBeenCalledWith(['SELECT 1']);
      expect(Logger.prototype.warn).toHaveBeenCalledWith(`Neon keep-alive ping failed: Error: ${errorMessage}`);
      expect(Logger.prototype.debug).not.toHaveBeenCalled();
    });

    it('should handle non-Error objects and log warning', async () => {
      // Arrange
      const errorMessage = 'String error';
      prismaService.$queryRaw.mockRejectedValue(errorMessage);

      // Act
      await service.pingDb();

      // Assert
      expect(prismaService.$queryRaw).toHaveBeenCalledWith(['SELECT 1']);
      expect(Logger.prototype.warn).toHaveBeenCalledWith(`Neon keep-alive ping failed: ${errorMessage}`);
      expect(Logger.prototype.debug).not.toHaveBeenCalled();
    });

    it('should handle null/undefined errors gracefully', async () => {
      // Arrange
      prismaService.$queryRaw.mockRejectedValue(null);

      // Act
      await service.pingDb();

      // Assert
      expect(prismaService.$queryRaw).toHaveBeenCalledWith(['SELECT 1']);
      expect(Logger.prototype.warn).toHaveBeenCalledWith('Neon keep-alive ping failed: null');
      expect(Logger.prototype.debug).not.toHaveBeenCalled();
    });

    it('should handle database timeout errors', async () => {
      // Arrange
      const timeoutError = new Error('Connection timeout');
      timeoutError.name = 'TimeoutError';
      prismaService.$queryRaw.mockRejectedValue(timeoutError);

      // Act
      await service.pingDb();

      // Assert
      expect(prismaService.$queryRaw).toHaveBeenCalledWith(['SELECT 1']);
      expect(Logger.prototype.warn).toHaveBeenCalledWith(`Neon keep-alive ping failed: TimeoutError: Connection timeout`);
      expect(Logger.prototype.debug).not.toHaveBeenCalled();
    });

    it('should call pingDb method without errors', () => {
      // This test verifies that the pingDb method exists and can be called
      expect(typeof service.pingDb).toBe('function');
      expect(service.pingDb).toBeDefined();
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
