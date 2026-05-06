import { Body, Controller, Get, Put, UseGuards, Version } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';
import { HEADER_VERSION } from '../constants/headerVersion';
import { AdminApiKeyGuard } from './admin-api-key.guard';
import type { IAdminPortfolio } from './interface/admin-portfolio.interface';
import { PortfolioService } from './portfolio.service';

@Controller('api/portfolio/admin')
@UseGuards(AdminApiKeyGuard)
export class PortfolioAdminController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get('profile')
  @Version(HEADER_VERSION)
  @ApiHeader({
    name: 'Version',
    description: 'API version header',
    required: false,
    example: HEADER_VERSION,
  })
  @ApiHeader({
    name: 'x-admin-api-key',
    description: 'Server-to-server admin API key',
    required: true,
  })
  async getAdminProfile(): Promise<IAdminPortfolio | null> {
    return this.portfolioService.getAdminPortfolio();
  }

  @Put('profile')
  @Version(HEADER_VERSION)
  @ApiHeader({
    name: 'Version',
    description: 'API version header',
    required: false,
    example: HEADER_VERSION,
  })
  @ApiHeader({
    name: 'x-admin-api-key',
    description: 'Server-to-server admin API key',
    required: true,
  })
  async updateAdminProfile(
    @Body() payload: IAdminPortfolio,
  ): Promise<IAdminPortfolio> {
    return this.portfolioService.saveAdminPortfolio(payload);
  }
}
