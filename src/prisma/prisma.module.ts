import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Makes PrismaService available without re-importing in every module
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
