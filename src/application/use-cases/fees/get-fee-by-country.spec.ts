import { NotFoundException } from '@nestjs/common';
import { GetFeeByCountryUseCase } from './get-fee-by-country';
import { IFeeRepository } from '../../interfaces/repositories/fee-repository.interface';
import { Fee } from '../../../domain/entities/fee';
import { FeeType } from '../../../domain/types/fee-type';

describe('GetFeeByCountryUseCase', () => {
  let useCase: GetFeeByCountryUseCase;
  let feeRepository: jest.Mocked<IFeeRepository>;

  beforeEach(() => {
    feeRepository = {
      save: jest.fn(),
      findByCountryCode: jest.fn(),
      findDefault: jest.fn(),
    } as jest.Mocked<IFeeRepository>;

    useCase = new GetFeeByCountryUseCase(feeRepository);
  });

  it('should get fee by country code', async () => {
    const countryCode = 'BR';
    const fee = new Fee(
      'fee-id',
      countryCode,
      4.5,
      FeeType.NATIONAL,
      false,
      new Date(),
      new Date(),
    );

    feeRepository.findByCountryCode.mockResolvedValue(fee);

    const result = await useCase.execute(countryCode);

    expect(feeRepository.findByCountryCode).toHaveBeenCalledWith(countryCode);
    expect(feeRepository.findDefault).not.toHaveBeenCalled();
    expect(result.id).toBe('fee-id');
    expect(result.countryCode).toBe(countryCode);
    expect(result.feePercentage).toBe(4.5);
  });

  it('should return default fee when country not found', async () => {
    const countryCode = 'XX';
    const defaultFee = new Fee(
      'default-fee-id',
      'US',
      6.0,
      FeeType.INTERNATIONAL,
      true,
      new Date(),
      new Date(),
    );

    feeRepository.findByCountryCode.mockResolvedValue(null);
    feeRepository.findDefault.mockResolvedValue(defaultFee);

    const result = await useCase.execute(countryCode);

    expect(feeRepository.findByCountryCode).toHaveBeenCalledWith(countryCode);
    expect(feeRepository.findDefault).toHaveBeenCalled();
    expect(result.id).toBe('default-fee-id');
    expect(result.isDefault).toBe(true);
  });

  it('should throw NotFoundException when no fee and no default', async () => {
    const countryCode = 'XX';

    feeRepository.findByCountryCode.mockResolvedValue(null);
    feeRepository.findDefault.mockResolvedValue(null);

    await expect(useCase.execute(countryCode)).rejects.toThrow(
      NotFoundException,
    );
    expect(feeRepository.findByCountryCode).toHaveBeenCalledWith(countryCode);
    expect(feeRepository.findDefault).toHaveBeenCalled();
  });
});
