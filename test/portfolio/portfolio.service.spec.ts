import { Test, TestingModule } from '@nestjs/testing';
import { PortfolioService } from '../../src/portfolio/portfolio.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { mockPrismaService } from '../setup';
import { mapPortfolioFromDb } from '../../src/portfolio/mapper/portfolio.mapper';

// Mock the mapper function
jest.mock('../../src/portfolio/mapper/portfolio.mapper', () => ({
  mapPortfolioFromDb: jest.fn(),
}));

const mockMapPortfolioFromDb = mapPortfolioFromDb as jest.MockedFunction<
  typeof mapPortfolioFromDb
>;

describe('PortfolioService', () => {
  let service: PortfolioService;

  const mockUser = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    headline: 'Software Developer',
    summary: 'Experienced developer',
    copyrights: '© 2023 John Doe',
    location: 'New York',
    phone: '+1234567890',
    socials: { github: 'johndoe', linkedin: 'johndoe' },
    skills: [],
    experiences: [],
    projects: [],
    education: [],
    certifications: [],
    achievements: [],
    languages: [],
    scanReports: [],
    bottomHeadlines: [],
    repoData: {
      nestJSGitRepo: 'https://github.com/john/nestjs',
      nestJSDeployedServer: 'https://api.johndoe.com',
      nestJSSwaggerUrl: 'https://api.johndoe.com/swagger',
      nextJSGitRepo: 'https://github.com/john/nextjs',
      nextJSDeployedServer: 'https://johndoe.com',
      postgresDeployedServer: 'https://db.johndoe.com',
    },
  };

  const mockMappedPortfolio = {
    name: 'John Doe',
    email: 'john@example.com',
    headline: 'Software Developer',
    skills: [],
    experiences: [],
    projects: [],
    education: [],
    certifications: [],
    achievements: [],
    languages: [],
    scanReports: [],
    bottomHeadline: [],
    toolDocs: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PortfolioService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<PortfolioService>(PortfolioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPortfolioV2', () => {
    it('should return mapped portfolio when user exists', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(mockUser);
      mockMapPortfolioFromDb.mockReturnValue(mockMappedPortfolio);

      const result = await service.getPortfolioV2();

      expect(result).toBe(mockMappedPortfolio);
      expect(mockPrismaService.user.findFirst).toHaveBeenCalledWith({
        include: {
          skills: true,
          experiences: true,
          projects: true,
          education: true,
          certifications: true,
          achievements: true,
          languages: true,
          scanReports: true,
          bottomHeadlines: { orderBy: { order: 'asc' } },
          repoData: {
            select: {
              nestJSGitRepo: true,
              nestJSDeployedServer: true,
              nestJSSwaggerUrl: true,
              nextJSGitRepo: true,
              nextJSDeployedServer: true,
              postgresDeployedServer: true,
            },
          },
        },
      });
      expect(mapPortfolioFromDb).toHaveBeenCalledWith(mockUser);
    });

    it('should return null when no user is found', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(null);

      const result = await service.getPortfolioV2();

      expect(result).toBeNull();
      expect(mockPrismaService.user.findFirst).toHaveBeenCalledWith({
        include: {
          skills: true,
          experiences: true,
          projects: true,
          education: true,
          certifications: true,
          achievements: true,
          languages: true,
          scanReports: true,
          bottomHeadlines: { orderBy: { order: 'asc' } },
          repoData: {
            select: {
              nestJSGitRepo: true,
              nestJSDeployedServer: true,
              nestJSSwaggerUrl: true,
              nextJSGitRepo: true,
              nextJSDeployedServer: true,
              postgresDeployedServer: true,
            },
          },
        },
      });
    });

    it('should handle database errors', async () => {
      const error = new Error('Database error');
      mockPrismaService.user.findFirst.mockRejectedValue(error);

      await expect(service.getPortfolioV2()).rejects.toThrow('Database error');
    });
  });

  describe('getPortfolioV1', () => {
    it('should return raw user data with includes', async () => {
      // Create a version without repoData for V1 API
      const userV1Data = Object.fromEntries(
        Object.entries(mockUser).filter(([key]) => key !== 'repoData'),
      );

      mockPrismaService.user.findFirst.mockResolvedValue(userV1Data);

      const result = await service.getPortfolioV1();

      expect(result).toBe(userV1Data);
      expect(mockPrismaService.user.findFirst).toHaveBeenCalledWith({
        include: {
          skills: true,
          experiences: true,
          projects: true,
          education: true,
          certifications: true,
          achievements: true,
          languages: true,
          scanReports: true,
          bottomHeadlines: { orderBy: { order: 'asc' } },
        },
      });
    });

    it('should return null when user does not exist', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(null);

      const result = await service.getPortfolioV1();

      expect(result).toBeNull();
      expect(mockPrismaService.user.findFirst).toHaveBeenCalledTimes(1);
    });

    it('should handle database errors', async () => {
      const error = new Error('Database error');
      mockPrismaService.user.findFirst.mockRejectedValue(error);

      await expect(service.getPortfolioV1()).rejects.toThrow('Database error');
    });
  });
});
