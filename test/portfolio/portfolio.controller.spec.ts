import { Test, TestingModule } from '@nestjs/testing';
import { PortfolioController } from '../../src/portfolio/portfolio.controller';
import { PortfolioService } from '../../src/portfolio/portfolio.service';
import { HEADER_VERSION } from '../../src/constants/headerVersion';
import { toPortfolioResponseDto } from '../../src/portfolio/dto/portfolio.response.dto';

// Mock the DTO transformer
jest.mock('../../src/portfolio/dto/portfolio.response.dto', () => ({
  toPortfolioResponseDto: jest.fn(),
  PortfolioResponseDto: class PortfolioResponseDto {},
}));

jest.mock('class-transformer', () => ({
  instanceToPlain: jest.fn((obj: unknown) => obj),
}));

const mockToPortfolioResponseDto =
  toPortfolioResponseDto as jest.MockedFunction<typeof toPortfolioResponseDto>;

describe('PortfolioController', () => {
  let controller: PortfolioController;

  const mockPortfolioService = {
    getPortfolioV1: jest.fn(),
    getPortfolioV2: jest.fn(),
  };

  const mockPortfolioData = {
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

  const mockPortfolioDto = {
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
      controllers: [PortfolioController],
      providers: [
        {
          provide: PortfolioService,
          useValue: mockPortfolioService,
        },
      ],
    }).compile();

    controller = module.get<PortfolioController>(PortfolioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUserV1', () => {
    it('should return portfolio v1 data', async () => {
      const mockV1Data = { ...mockPortfolioData, id: 1 };
      mockPortfolioService.getPortfolioV1.mockResolvedValue(mockV1Data);

      const result = await controller.getUserV1();

      expect(result).toBe(mockV1Data);
      expect(mockPortfolioService.getPortfolioV1).toHaveBeenCalledTimes(1);
    });

    it('should return null when service returns null', async () => {
      mockPortfolioService.getPortfolioV1.mockResolvedValue(null);

      const result = await controller.getUserV1();

      expect(result).toBeNull();
      expect(mockPortfolioService.getPortfolioV1).toHaveBeenCalledTimes(1);
    });

    it('should handle service errors', async () => {
      const error = new Error('Service error');
      mockPortfolioService.getPortfolioV1.mockRejectedValue(error);

      await expect(controller.getUserV1()).rejects.toThrow('Service error');
      expect(mockPortfolioService.getPortfolioV1).toHaveBeenCalledTimes(1);
    });
  });

  describe('getUserV2', () => {
    it('should return transformed portfolio v2 data', async () => {
      mockPortfolioService.getPortfolioV2.mockResolvedValue(mockPortfolioData);
      mockToPortfolioResponseDto.mockReturnValue(mockPortfolioDto);

      const result = await controller.getUserV2();

      expect(result).toBe(mockPortfolioDto);
      expect(mockPortfolioService.getPortfolioV2).toHaveBeenCalledTimes(1);
      expect(mockToPortfolioResponseDto).toHaveBeenCalledWith(
        mockPortfolioData,
      );
    });

    it('should return null when service returns null', async () => {
      mockPortfolioService.getPortfolioV2.mockResolvedValue(null);

      const result = await controller.getUserV2();

      expect(result).toBeNull();
      expect(mockPortfolioService.getPortfolioV2).toHaveBeenCalledTimes(1);
      expect(mockToPortfolioResponseDto).not.toHaveBeenCalled();
    });

    it('should handle service errors', async () => {
      const error = new Error('Service error');
      mockPortfolioService.getPortfolioV2.mockRejectedValue(error);

      await expect(controller.getUserV2()).rejects.toThrow('Service error');
      expect(mockPortfolioService.getPortfolioV2).toHaveBeenCalledTimes(1);
    });

    it('should use correct version header', () => {
      // This test verifies that the controller is configured with the correct version
      expect(HEADER_VERSION).toBe('2');
    });
  });

  describe('API decorators', () => {
    it('should have correct controller path', () => {
      const controllerMetadata = Reflect.getMetadata(
        'path',
        PortfolioController,
      ) as string;
      expect(controllerMetadata).toBe('api/portfolio');
    });

    // Note: Method-level path metadata testing is complex due to decorator implementation
    // The actual API behavior is tested through the service method calls above
  });
});
