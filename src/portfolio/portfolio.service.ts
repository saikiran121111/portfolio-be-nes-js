import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PortfolioService {

    // This service will handle portfolio-related logic
    constructor(private prisma: PrismaService) {}

    async getAllUsers() {
    return await this.prisma.user.findMany({
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
