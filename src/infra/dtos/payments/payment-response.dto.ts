import { ApiProperty } from '@nestjs/swagger';
import { TransactionStatus } from '../../../domain/types/transaction-status';

export class PaymentSplitResponseDto {
  @ApiProperty({ example: 'user-uuid' })
  userId: string;

  @ApiProperty({ example: 'PRODUCER' })
  role: string;

  @ApiProperty({ example: 60 })
  percentage: number;

  @ApiProperty({ example: 57.6 })
  amount: number;
}

export class PaymentResponseDto {
  @ApiProperty({ example: 'transaction-uuid' })
  transactionId: string;

  @ApiProperty({ example: 100.5 })
  amount: number;

  @ApiProperty({ example: 4.5 })
  feeAmount: number;

  @ApiProperty({ example: 96.0 })
  netAmount: number;

  @ApiProperty({ enum: TransactionStatus, example: TransactionStatus.APPROVED })
  status: string;

  @ApiProperty({ type: [PaymentSplitResponseDto] })
  splits: PaymentSplitResponseDto[];
}
