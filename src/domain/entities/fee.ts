import { FeeType } from '../types/fee-type';

export class Fee {
  constructor(
    public readonly id: string,
    public readonly countryCode: string,
    public readonly feePercentage: number,
    public readonly feeType: FeeType,
    public readonly isDefault: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {
    if (!countryCode || countryCode.length !== 2) {
      throw new Error('Country code must be 2 characters (ISO 3166-1 alpha-2)');
    }

    if (feePercentage < 0 || feePercentage > 100) {
      throw new Error('Fee percentage must be between 0 and 100');
    }
  }

  calculateFee(amount: number): number {
    return (amount * this.feePercentage) / 100;
  }

  calculateNetAmount(amount: number): number {
    const feeAmount = this.calculateFee(amount);
    return amount - feeAmount;
  }
}
