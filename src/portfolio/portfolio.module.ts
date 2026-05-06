import { Module } from '@nestjs/common';
import { PortfolioController } from './portfolio.controller';
import { PortfolioAdminController } from './portfolio-admin.controller';
import { PortfolioService } from './portfolio.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AdminApiKeyGuard } from './admin-api-key.guard';

@Module({
  imports: [PrismaModule],
  controllers: [PortfolioController, PortfolioAdminController],
  providers: [PortfolioService, AdminApiKeyGuard],
})
export class PortfolioModule {}
