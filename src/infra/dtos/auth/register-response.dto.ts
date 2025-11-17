import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../../domain/types/user-role';

export class RegisterResponseDto {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: 'john@example.com' })
  email: string;

  @ApiProperty({ enum: UserRole, example: UserRole.PRODUCER })
  role: UserRole;
}
