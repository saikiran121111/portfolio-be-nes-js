import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../src/prisma/prisma.service';
import { PrismaClient } from '@prisma/client';

describe('PrismaService', () => {
  let service: PrismaService;
  let connectSpy: jest.SpyInstance;
  let disconnectSpy: jest.SpyInstance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
    
    // Mock the connection methods after service is created
    connectSpy = jest.spyOn(service, '$connect').mockImplementation(() => Promise.resolve());
    disconnectSpy = jest.spyOn(service, '$disconnect').mockImplementation(() => Promise.resolve());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should extend PrismaClient', () => {
    // PrismaService extends PrismaClient, so it should have PrismaClient methods
    expect(typeof service.$connect).toBe('function');
    expect(typeof service.$disconnect).toBe('function');
    expect(typeof service.$queryRaw).toBe('function');
  });

  describe('onModuleInit', () => {
    it('should call $connect', async () => {
      await service.onModuleInit();

      expect(connectSpy).toHaveBeenCalledTimes(1);
    });

    it('should handle connection errors', async () => {
      const error = new Error('Connection failed');
      connectSpy.mockRejectedValue(error);

      await expect(service.onModuleInit()).rejects.toThrow('Connection failed');
      expect(connectSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('onModuleDestroy', () => {
    it('should call $disconnect', async () => {
      await service.onModuleDestroy();

      expect(disconnectSpy).toHaveBeenCalledTimes(1);
    });

    it('should handle disconnection errors', async () => {
      const error = new Error('Disconnection failed');
      disconnectSpy.mockRejectedValue(error);

      await expect(service.onModuleDestroy()).rejects.toThrow('Disconnection failed');
      expect(disconnectSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('constructor', () => {
    it('should initialize with DATABASE_URL from environment', () => {
      const originalEnv = process.env.DATABASE_URL;
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';

      const newService = new PrismaService();

      expect(newService).toBeDefined();

      // Restore original environment
      if (originalEnv) {
        process.env.DATABASE_URL = originalEnv;
      } else {
        delete process.env.DATABASE_URL;
      }
    });
  });

  describe('database operations', () => {
    it('should be able to perform basic query operations', () => {
      // Test that basic PrismaClient functionality is available
      expect(service.user).toBeDefined();
      expect(service.skill).toBeDefined();
      expect(service.experience).toBeDefined();
      expect(service.project).toBeDefined();
      expect(service.education).toBeDefined();
      expect(service.certification).toBeDefined();
      expect(service.achievement).toBeDefined();
      expect(service.language).toBeDefined();
    });

    it('should have $queryRaw method', () => {
      expect(typeof service.$queryRaw).toBe('function');
    });

    it('should have $executeRaw method', () => {
      expect(typeof service.$executeRaw).toBe('function');
    });

    it('should have transaction method', () => {
      expect(typeof service.$transaction).toBe('function');
    });
  });
});
