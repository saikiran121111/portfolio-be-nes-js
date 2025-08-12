import { Controller, Get } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';

@Controller('api/v1/portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get('users') // GET /api/v1/portfolio/users
  async getAllUsers() {
    return await this.portfolioService.getAllUsers();
  }
}