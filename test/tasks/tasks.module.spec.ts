import { Test, TestingModule } from '@nestjs/testing';
import { TasksModule } from '../../src/tasks/tasks.module';
import { KeepAliveService } from '../../src/tasks/keep-alive.service';
import { SelfPingService } from '../../src/tasks/self-ping.service';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('TasksModule', () => {
    let module: TestingModule;

    const mockPrismaService = {
        $queryRaw: jest.fn(),
        $connect: jest.fn(),
        $disconnect: jest.fn(),
    };

    beforeEach(async () => {
        module = await Test.createTestingModule({
            imports: [TasksModule],
        })
            .overrideProvider(PrismaService)
            .useValue(mockPrismaService)
            .compile();
    });

    it('should be defined', () => {
        expect(module).toBeDefined();
    });

    it('should provide KeepAliveService', () => {
        const service = module.get<KeepAliveService>(KeepAliveService);
        expect(service).toBeDefined();
        expect(service).toBeInstanceOf(KeepAliveService);
    });

    it('should provide SelfPingService', () => {
        const service = module.get<SelfPingService>(SelfPingService);
        expect(service).toBeDefined();
        expect(service).toBeInstanceOf(SelfPingService);
    });
});
