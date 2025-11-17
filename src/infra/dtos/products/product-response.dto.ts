import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 'Curso de Programação' })
  name: string;

  @ApiProperty({ example: 'Descrição do curso', nullable: true })
  description: string | null;

  @ApiProperty({ example: 'uuid' })
  producerId: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updatedAt: Date;
}
