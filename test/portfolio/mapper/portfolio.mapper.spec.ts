import { mapPortfolioFromDb } from '../../../src/portfolio/mapper/portfolio.mapper';
import { getOrderedToolDocs } from '../../../src/portfolio/toolsConstants/constants';

// Mock the getOrderedToolDocs function
jest.mock('../../../src/portfolio/toolsConstants/constants', () => ({
  getOrderedToolDocs: jest.fn(),
}));

const mockGetOrderedToolDocs = getOrderedToolDocs as jest.MockedFunction<
  typeof getOrderedToolDocs
>;

describe('Portfolio Mapper', () => {
  const mockToolDocs = [
    {
      key: 'test-tool',
      title: 'Test Tool',
      icon: 'TestIcon',
      summary: 'Test summary',
      content: 'Test content',
      order: 1,
    },
  ];

  beforeEach(() => {
    mockGetOrderedToolDocs.mockReturnValue(mockToolDocs);
  });

  describe('mapPortfolioFromDb', () => {
    // Type alias for cleaner test code
    type UserInput = Parameters<typeof mapPortfolioFromDb>[0];

    // Create a simplified mock type that includes the essential fields
    const createMockUser = (overrides = {}): UserInput =>
      ({
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'admin',
        password: 'hashed',
        avatarUrl: null,
        headline: 'Software Developer',
        summary: 'Experienced developer',
        copyrights: '© 2023 John Doe',
        location: 'New York',
        phone: '+1234567890',
        socials: {
          github: 'johndoe',
          linkedin: 'johndoe',
          portfolio: 'https://johndoe.com',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        skills: [],
        experiences: [],
        projects: [],
        education: [],
        certifications: [],
        achievements: [],
        languages: [],
        scanReports: [],
        bottomHeadlines: [],
        repoData: null,
        ...overrides,
      }) as UserInput;

    it('should map basic user data correctly', () => {
      const mockUser = createMockUser();
      const result = mapPortfolioFromDb(mockUser);

      expect(result.name).toBe('John Doe');
      expect(result.email).toBe('john@example.com');
      expect(result.headline).toBe('Software Developer');
      expect(result.summary).toBe('Experienced developer');
      expect(result.copyrights).toBe('© 2023 John Doe');
      expect(result.location).toBe('New York');
      expect(result.phone).toBe('+1234567890');
      expect(result.toolDocs).toBe(mockToolDocs);
    });

    it('should handle null optional fields', () => {
      const mockUser = createMockUser({
        headline: null,
        summary: null,
        copyrights: null,
        location: null,
        phone: null,
        socials: null,
      });

      const result = mapPortfolioFromDb(mockUser);

      expect(result.headline).toBeUndefined();
      expect(result.summary).toBeUndefined();
      expect(result.copyrights).toBeUndefined();
      expect(result.location).toBeUndefined();
      expect(result.phone).toBeUndefined();
      expect(result.socials).toBeUndefined();
    });

    it('should map socials correctly', () => {
      const mockUser = createMockUser({
        socials: {
          github: 'johndoe',
          linkedin: 'johndoe-linkedin',
          portfolio: 'https://johndoe.com',
        },
      });

      const result = mapPortfolioFromDb(mockUser);

      expect(result.socials).toEqual({
        github: 'johndoe',
        linkedin: 'johndoe-linkedin',
        portfolio: 'https://johndoe.com',
      });
    });

    it('should handle invalid socials data', () => {
      const mockUser = createMockUser({
        socials: 'invalid-json',
      });

      const result = mapPortfolioFromDb(mockUser);
      expect(result.socials).toBeUndefined();
    });

    it('should handle invalid JSON in socials data', () => {
      const mockUser = createMockUser({
        socials: '{invalid-json',
      });

      const result = mapPortfolioFromDb(mockUser);
      expect(result.socials).toBeUndefined();
    });

    it('should handle empty object socials data', () => {
      const mockUser = createMockUser({
        socials: {},
      });

      const result = mapPortfolioFromDb(mockUser);
      expect(result.socials).toEqual({
        github: undefined,
        linkedin: undefined,
        portfolio: undefined,
      });
    });

    it('should handle array socials data', () => {
      const mockUser = createMockUser({
        socials: ['invalid', 'array'],
      });

      const result = mapPortfolioFromDb(mockUser);
      expect(result.socials).toBeUndefined();
    });

    it('should map repo data when available', () => {
      const mockUser = createMockUser({
        repoData: {
          nestJSGitRepo: 'https://github.com/johndoe/nestjs-api',
          nestJSDeployedServer: 'https://api.johndoe.com',
          nestJSSwaggerUrl: 'https://api.johndoe.com/swagger',
          nextJSGitRepo: 'https://github.com/johndoe/nextjs-frontend',
          nextJSDeployedServer: 'https://johndoe.com',
          postgresDeployedServer: 'https://db.johndoe.com',
        },
      });

      const result = mapPortfolioFromDb(mockUser);

      expect(result.nestJSGitRepo).toBe(
        'https://github.com/johndoe/nestjs-api',
      );
      expect(result.nestJSDeployedServer).toBe('https://api.johndoe.com');
      expect(result.nestJSSwaggerUrl).toBe('https://api.johndoe.com/swagger');
      expect(result.nextJSGitRepo).toBe(
        'https://github.com/johndoe/nextjs-frontend',
      );
      expect(result.nextJSDeployedServer).toBe('https://johndoe.com');
      expect(result.postgresDeployedServer).toBe('https://db.johndoe.com');
    });

    it('should handle null repo data', () => {
      const mockUser = createMockUser({
        repoData: null,
      });

      const result = mapPortfolioFromDb(mockUser);

      expect(result.nestJSGitRepo).toBeUndefined();
      expect(result.nestJSDeployedServer).toBeUndefined();
      expect(result.nestJSSwaggerUrl).toBeUndefined();
      expect(result.nextJSGitRepo).toBeUndefined();
      expect(result.nextJSDeployedServer).toBeUndefined();
      expect(result.postgresDeployedServer).toBeUndefined();
    });

    it('should map bottom headlines correctly', () => {
      const mockUser = createMockUser({
        bottomHeadlines: [
          { text: 'First headline', order: 1 },
          { text: 'Second headline', order: 2 },
        ],
      });

      const result = mapPortfolioFromDb(mockUser);
      expect(result.bottomHeadline).toEqual([
        'First headline',
        'Second headline',
      ]);
    });

    it('should handle empty bottom headlines', () => {
      const mockUser = createMockUser({
        bottomHeadlines: [],
      });

      const result = mapPortfolioFromDb(mockUser);
      expect(result.bottomHeadline).toBeUndefined();
    });

    it('should map empty arrays correctly', () => {
      const mockUser = createMockUser();
      const result = mapPortfolioFromDb(mockUser);

      expect(result.skills).toEqual([]);
      expect(result.experiences).toEqual([]);
      expect(result.projects).toEqual([]);
      expect(result.education).toEqual([]);
      expect(result.certifications).toEqual([]);
      expect(result.achievements).toEqual([]);
      expect(result.languages).toEqual([]);
      expect(result.scanReports).toEqual([]);
    });

    it('should call getOrderedToolDocs', () => {
      const mockUser = createMockUser();
      mapPortfolioFromDb(mockUser);
      expect(getOrderedToolDocs).toHaveBeenCalledTimes(1);
    });

    it('should include toolDocs in result', () => {
      const mockUser = createMockUser();
      const result = mapPortfolioFromDb(mockUser);
      expect(result.toolDocs).toBe(mockToolDocs);
    });

    // Test all individual mapping functions by including them in the main function
    it('should map skills correctly', () => {
      const mockUser = createMockUser({
        skills: [
          {
            id: 1,
            name: 'JavaScript',
            category: 'Programming',
            level: 'advanced',
            userId: 1,
            order: 1,
          },
          {
            id: 2,
            name: 'Python',
            category: 'Programming',
            level: 'beginner', // Test default level mapping
            userId: 1,
            order: 2,
          },
        ],
      });

      const result = mapPortfolioFromDb(mockUser);
      expect(result.skills).toEqual([
        {
          name: 'JavaScript',
          category: 'Programming',
          level: 'advanced',
        },
        {
          name: 'Python',
          category: 'Programming',
          level: 'beginner',
        },
      ]);
    });

    it('should map experiences correctly', () => {
      const mockUser = createMockUser({
        experiences: [
          {
            id: 1,
            title: 'Senior Developer',
            company: 'Tech Corp',
            location: 'San Francisco',
            startDate: new Date('2020-01-01'),
            endDate: new Date('2023-01-01'),
            description: 'Developed applications',
            bullets: ['Built APIs', 'Managed team'],
            techStack: ['Node.js', 'React'],
            userId: 1,
          },
          {
            id: 2,
            title: 'Junior Developer',
            company: 'Startup Inc',
            location: 'Remote',
            startDate: new Date('2018-01-01'),
            endDate: new Date('2020-01-01'),
            description: 'Learned development',
            bullets: null, // Test null bullets
            techStack: null, // Test null techStack
            userId: 1,
          },
        ],
      });

      const result = mapPortfolioFromDb(mockUser);
      expect(result.experiences).toEqual([
        {
          title: 'Senior Developer',
          company: 'Tech Corp',
          location: 'San Francisco',
          startDate: new Date('2020-01-01'),
          endDate: new Date('2023-01-01'),
          description: 'Developed applications',
          bullets: ['Built APIs', 'Managed team'],
          techStack: ['Node.js', 'React'],
        },
        {
          title: 'Junior Developer',
          company: 'Startup Inc',
          location: 'Remote',
          startDate: new Date('2018-01-01'),
          endDate: new Date('2020-01-01'),
          description: 'Learned development',
          bullets: [],
          techStack: [],
        },
      ]);
    });

    it('should map projects correctly', () => {
      const mockUser = createMockUser({
        projects: [
          {
            id: 1,
            title: 'Portfolio Website',
            description: 'Personal portfolio',
            repoUrl: 'https://github.com/user/portfolio',
            liveUrl: 'https://portfolio.com',
            tech: ['React', 'TypeScript'],
            highlights: ['Responsive design', 'SEO optimized'],
            startDate: new Date('2023-01-01'),
            endDate: new Date('2023-06-01'),
            userId: 1,
          },
          {
            id: 2,
            title: 'API Service',
            description: 'REST API',
            repoUrl: 'https://github.com/user/api',
            liveUrl: 'https://api.service.com',
            tech: null, // Test null tech
            highlights: null, // Test null highlights
            startDate: new Date('2022-01-01'),
            endDate: new Date('2022-12-01'),
            userId: 1,
          },
        ],
      });

      const result = mapPortfolioFromDb(mockUser);
      expect(result.projects).toEqual([
        {
          title: 'Portfolio Website',
          description: 'Personal portfolio',
          repoUrl: 'https://github.com/user/portfolio',
          liveUrl: 'https://portfolio.com',
          tech: ['React', 'TypeScript'],
          highlights: ['Responsive design', 'SEO optimized'],
          startDate: new Date('2023-01-01'),
          endDate: new Date('2023-06-01'),
        },
        {
          title: 'API Service',
          description: 'REST API',
          repoUrl: 'https://github.com/user/api',
          liveUrl: 'https://api.service.com',
          tech: [],
          highlights: [],
          startDate: new Date('2022-01-01'),
          endDate: new Date('2022-12-01'),
        },
      ]);
    });

    it('should map education correctly', () => {
      const mockUser = createMockUser({
        education: [
          {
            id: 1,
            institution: 'University of Tech',
            degree: 'Bachelor of Science',
            field: 'Computer Science',
            startDate: new Date('2014-09-01'),
            endDate: new Date('2018-05-01'),
            description: 'Computer Science program',
            userId: 1,
          },
          {
            id: 2,
            institution: 'Community College',
            degree: 'Associate',
            field: 'Programming',
            startDate: new Date('2012-09-01'),
            endDate: new Date('2014-05-01'),
            description: null, // Test null description
            userId: 1,
          },
        ],
      });

      const result = mapPortfolioFromDb(mockUser);
      expect(result.education).toEqual([
        {
          institution: 'University of Tech',
          degree: 'Bachelor of Science',
          field: 'Computer Science',
          startDate: new Date('2014-09-01'),
          endDate: new Date('2018-05-01'),
          description: 'Computer Science program',
        },
        {
          institution: 'Community College',
          degree: 'Associate',
          field: 'Programming',
          startDate: new Date('2012-09-01'),
          endDate: new Date('2014-05-01'),
          description: null,
        },
      ]);
    });

    it('should map certifications correctly', () => {
      const mockUser = createMockUser({
        certifications: [
          {
            id: 1,
            title: 'AWS Certified',
            issuer: 'Amazon',
            date: new Date('2023-01-01'),
            link: 'https://aws.amazon.com/cert',
            userId: 1,
          },
          {
            id: 2,
            title: 'React Developer',
            issuer: 'Meta',
            date: new Date('2022-01-01'),
            link: null, // Test null link
            userId: 1,
          },
        ],
      });

      const result = mapPortfolioFromDb(mockUser);
      expect(result.certifications).toEqual([
        {
          title: 'AWS Certified',
          issuer: 'Amazon',
          date: new Date('2023-01-01'),
          link: 'https://aws.amazon.com/cert',
        },
        {
          title: 'React Developer',
          issuer: 'Meta',
          date: new Date('2022-01-01'),
          link: null,
        },
      ]);
    });

    it('should map achievements correctly', () => {
      const mockUser = createMockUser({
        achievements: [
          {
            id: 1,
            title: 'Best Developer Award',
            date: new Date('2023-01-01'),
            link: 'https://awards.com/best-dev',
            userId: 1,
          },
          {
            id: 2,
            title: 'Hackathon Winner',
            date: new Date('2022-01-01'),
            link: null, // Test null link
            userId: 1,
          },
        ],
      });

      const result = mapPortfolioFromDb(mockUser);
      expect(result.achievements).toEqual([
        {
          title: 'Best Developer Award',
          date: new Date('2023-01-01'),
          link: 'https://awards.com/best-dev',
        },
        {
          title: 'Hackathon Winner',
          date: new Date('2022-01-01'),
          link: null,
        },
      ]);
    });

    it('should map languages correctly', () => {
      const mockUser = createMockUser({
        languages: [
          {
            id: 1,
            name: 'English',
            level: 'native',
            userId: 1,
          },
          {
            id: 2,
            name: 'Spanish',
            level: 'intermediate',
            userId: 1,
          },
        ],
      });

      const result = mapPortfolioFromDb(mockUser);
      expect(result.languages).toEqual([
        {
          name: 'English',
          level: 'native',
        },
        {
          name: 'Spanish',
          level: 'intermediate',
        },
      ]);
    });

    it('should map scan reports correctly', () => {
      const mockUser = createMockUser({
        scanReports: [
          {
            id: 1,
            type: 'sonarqube',
            commitSha: 'abc123',
            runAt: new Date('2023-01-01'),
            artifactUrl: 'https://artifacts.com/report1',
            summary: {
              bugs: 5,
              codeSmells: 10,
              coverage: 85.5,
              low: 2,
              medium: 3,
              high: 0,
              vulnerabilities: 1,
              qualityGate: 'passed',
            },
            userId: 1,
          },
          {
            id: 2,
            type: 'eslint',
            commitSha: 'def456',
            runAt: new Date('2023-02-01'),
            artifactUrl: 'https://artifacts.com/report2',
            summary: null, // Test null summary
            userId: 1,
          },
          {
            id: 3,
            type: 'security',
            commitSha: 'ghi789',
            runAt: new Date('2023-03-01'),
            artifactUrl: 'https://artifacts.com/report3',
            summary: {
              // Test partial summary data
              bugs: 2,
              invalidField: 'should be ignored',
              qualityGate: 'failed',
            },
            userId: 1,
          },
        ],
      });

      const result = mapPortfolioFromDb(mockUser);
      expect(result.scanReports).toEqual([
        {
          type: 'sonarqube',
          commitSha: 'abc123',
          runAt: new Date('2023-01-01'),
          artifactUrl: 'https://artifacts.com/report1',
          summary: {
            bugs: 5,
            codeSmells: 10,
            coverage: 85.5,
            low: 2,
            medium: 3,
            high: 0,
            vulnerabilities: 1,
            qualityGate: 'passed',
          },
        },
        {
          type: 'eslint',
          commitSha: 'def456',
          runAt: new Date('2023-02-01'),
          artifactUrl: 'https://artifacts.com/report2',
          summary: null,
        },
        {
          type: 'security',
          commitSha: 'ghi789',
          runAt: new Date('2023-03-01'),
          artifactUrl: 'https://artifacts.com/report3',
          summary: {
            bugs: 2,
            qualityGate: 'failed',
          },
        },
      ]);
    });

    it('should handle null scan report summary', () => {
      const mockUser = createMockUser({
        scanReports: [
          {
            id: 1,
            type: 'test',
            commitSha: 'abc123',
            runAt: new Date('2023-01-01'),
            artifactUrl: 'https://test.com',
            summary: null,
            userId: 1,
          },
        ],
      });

      const result = mapPortfolioFromDb(mockUser);
      expect(result.scanReports).toBeDefined();
      expect(result.scanReports!).toHaveLength(1);
      expect(result.scanReports![0].summary).toBeNull();
    });

    it('should handle undefined scan report summary', () => {
      const mockUser = createMockUser({
        scanReports: [
          {
            id: 1,
            type: 'test',
            commitSha: 'abc123',
            runAt: new Date('2023-01-01'),
            artifactUrl: 'https://test.com',
            summary: undefined,
            userId: 1,
          },
        ],
      });

      const result = mapPortfolioFromDb(mockUser);
      expect(result.scanReports).toBeDefined();
      expect(result.scanReports!).toHaveLength(1);
      expect(result.scanReports![0].summary).toBeNull();
    });

    it('should handle string JSON in scan report summary', () => {
      const mockUser = createMockUser({
        scanReports: [
          {
            id: 1,
            type: 'test',
            commitSha: 'abc123',
            runAt: new Date('2023-01-01'),
            artifactUrl: 'https://test.com',
            summary: '{"bugs": 5, "qualityGate": "passed"}',
            userId: 1,
          },
        ],
      });

      const result = mapPortfolioFromDb(mockUser);
      expect(result.scanReports).toBeDefined();
      expect(result.scanReports!).toHaveLength(1);
      expect(result.scanReports![0].summary).toEqual({
        bugs: 5,
        qualityGate: 'passed',
      });
    });

    it('should handle invalid JSON string in scan report summary', () => {
      const mockUser = createMockUser({
        scanReports: [
          {
            id: 1,
            type: 'test',
            commitSha: 'abc123',
            runAt: new Date('2023-01-01'),
            artifactUrl: 'https://test.com',
            summary: '{invalid-json',
            userId: 1,
          },
        ],
      });

      const result = mapPortfolioFromDb(mockUser);
      expect(result.scanReports).toBeDefined();
      expect(result.scanReports!).toHaveLength(1);
      expect(result.scanReports![0].summary).toBeNull();
    });
  });
});
