import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PortfolioModule } from './portfolio/portfolio.module';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { ScheduleModule } from '@nestjs/schedule';
import { KeepAliveService } from './tasks/keep-alive.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    PortfolioModule,
    PrismaModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService, KeepAliveService],
})
export class AppModule {}
