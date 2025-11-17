import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { UserRole } from '../../../domain/types/user-role';

export class CreateCommissionDto {
  @ApiProperty({ enum: UserRole, example: UserRole.PRODUCER })
  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ example: 60, description: 'Commission percentage (0-100)' })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(100)
  percentage: number;

  @ApiProperty({ example: 'product-uuid' })
  @IsNotEmpty()
  @IsString()
  productId: string;
}
