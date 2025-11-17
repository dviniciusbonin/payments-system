import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../../domain/types/user-role';

export class CommissionResponseDto {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ enum: UserRole, example: UserRole.PRODUCER })
  role: UserRole;

  @ApiProperty({ example: 60 })
  percentage: number;

  @ApiProperty({ example: 'product-uuid' })
  productId: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updatedAt: Date;
}
