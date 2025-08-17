import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';

describe('AppController', () => {
  let controller: AppController;
  let appService: AppService;

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
    appService = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getHello', () => {
    it('should return "Hello World!"', () => {
      const expectedResult = 'Hello World!';
      mockAppService.getHello.mockReturnValue(expectedResult);

      const result = controller.getHello();

      expect(result).toBe(expectedResult);
      expect(appService.getHello).toHaveBeenCalledTimes(1);
    });

    it('should call appService.getHello', () => {
      const expectedResult = 'Hello World!';
      mockAppService.getHello.mockReturnValue(expectedResult);

      controller.getHello();

      expect(appService.getHello).toHaveBeenCalledTimes(1);
    });

    it('should return what appService returns', () => {
      const customMessage = 'Custom Hello Message';
      mockAppService.getHello.mockReturnValue(customMessage);

      const result = controller.getHello();

      expect(result).toBe(customMessage);
    });
  });
});
