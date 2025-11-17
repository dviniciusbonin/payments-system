import { Injectable, Inject } from '@nestjs/common';
import { ICommissionRepository } from '../../interfaces/repositories/commission-repository.interface';
import { Commission } from '../../../domain/entities/commission';
import { UserRole } from '../../../domain/types/user-role';

export interface CreateCommissionInput {
  role: UserRole;
  percentage: number;
  productId: string;
}

export interface CreateCommissionOutput {
  id: string;
  role: UserRole;
  percentage: number;
  productId: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class CreateCommissionUseCase {
  constructor(
    @Inject('ICommissionRepository')
    private readonly commissionRepository: ICommissionRepository,
  ) {}

  async execute(input: CreateCommissionInput): Promise<CreateCommissionOutput> {
    const commission = new Commission(
      crypto.randomUUID(),
      input.role,
      input.percentage,
      input.productId,
      new Date(),
      new Date(),
    );

    const created = await this.commissionRepository.save(commission);

    return {
      id: created.id,
      role: created.role,
      percentage: created.percentage,
      productId: created.productId,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    };
  }
}
