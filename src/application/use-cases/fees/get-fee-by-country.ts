import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { IFeeRepository } from '../../interfaces/repositories/fee-repository.interface';

export interface GetFeeByCountryOutput {
  id: string;
  countryCode: string;
  feePercentage: number;
  feeType: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class GetFeeByCountryUseCase {
  constructor(
    @Inject('IFeeRepository')
    private readonly feeRepository: IFeeRepository,
  ) {}

  async execute(countryCode: string): Promise<GetFeeByCountryOutput> {
    const fee = await this.feeRepository.findByCountryCode(countryCode);

    if (fee) {
      return {
        id: fee.id,
        countryCode: fee.countryCode,
        feePercentage: fee.feePercentage,
        feeType: fee.feeType,
        isDefault: fee.isDefault,
        createdAt: fee.createdAt,
        updatedAt: fee.updatedAt,
      };
    }

    const defaultFee = await this.feeRepository.findDefault();

    if (!defaultFee) {
      throw new NotFoundException(
        `Fee not found for country ${countryCode} and no default fee configured`,
      );
    }

    return {
      id: defaultFee.id,
      countryCode: defaultFee.countryCode,
      feePercentage: defaultFee.feePercentage,
      feeType: defaultFee.feeType,
      isDefault: defaultFee.isDefault,
      createdAt: defaultFee.createdAt,
      updatedAt: defaultFee.updatedAt,
    };
  }
}
