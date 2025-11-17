import { CreateFeeUseCase } from './create-fee';
import { IFeeRepository } from '../../interfaces/repositories/fee-repository.interface';
import { Fee } from '../../../domain/entities/fee';
import { FeeType } from '../../../domain/types/fee-type';

describe('CreateFeeUseCase', () => {
  let useCase: CreateFeeUseCase;
  let feeRepository: jest.Mocked<IFeeRepository>;

  beforeEach(() => {
    feeRepository = {
      save: jest.fn(),
      findByCountryCode: jest.fn(),
      findDefault: jest.fn(),
    } as jest.Mocked<IFeeRepository>;

    useCase = new CreateFeeUseCase(feeRepository);
  });

  it('should create fee successfully', async () => {
    const input = {
      countryCode: 'BR',
      feePercentage: 4.5,
      feeType: FeeType.NATIONAL,
      isDefault: false,
    };

    const savedFee = new Fee(
      'fee-id',
      input.countryCode,
      input.feePercentage,
      input.feeType,
      input.isDefault || false,
      new Date(),
      new Date(),
    );

    feeRepository.save.mockResolvedValue(savedFee);

    const result = await useCase.execute(input);

    expect(feeRepository.save).toHaveBeenCalled();
    expect(result.countryCode).toBe(input.countryCode);
    expect(result.feePercentage).toBe(input.feePercentage);
    expect(result.feeType).toBe(input.feeType);
    expect(result.isDefault).toBe(input.isDefault);
  });

  it('should use default isDefault value when not provided', async () => {
    const input = {
      countryCode: 'BR',
      feePercentage: 4.5,
      feeType: FeeType.NATIONAL,
    };

    const savedFee = new Fee(
      'fee-id',
      input.countryCode,
      input.feePercentage,
      input.feeType,
      false,
      new Date(),
      new Date(),
    );

    feeRepository.save.mockResolvedValue(savedFee);

    const result = await useCase.execute(input);

    expect(result.isDefault).toBe(false);
  });

  it('should call repository.save with fee', async () => {
    const input = {
      countryCode: 'US',
      feePercentage: 5.5,
      feeType: FeeType.INTERNATIONAL,
      isDefault: true,
    };

    const savedFee = new Fee(
      'fee-id',
      input.countryCode,
      input.feePercentage,
      input.feeType,
      input.isDefault || false,
      new Date(),
      new Date(),
    );

    feeRepository.save.mockResolvedValue(savedFee);

    await useCase.execute(input);

    expect(feeRepository.save).toHaveBeenCalled();
    const savedCall = feeRepository.save.mock.calls[0][0];
    expect(savedCall.countryCode).toBe(input.countryCode);
    expect(savedCall.feePercentage).toBe(input.feePercentage);
    expect(savedCall.feeType).toBe(input.feeType);
  });
});
