import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PortfolioModule } from './portfolio/portfolio.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PortfolioModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
