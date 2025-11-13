import { Controller, Get, HttpStatus, HttpException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Controller('health')
export class HealthController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get()
  async check() {
    const isDatabaseHealthy = await this.prismaService.isHealthy();

    if (!isDatabaseHealthy) {
      throw new HttpException(
        {
          status: 'error',
          database: 'unhealthy',
        },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    return {
      status: 'ok',
      database: 'healthy',
    };
  }
}
