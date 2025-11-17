import { Injectable, Inject } from '@nestjs/common';
import { IFeeRepository } from '../../interfaces/repositories/fee-repository.interface';
import { Fee } from '../../../domain/entities/fee';
import { FeeType } from '../../../domain/types/fee-type';

export interface CreateFeeInput {
  countryCode: string;
  feePercentage: number;
  feeType: FeeType;
  isDefault?: boolean;
}

export interface CreateFeeOutput {
  id: string;
  countryCode: string;
  feePercentage: number;
  feeType: FeeType;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class CreateFeeUseCase {
  constructor(
    @Inject('IFeeRepository')
    private readonly feeRepository: IFeeRepository,
  ) {}

  async execute(input: CreateFeeInput): Promise<CreateFeeOutput> {
    const fee = new Fee(
      crypto.randomUUID(),
      input.countryCode,
      input.feePercentage,
      input.feeType,
      input.isDefault || false,
      new Date(),
      new Date(),
    );

    const created = await this.feeRepository.save(fee);

    return {
      id: created.id,
      countryCode: created.countryCode,
      feePercentage: created.feePercentage,
      feeType: created.feeType,
      isDefault: created.isDefault,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    };
  }
}
