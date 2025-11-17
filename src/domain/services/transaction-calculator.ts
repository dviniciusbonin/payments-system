import { Fee } from '../entities/fee';
import { Commission } from '../entities/commission';
import { UserRole } from '../types/user-role';

export interface FeeCalculationResult {
  feeAmount: number;
  netAmount: number;
}

export interface CommissionSplit {
  role: UserRole;
  userId: string;
  percentage: number;
  amount: number;
}

export class TransactionCalculator {
  calculateFee(grossAmount: number, fee: Fee): FeeCalculationResult {
    const feeAmount = fee.calculateFee(grossAmount);
    const netAmount = fee.calculateNetAmount(grossAmount);

    return {
      feeAmount,
      netAmount,
    };
  }

  calculateCommissions(
    netAmount: number,
    commissions: Commission[],
    participants: {
      producerId: string;
      affiliateId?: string;
      coproducerId?: string;
      platformId: string;
    },
  ): CommissionSplit[] {
    const splits: CommissionSplit[] = [];

    for (const commission of commissions) {
      let userId: string | undefined;

      switch (commission.role) {
        case UserRole.PRODUCER:
          userId = participants.producerId;
          break;
        case UserRole.AFFILIATE:
          userId = participants.affiliateId;
          break;
        case UserRole.COPRODUCER:
          userId = participants.coproducerId;
          break;
        case UserRole.PLATFORM:
          userId = participants.platformId;
          break;
      }

      if (userId) {
        const amount = commission.calculateAmount(netAmount);
        splits.push({
          role: commission.role,
          userId,
          percentage: commission.percentage,
          amount,
        });
      }
    }

    return splits;
  }

  validateCommissionPercentages(commissions: Commission[]): void {
    const totalPercentage = commissions.reduce(
      (sum, commission) => sum + commission.percentage,
      0,
    );

    if (totalPercentage > 100) {
      throw new Error(
        `Total commission percentage (${totalPercentage}%) cannot exceed 100%`,
      );
    }
  }
}
