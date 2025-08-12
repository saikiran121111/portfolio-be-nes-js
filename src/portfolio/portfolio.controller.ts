import { Controller, Get, Version } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { HEADER_VERSION } from '../constants/headerVersion';

@Controller('api/portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get('users') // GET /api/v1/portfolio/users
  @Version(HEADER_VERSION)
  async getAllUsers() {
    return await this.portfolioService.getAllUsers();
  }
}