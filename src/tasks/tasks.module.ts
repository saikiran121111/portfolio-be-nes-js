import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { KeepAliveService } from './keep-alive.service';
import { SelfPingService } from './self-ping.service';

@Module({
    imports: [PrismaModule],
    providers: [KeepAliveService, SelfPingService],
})
export class TasksModule { }
