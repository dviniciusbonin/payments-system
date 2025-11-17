import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '../../../domain/types/user-role';

export class ListUsersQueryDto {
  @ApiPropertyOptional({
    enum: UserRole,
    description: 'Filter users by role',
    example: UserRole.PRODUCER,
  })
  @IsOptional()
  @IsEnum(UserRole, {
    message: 'Role must be one of: PRODUCER, AFFILIATE, COPRODUCER, PLATFORM',
  })
  role?: UserRole;
}
