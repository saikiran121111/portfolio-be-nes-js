import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IPortfolio } from './interface/portfolio.interface';
import { mapPortfolioFromDb } from './mapper/portfolio.mapper';

@Injectable()
export class PortfolioService {

    // This service will handle portfolio-related logic
    constructor(private prisma: PrismaService) {}

    async getPortfolioV2(): Promise<IPortfolio | null> {
    const user = await this.prisma.user.findFirst({
      include: {
        skills: true,
        experiences: true,
      },
    });
    if (!user) {
      return null;
    }
    return mapPortfolioFromDb(user);
  }

  async getPortfolioV1() {
    return await this.prisma.user.findFirst({
      include: {
        skills: true,
        experiences: true,
        projects: true,
        education: true,
        certifications: true,
        achievements: true,
        languages: true,
        scanReports: true,
      },
    });
  }
}
