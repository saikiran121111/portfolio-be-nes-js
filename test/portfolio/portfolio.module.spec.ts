import { Test, TestingModule } from '@nestjs/testing';
import { PortfolioModule } from '../../src/portfolio/portfolio.module';
import { PortfolioController } from '../../src/portfolio/portfolio.controller';
import { PortfolioService } from '../../src/portfolio/portfolio.service';

describe('PortfolioModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [PortfolioModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should have PortfolioController', () => {
    const controller = module.get<PortfolioController>(PortfolioController);
    expect(controller).toBeDefined();
    expect(controller).toBeInstanceOf(PortfolioController);
  });

  it('should have PortfolioService', () => {
    const service = module.get<PortfolioService>(PortfolioService);
    expect(service).toBeDefined();
    expect(service).toBeInstanceOf(PortfolioService);
  });

  it('should properly wire dependencies', () => {
    const controller = module.get<PortfolioController>(PortfolioController);
    const service = module.get<PortfolioService>(PortfolioService);

    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
});
