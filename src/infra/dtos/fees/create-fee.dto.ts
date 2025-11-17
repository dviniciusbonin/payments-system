import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { FeeType } from '../../../domain/types/fee-type';

export class CreateFeeDto {
  @ApiProperty({
    example: 'BR',
    description: 'ISO 3166-1 alpha-2 country code',
  })
  @IsNotEmpty()
  @IsString()
  countryCode: string;

  @ApiProperty({ example: 4.5, description: 'Fee percentage (0-100)' })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(100)
  feePercentage: number;

  @ApiProperty({ enum: FeeType, example: FeeType.NATIONAL })
  @IsNotEmpty()
  @IsEnum(FeeType)
  feeType: FeeType;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  isDefault?: boolean;
}
