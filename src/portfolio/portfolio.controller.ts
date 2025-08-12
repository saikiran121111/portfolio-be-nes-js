import { Controller, Get, Version } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { HEADER_VERSION } from '../constants/headerVersion';
import { ApiHeader } from '@nestjs/swagger';

@Controller('api/portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get('user')
  @Version('1')
  @ApiHeader({
    name: 'Version',
    description: 'API version header',
    required: false,
    example: '1',
  })
  async getUserV1() {
    return await this.portfolioService.getPortfolioV1();
  }

  @Get('user')
  @Version(HEADER_VERSION)
  @ApiHeader({
    name: 'Version',
    description: 'API version header',
    required: false,
    example: HEADER_VERSION,
  })
  async getUserV2() {
    return await this.portfolioService.getPortfolioV2();
  }

}