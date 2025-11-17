import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Curso de Programação' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Descrição do curso',
    nullable: true,
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string | null;
}
