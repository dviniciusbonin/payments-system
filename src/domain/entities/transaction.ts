import { TransactionStatus } from '../types/transaction-status';
import { TransactionSplit } from './transaction-split';

export class Transaction {
  constructor(
    public readonly id: string,
    public readonly amount: number,
    public readonly countryCode: string,
    public readonly status: TransactionStatus,
    public readonly feeAmount: number,
    public readonly netAmount: number,
    public readonly buyerId: string,
    public readonly productId: string,
    private readonly _splits: TransactionSplit[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {
    if (amount <= 0) {
      throw new Error('Transaction amount must be positive');
    }

    if (!countryCode || countryCode.length !== 2) {
      throw new Error('Country code must be 2 characters (ISO 3166-1 alpha-2)');
    }

    if (feeAmount < 0) {
      throw new Error('Fee amount cannot be negative');
    }

    if (netAmount <= 0) {
      throw new Error('Net amount must be positive');
    }

    const expectedNetAmount = amount - feeAmount;
    if (Math.abs(netAmount - expectedNetAmount) > 0.01) {
      throw new Error('Net amount must equal amount minus fee amount');
    }
  }

  isApproved(): boolean {
    return this.status === TransactionStatus.APPROVED;
  }

  isPending(): boolean {
    return this.status === TransactionStatus.PENDING;
  }

  isRejected(): boolean {
    return this.status === TransactionStatus.REJECTED;
  }

  get splits(): readonly TransactionSplit[] {
    return this._splits;
  }
}
