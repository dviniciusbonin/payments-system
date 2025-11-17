import { UserRole } from '../types/user-role';

export class Commission {
  constructor(
    public readonly id: string,
    public readonly role: UserRole,
    public readonly percentage: number,
    public readonly productId: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {
    if (percentage < 0 || percentage > 100) {
      throw new Error('Commission percentage must be between 0 and 100');
    }
  }

  calculateAmount(netAmount: number): number {
    return (netAmount * this.percentage) / 100;
  }
}
