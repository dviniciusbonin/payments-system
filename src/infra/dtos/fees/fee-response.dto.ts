import { ApiProperty } from '@nestjs/swagger';
import { FeeType } from '../../../domain/types/fee-type';

export class FeeResponseDto {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 'BR' })
  countryCode: string;

  @ApiProperty({ example: 4.5 })
  feePercentage: number;

  @ApiProperty({ enum: FeeType, example: FeeType.NATIONAL })
  feeType: FeeType;

  @ApiProperty({ example: false })
  isDefault: boolean;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updatedAt: Date;
}
