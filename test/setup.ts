// Test setup file for Jest
// Provide a dummy DATABASE_URL so PrismaClient can be instantiated in tests
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://test:test@localhost:5432/test';

import { Test } from '@nestjs/testing';

// Mock PrismaService for all tests
export const mockPrismaService = {
  user: {
    findFirst: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  skill: {
    findMany: jest.fn(),
    create: jest.fn(),
    createMany: jest.fn(),
  },
  experience: {
    findMany: jest.fn(),
    create: jest.fn(),
    createMany: jest.fn(),
  },
  project: {
    findMany: jest.fn(),
    create: jest.fn(),
    createMany: jest.fn(),
  },
  education: {
    findMany: jest.fn(),
    create: jest.fn(),
    createMany: jest.fn(),
  },
  certification: {
    findMany: jest.fn(),
    create: jest.fn(),
    createMany: jest.fn(),
  },
  achievement: {
    findMany: jest.fn(),
    create: jest.fn(),
    createMany: jest.fn(),
  },
  language: {
    findMany: jest.fn(),
    create: jest.fn(),
    createMany: jest.fn(),
  },
  scanReport: {
    findMany: jest.fn(),
    create: jest.fn(),
    createMany: jest.fn(),
  },
  bottomHeadline: {
    findMany: jest.fn(),
    create: jest.fn(),
    createMany: jest.fn(),
  },
  $queryRaw: jest.fn(),
  $connect: jest.fn(),
  $disconnect: jest.fn(),
  onModuleInit: jest.fn(),
  onModuleDestroy: jest.fn(),
};

// Global test utilities
export const createTestingModule = async (providers: any[] = []) => {
  return Test.createTestingModule({
    providers,
  }).compile();
};

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});
