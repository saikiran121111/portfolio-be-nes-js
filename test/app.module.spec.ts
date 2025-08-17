import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';
import { PortfolioController } from '../src/portfolio/portfolio.controller';
import { PrismaService } from '../src/prisma/prisma.service';
import { HealthController } from '../src/health/health.controller';

describe('AppModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should have AppController', () => {
    const controller = module.get<AppController>(AppController);
    expect(controller).toBeDefined();
    expect(controller).toBeInstanceOf(AppController);
  });

  it('should have AppService', () => {
    const service = module.get<AppService>(AppService);
    expect(service).toBeDefined();
    expect(service).toBeInstanceOf(AppService);
  });

  it('should import PortfolioModule', () => {
    expect(module).toBeDefined();
    // Module imports are not directly testable, but we can test that portfolio components are available
    const portfolioController =
      module.get<PortfolioController>(PortfolioController);
    expect(portfolioController).toBeDefined();
  });

  it('should import PrismaModule', () => {
    expect(module).toBeDefined();
    // Test that PrismaService is available globally
    const prismaService = module.get<PrismaService>(PrismaService);
    expect(prismaService).toBeDefined();
  });

  it('should import HealthModule', () => {
    expect(module).toBeDefined();
    // Test that health components are available
    const healthController = module.get<HealthController>(HealthController);
    expect(healthController).toBeDefined();
  });
});
