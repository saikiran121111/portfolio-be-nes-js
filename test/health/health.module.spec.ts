import { Test, TestingModule } from '@nestjs/testing';
import { HealthModule } from '../../src/health/health.module';
import { HealthController } from '../../src/health/health.controller';
import { HealthService } from '../../src/health/health.service';

describe('HealthModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [HealthModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should have HealthController', () => {
    const controller = module.get<HealthController>(HealthController);
    expect(controller).toBeDefined();
    expect(controller).toBeInstanceOf(HealthController);
  });

  it('should have HealthService', () => {
    const service = module.get<HealthService>(HealthService);
    expect(service).toBeDefined();
    expect(service).toBeInstanceOf(HealthService);
  });

  it('should properly wire dependencies', () => {
    const controller = module.get<HealthController>(HealthController);
    const service = module.get<HealthService>(HealthService);

    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
});
