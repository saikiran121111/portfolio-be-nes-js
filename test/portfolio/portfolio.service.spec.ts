import { Test, TestingModule } from '@nestjs/testing';
import { PortfolioService } from '../../src/portfolio/portfolio.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { mockPrismaService } from '../setup';
import { mapPortfolioFromDb } from '../../src/portfolio/mapper/portfolio.mapper';
import { mapAdminPortfolioFromDb } from '../../src/portfolio/mapper/admin-portfolio.mapper';

// Mock the mapper function
jest.mock('../../src/portfolio/mapper/portfolio.mapper', () => ({
  mapPortfolioFromDb: jest.fn(),
}));
jest.mock('../../src/portfolio/mapper/admin-portfolio.mapper', () => ({
  mapAdminPortfolioFromDb: jest.fn(),
}));

const mockMapPortfolioFromDb = mapPortfolioFromDb as jest.MockedFunction<
  typeof mapPortfolioFromDb
>;
const mockMapAdminPortfolioFromDb =
  mapAdminPortfolioFromDb as jest.MockedFunction<typeof mapAdminPortfolioFromDb>;

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

  const mockAdminUser = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    password: 'secret',
    avatarUrl: null,
    headline: 'Software Developer',
    summary: 'Experienced developer',
    copyrights: 'Â© 2023 John Doe',
    location: 'New York',
    phone: '+1234567890',
    socials: { github: 'johndoe', linkedin: 'johndoe' },
    createdAt: new Date('2025-01-01T00:00:00.000Z'),
    updatedAt: new Date('2025-01-01T00:00:00.000Z'),
    skills: [
      {
        id: 10,
        userId: 1,
        name: 'TypeScript',
        category: 'Backend',
        level: 'Advanced',
        order: 0,
      },
    ],
    experiences: [
      {
        id: 11,
        userId: 1,
        title: 'Senior Developer',
        company: 'Acme',
        location: 'Remote',
        startDate: new Date('2024-01-01T00:00:00.000Z'),
        endDate: null,
        description: 'Building APIs',
        bullets: ['Built internal tooling'],
        techStack: ['TypeScript'],
        order: 0,
        createdAt: new Date('2025-01-01T00:00:00.000Z'),
        updatedAt: new Date('2025-01-01T00:00:00.000Z'),
      },
    ],
    projects: [
      {
        id: 12,
        userId: 1,
        title: 'Portfolio',
        description: 'Personal site',
        repoUrl: 'https://github.com/example/portfolio',
        liveUrl: 'https://example.com',
        tech: ['Next.js'],
        highlights: ['SEO'],
        startDate: new Date('2024-01-01T00:00:00.000Z'),
        endDate: null,
        order: 0,
        createdAt: new Date('2025-01-01T00:00:00.000Z'),
        updatedAt: new Date('2025-01-01T00:00:00.000Z'),
      },
    ],
    education: [
      {
        id: 13,
        userId: 1,
        institution: 'XYZ University',
        degree: 'B.Tech',
        field: 'Computer Science',
        startDate: new Date('2015-06-01T00:00:00.000Z'),
        endDate: new Date('2019-04-30T00:00:00.000Z'),
        location: 'Hyderabad',
        description: 'Studied CS',
        order: 0,
      },
    ],
    certifications: [
      {
        id: 14,
        userId: 1,
        title: 'AWS Certified',
        issuer: 'AWS',
        date: new Date('2024-03-01T00:00:00.000Z'),
        link: 'https://aws.amazon.com',
        order: 0,
      },
    ],
    achievements: [
      {
        id: 15,
        userId: 1,
        title: 'Employee of the Month',
        date: new Date('2024-04-01T00:00:00.000Z'),
        link: 'https://example.com/award',
        order: 0,
      },
    ],
    languages: [{ id: 16, userId: 1, name: 'English', level: 'Fluent' }],
    scanReports: [
      {
        id: 17,
        userId: 1,
        type: 'coverage',
        commitSha: 'abc123',
        runAt: new Date('2025-01-01T10:00:00.000Z'),
        summary: { coverage: 97 },
        artifactUrl: 'https://example.com/report',
      },
    ],
    bottomHeadlines: [{ id: 18, userId: 1, text: 'Open to work', order: 0 }],
    repoData: {
      id: 19,
      userId: 1,
      nestJSGitRepo: 'https://github.com/example/nest',
      nestJSDeployedServer: 'https://api.example.com',
      nestJSSwaggerUrl: 'https://api.example.com/swagger',
      nextJSGitRepo: 'https://github.com/example/next',
      nextJSDeployedServer: 'https://example.com',
      postgresDeployedServer: 'https://db.example.com',
      createdAt: new Date('2025-01-01T00:00:00.000Z'),
      updatedAt: new Date('2025-01-01T00:00:00.000Z'),
    },
  };

  const mockAdminPortfolio = {
    user: {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      avatarUrl: null,
      headline: 'Software Developer',
      summary: 'Experienced developer',
      copyrights: 'Â© 2023 John Doe',
      location: 'New York',
      phone: '+1234567890',
      socials: {
        github: 'johndoe',
        linkedin: 'johndoe',
        portfolio: null,
      },
    },
    repoData: {
      nestJSGitRepo: 'https://github.com/example/nest',
      nestJSDeployedServer: 'https://api.example.com',
      nestJSSwaggerUrl: 'https://api.example.com/swagger',
      nextJSGitRepo: 'https://github.com/example/next',
      nextJSDeployedServer: 'https://example.com',
      postgresDeployedServer: 'https://db.example.com',
    },
    bottomHeadlines: [{ id: 18, text: 'Open to work', order: 0 }],
    skills: [
      {
        id: 10,
        name: 'TypeScript',
        category: 'Backend',
        level: 'Advanced',
        order: 0,
      },
    ],
    experiences: [
      {
        id: 11,
        title: 'Senior Developer',
        company: 'Acme',
        location: 'Remote',
        startDate: '2024-01-01',
        endDate: null,
        description: 'Building APIs',
        bullets: ['Built internal tooling'],
        techStack: ['TypeScript'],
        order: 0,
      },
    ],
    projects: [
      {
        id: 12,
        title: 'Portfolio',
        description: 'Personal site',
        repoUrl: 'https://github.com/example/portfolio',
        liveUrl: 'https://example.com',
        tech: ['Next.js'],
        highlights: ['SEO'],
        startDate: '2024-01-01',
        endDate: null,
        order: 0,
      },
    ],
    education: [
      {
        id: 13,
        institution: 'XYZ University',
        degree: 'B.Tech',
        field: 'Computer Science',
        startDate: '2015-06-01',
        endDate: '2019-04-30',
        location: 'Hyderabad',
        description: 'Studied CS',
        order: 0,
      },
    ],
    certifications: [
      {
        id: 14,
        title: 'AWS Certified',
        issuer: 'AWS',
        date: '2024-03-01',
        link: 'https://aws.amazon.com',
        order: 0,
      },
    ],
    achievements: [
      {
        id: 15,
        title: 'Employee of the Month',
        date: '2024-04-01',
        link: 'https://example.com/award',
        order: 0,
      },
    ],
    languages: [{ id: 16, name: 'English', level: 'Fluent' }],
    scanReports: [
      {
        id: 17,
        type: 'coverage',
        commitSha: 'abc123',
        runAt: '2025-01-01T10:00:00.000Z',
        summary: { coverage: 97 },
        artifactUrl: 'https://example.com/report',
      },
    ],
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

  describe('getAdminPortfolio', () => {
    it('should return mapped admin portfolio when user exists', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(mockAdminUser);
      mockMapAdminPortfolioFromDb.mockReturnValue(mockAdminPortfolio as never);

      const result = await service.getAdminPortfolio();

      expect(result).toBe(mockAdminPortfolio);
      expect(mockPrismaService.user.findFirst).toHaveBeenCalledWith({
        include: {
          skills: { orderBy: { order: 'asc' } },
          experiences: { orderBy: { order: 'asc' } },
          projects: { orderBy: { order: 'asc' } },
          education: { orderBy: { order: 'asc' } },
          certifications: { orderBy: { order: 'asc' } },
          achievements: { orderBy: { order: 'asc' } },
          languages: { orderBy: { id: 'asc' } },
          scanReports: { orderBy: { runAt: 'desc' } },
          bottomHeadlines: { orderBy: { order: 'asc' } },
          repoData: true,
        },
      });
      expect(mockMapAdminPortfolioFromDb).toHaveBeenCalledWith(mockAdminUser);
    });

    it('should return null when there is no admin portfolio user', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(null);

      const result = await service.getAdminPortfolio();

      expect(result).toBeNull();
    });
  });

  describe('saveAdminPortfolio', () => {
    it('should replace and return the updated admin portfolio payload', async () => {
      mockPrismaService.user.findFirst.mockResolvedValueOnce({ id: 1 });
      mockPrismaService.$transaction.mockImplementation(async (callback) =>
        callback(mockPrismaService as never),
      );
      mockPrismaService.repoData.findUnique.mockResolvedValue({ id: 19 });
      mockPrismaService.user.findUnique.mockResolvedValue(mockAdminUser);
      mockMapAdminPortfolioFromDb.mockReturnValue(mockAdminPortfolio as never);

      const result = await service.saveAdminPortfolio(mockAdminPortfolio as never);

      expect(mockPrismaService.$transaction).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: expect.objectContaining({
          name: 'John Doe',
          email: 'john@example.com',
          headline: 'Software Developer',
        }),
      });
      expect(mockPrismaService.repoData.update).toHaveBeenCalledWith({
        where: { userId: 1 },
        data: expect.objectContaining({
          nestJSGitRepo: 'https://github.com/example/nest',
          nextJSDeployedServer: 'https://example.com',
        }),
      });
      expect(mockPrismaService.bottomHeadline.deleteMany).toHaveBeenCalledWith({
        where: { userId: 1 },
      });
      expect(mockPrismaService.bottomHeadline.createMany).toHaveBeenCalledWith({
        data: [
          {
            userId: 1,
            text: 'Open to work',
            order: 0,
          },
        ],
      });
      expect(mockPrismaService.skill.createMany).toHaveBeenCalledWith({
        data: [
          {
            userId: 1,
            name: 'TypeScript',
            category: 'Backend',
            level: 'Advanced',
            order: 0,
          },
        ],
      });
      expect(mockPrismaService.scanReport.createMany).toHaveBeenCalledWith({
        data: [
          expect.objectContaining({
            userId: 1,
            type: 'coverage',
            commitSha: 'abc123',
            artifactUrl: 'https://example.com/report',
          }),
        ],
      });
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          skills: { orderBy: { order: 'asc' } },
          experiences: { orderBy: { order: 'asc' } },
          projects: { orderBy: { order: 'asc' } },
          education: { orderBy: { order: 'asc' } },
          certifications: { orderBy: { order: 'asc' } },
          achievements: { orderBy: { order: 'asc' } },
          languages: { orderBy: { id: 'asc' } },
          scanReports: { orderBy: { runAt: 'desc' } },
          bottomHeadlines: { orderBy: { order: 'asc' } },
          repoData: true,
        },
      });
      expect(result).toBe(mockAdminPortfolio);
      expect(mockMapAdminPortfolioFromDb).toHaveBeenCalledWith(mockAdminUser);
    });
  });
});
