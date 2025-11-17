import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({ example: 100.5, description: 'Payment amount' })
  @IsNotEmpty()
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({
    example: 'BR',
    description: 'ISO 3166-1 alpha-2 country code',
  })
  @IsNotEmpty()
  @IsString()
  countryCode: string;

  @ApiProperty({ example: 'product-uuid', description: 'Product ID' })
  @IsNotEmpty()
  @IsUUID()
  productId: string;

  @ApiProperty({
    required: false,
    example: 'affiliate-uuid',
    description: 'Affiliate user ID (optional)',
  })
  @IsOptional()
  @IsUUID()
  affiliateId?: string;

  @ApiProperty({
    required: false,
    example: 'coproducer-uuid',
    description: 'Coproducer user ID (optional)',
  })
  @IsOptional()
  @IsUUID()
  coproducerId?: string;
}
