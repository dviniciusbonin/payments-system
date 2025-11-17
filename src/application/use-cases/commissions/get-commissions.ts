import { Injectable, Inject } from '@nestjs/common';
import { ICommissionRepository } from '../../interfaces/repositories/commission-repository.interface';

export interface GetCommissionsOutput {
  id: string;
  role: string;
  percentage: number;
  productId: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class GetCommissionsUseCase {
  constructor(
    @Inject('ICommissionRepository')
    private readonly commissionRepository: ICommissionRepository,
  ) {}

  async execute(productId: string): Promise<GetCommissionsOutput[]> {
    const commissions =
      await this.commissionRepository.findByProductId(productId);

    return commissions.map((commission) => ({
      id: commission.id,
      role: commission.role,
      percentage: commission.percentage,
      productId: commission.productId,
      createdAt: commission.createdAt,
      updatedAt: commission.updatedAt,
    }));
  }
}
