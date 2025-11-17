import { UserRole } from '../types/user-role';

export class TransactionSplit {
  constructor(
    public readonly id: string,
    public readonly transactionId: string,
    public readonly userId: string,
    public readonly role: UserRole,
    public readonly percentage: number,
    public readonly amount: number,
    public readonly createdAt: Date,
  ) {
    if (percentage < 0 || percentage > 100) {
      throw new Error('Percentage must be between 0 and 100');
    }

    if (amount <= 0) {
      throw new Error('Split amount must be positive');
    }
  }
}
