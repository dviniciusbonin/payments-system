import { Module } from '@nestjs/common';
import { HealthController } from './infra/http/health.controller';
import { DatabaseModule } from './infra/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
