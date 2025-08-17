import {
  PortfolioResponseDto,
  toPortfolioResponseDto,
} from '../../../src/portfolio/dto/portfolio.response.dto';
import { IPortfolio } from '../../../src/portfolio/interface/portfolio.interface';

describe('PortfolioResponseDto', () => {
  describe('PortfolioResponseDto class', () => {
    it('should be defined', () => {
      expect(PortfolioResponseDto).toBeDefined();
    });

    it('should create an instance', () => {
      const dto = new PortfolioResponseDto();
      expect(dto).toBeInstanceOf(PortfolioResponseDto);
    });

    it('should have required properties', () => {
      const dto = new PortfolioResponseDto();
      dto.name = 'John Doe';
      dto.email = 'john@example.com';
      dto.skills = [];
      dto.experiences = [];
      dto.education = [];

      expect(dto.name).toBe('John Doe');
      expect(dto.email).toBe('john@example.com');
      expect(dto.skills).toEqual([]);
      expect(dto.experiences).toEqual([]);
      expect(dto.education).toEqual([]);
    });

    it('should allow optional properties', () => {
      const dto = new PortfolioResponseDto();
      dto.headline = 'Software Developer';
      dto.summary = 'Experienced developer';
      dto.copyrights = '© 2023';
      dto.location = 'New York';
      dto.phone = '+1234567890';

      expect(dto.headline).toBe('Software Developer');
      expect(dto.summary).toBe('Experienced developer');
      expect(dto.copyrights).toBe('© 2023');
      expect(dto.location).toBe('New York');
      expect(dto.phone).toBe('+1234567890');
    });

    it('should allow repo data properties', () => {
      const dto = new PortfolioResponseDto();
      dto.nestJSGitRepo = 'https://github.com/user/nestjs';
      dto.nestJSDeployedServer = 'https://api.example.com';
      dto.nestJSSwaggerUrl = 'https://api.example.com/swagger';
      dto.nextJSGitRepo = 'https://github.com/user/nextjs';
      dto.nextJSDeployedServer = 'https://example.com';
      dto.postgresDeployedServer = 'https://db.example.com';

      expect(dto.nestJSGitRepo).toBe('https://github.com/user/nestjs');
      expect(dto.nestJSDeployedServer).toBe('https://api.example.com');
      expect(dto.nestJSSwaggerUrl).toBe('https://api.example.com/swagger');
      expect(dto.nextJSGitRepo).toBe('https://github.com/user/nextjs');
      expect(dto.nextJSDeployedServer).toBe('https://example.com');
      expect(dto.postgresDeployedServer).toBe('https://db.example.com');
    });
  });

  describe('toPortfolioResponseDto', () => {
    const mockPortfolio: IPortfolio = {
      name: 'John Doe',
      email: 'john@example.com',
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
      nestJSGitRepo: 'https://github.com/johndoe/nestjs',
      nestJSDeployedServer: 'https://api.johndoe.com',
      nestJSSwaggerUrl: 'https://api.johndoe.com/swagger',
      nextJSGitRepo: 'https://github.com/johndoe/nextjs',
      nextJSDeployedServer: 'https://johndoe.com',
      postgresDeployedServer: 'https://db.johndoe.com',
      skills: [],
      experiences: [],
      projects: [],
      education: [],
      certifications: [],
      achievements: [],
      languages: [],
      scanReports: [],
      bottomHeadline: ['Headline 1', 'Headline 2'],
      toolDocs: [],
    };

    it('should convert IPortfolio to PortfolioResponseDto', () => {
      const result = toPortfolioResponseDto(mockPortfolio);

      expect(result).toBeInstanceOf(PortfolioResponseDto);
      expect(result.name).toBe(mockPortfolio.name);
      expect(result.email).toBe(mockPortfolio.email);
      expect(result.headline).toBe(mockPortfolio.headline);
      expect(result.summary).toBe(mockPortfolio.summary);
      expect(result.copyrights).toBe(mockPortfolio.copyrights);
      expect(result.location).toBe(mockPortfolio.location);
      expect(result.phone).toBe(mockPortfolio.phone);
      expect(result.socials).toBe(mockPortfolio.socials);
    });

    it('should preserve all properties', () => {
      const result = toPortfolioResponseDto(mockPortfolio);

      expect(result.nestJSGitRepo).toBe(mockPortfolio.nestJSGitRepo);
      expect(result.nestJSDeployedServer).toBe(
        mockPortfolio.nestJSDeployedServer,
      );
      expect(result.nestJSSwaggerUrl).toBe(mockPortfolio.nestJSSwaggerUrl);
      expect(result.nextJSGitRepo).toBe(mockPortfolio.nextJSGitRepo);
      expect(result.nextJSDeployedServer).toBe(
        mockPortfolio.nextJSDeployedServer,
      );
      expect(result.postgresDeployedServer).toBe(
        mockPortfolio.postgresDeployedServer,
      );
      expect(result.skills).toBe(mockPortfolio.skills);
      expect(result.experiences).toBe(mockPortfolio.experiences);
      expect(result.projects).toBe(mockPortfolio.projects);
      expect(result.education).toBe(mockPortfolio.education);
      expect(result.certifications).toBe(mockPortfolio.certifications);
      expect(result.achievements).toBe(mockPortfolio.achievements);
      expect(result.languages).toBe(mockPortfolio.languages);
      expect(result.scanReports).toBe(mockPortfolio.scanReports);
      expect(result.bottomHeadline).toBe(mockPortfolio.bottomHeadline);
      expect(result.toolDocs).toBe(mockPortfolio.toolDocs);
    });

    it('should handle minimal portfolio data', () => {
      const minimalPortfolio: IPortfolio = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        skills: [],
        experiences: [],
        education: [],
      };

      const result = toPortfolioResponseDto(minimalPortfolio);

      expect(result).toBeInstanceOf(PortfolioResponseDto);
      expect(result.name).toBe('Jane Doe');
      expect(result.email).toBe('jane@example.com');
      expect(result.skills).toEqual([]);
      expect(result.experiences).toEqual([]);
      expect(result.education).toEqual([]);
      expect(result.headline).toBeUndefined();
      expect(result.summary).toBeUndefined();
    });

    it('should create a new instance', () => {
      const result = toPortfolioResponseDto(mockPortfolio);
      expect(result).not.toBe(mockPortfolio);
      expect(result).toBeInstanceOf(PortfolioResponseDto);
    });
  });
});
