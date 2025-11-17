import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../../domain/types/user-role';

export class UserResponseDto {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 'john@example.com' })
  email: string;

  @ApiProperty({ enum: UserRole, example: UserRole.PRODUCER })
  role: UserRole;
}

export class LoginResponseDto {
  @ApiProperty({ example: 'jwt-token' })
  accessToken: string;

  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;
}
