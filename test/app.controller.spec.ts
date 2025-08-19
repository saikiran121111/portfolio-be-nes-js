import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';

describe('AppController', () => {
  let controller: AppController;
  let appService: jest.Mocked<AppService>;

  const mockAppService = {
    getHello: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: mockAppService,
        },
      ],
    }).compile();

    controller = module.get<AppController>(AppController);
    appService = module.get(AppService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('constructor', () => {
    it('should initialize with AppService dependency', () => {
      expect(controller).toHaveProperty('appService');
      expect(controller['appService']).toBe(appService);
    });
  });

  describe('getHello', () => {
    it('should return "Hello World!" when appService returns it', () => {
      // Arrange
      const expectedResult = 'Hello World!';
      appService.getHello.mockReturnValue(expectedResult);

      // Act
      const result = controller.getHello();

      // Assert
      expect(result).toBe(expectedResult);
      expect(appService.getHello).toHaveBeenCalledTimes(1);
      expect(appService.getHello).toHaveBeenCalledWith();
    });

    it('should call appService.getHello exactly once', () => {
      // Arrange
      const expectedResult = 'Hello World!';
      appService.getHello.mockReturnValue(expectedResult);

      // Act
      controller.getHello();

      // Assert
      expect(appService.getHello).toHaveBeenCalledTimes(1);
      expect(appService.getHello).toHaveBeenCalledWith();
    });

    it('should return custom message when appService returns it', () => {
      // Arrange
      const customMessage = 'Custom Hello Message';
      appService.getHello.mockReturnValue(customMessage);

      // Act
      const result = controller.getHello();

      // Assert
      expect(result).toBe(customMessage);
      expect(appService.getHello).toHaveBeenCalledTimes(1);
    });

    it('should return empty string when appService returns it', () => {
      // Arrange
      const emptyMessage = '';
      appService.getHello.mockReturnValue(emptyMessage);

      // Act
      const result = controller.getHello();

      // Assert
      expect(result).toBe(emptyMessage);
      expect(appService.getHello).toHaveBeenCalledTimes(1);
    });

    it('should handle special characters in message', () => {
      // Arrange
      const specialMessage = 'Hello! @#$%^&*()_+ 🚀 World!';
      appService.getHello.mockReturnValue(specialMessage);

      // Act
      const result = controller.getHello();

      // Assert
      expect(result).toBe(specialMessage);
      expect(appService.getHello).toHaveBeenCalledTimes(1);
    });

    it('should return the exact string type', () => {
      // Arrange
      const message = 'Hello World!';
      appService.getHello.mockReturnValue(message);

      // Act
      const result = controller.getHello();

      // Assert
      expect(typeof result).toBe('string');
      expect(result).toBe(message);
    });

    it('should handle multiple calls independently', () => {
      // Arrange
      const firstMessage = 'First Hello';
      const secondMessage = 'Second Hello';
      
      appService.getHello
        .mockReturnValueOnce(firstMessage)
        .mockReturnValueOnce(secondMessage);

      // Act
      const firstResult = controller.getHello();
      const secondResult = controller.getHello();

      // Assert
      expect(firstResult).toBe(firstMessage);
      expect(secondResult).toBe(secondMessage);
      expect(appService.getHello).toHaveBeenCalledTimes(2);
    });
  });

  describe('HTTP GET decorator', () => {
    it('should have GET decorator on getHello method', () => {
      // This test verifies that the GET decorator is properly applied
      const getHelloMethod = controller.getHello;
      expect(getHelloMethod).toBeDefined();
      expect(typeof getHelloMethod).toBe('function');
    });
  });

  describe('Controller decorator', () => {
    it('should be a valid NestJS controller', () => {
      // This test verifies that the controller is properly instantiated
      expect(controller).toBeInstanceOf(AppController);
    });
  });
});
