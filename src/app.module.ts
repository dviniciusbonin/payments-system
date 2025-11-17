import { Module } from '@nestjs/common';
import { DatabaseModule } from './infra/database/database.module';
import { ServicesModule } from './infra/services/services.module';
import { AuthModule } from './infra/auth/auth.module';
import { HttpModule } from './infra/http/http.module';

@Module({
  imports: [DatabaseModule, ServicesModule, AuthModule, HttpModule],
})
export class AppModule {}
