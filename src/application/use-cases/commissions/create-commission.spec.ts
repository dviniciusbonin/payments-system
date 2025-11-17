import { CreateCommissionUseCase } from './create-commission';
import { ICommissionRepository } from '../../interfaces/repositories/commission-repository.interface';
import { Commission } from '../../../domain/entities/commission';
import { UserRole } from '../../../domain/types/user-role';

describe('CreateCommissionUseCase', () => {
  let useCase: CreateCommissionUseCase;
  let commissionRepository: jest.Mocked<ICommissionRepository>;

  beforeEach(() => {
    commissionRepository = {
      save: jest.fn(),
      findByProductId: jest.fn(),
    } as jest.Mocked<ICommissionRepository>;

    useCase = new CreateCommissionUseCase(commissionRepository);
  });

  it('should create commission successfully', async () => {
    const input = {
      role: UserRole.PRODUCER,
      percentage: 60,
      productId: 'product-id',
    };

    const savedCommission = new Commission(
      'commission-id',
      input.role,
      input.percentage,
      input.productId,
      new Date(),
      new Date(),
    );

    commissionRepository.save.mockResolvedValue(savedCommission);

    const result = await useCase.execute(input);

    expect(commissionRepository.save).toHaveBeenCalled();
    expect(result.role).toBe(input.role);
    expect(result.percentage).toBe(input.percentage);
    expect(result.productId).toBe(input.productId);
  });

  it('should call repository.save with commission', async () => {
    const input = {
      role: UserRole.AFFILIATE,
      percentage: 20,
      productId: 'product-id',
    };

    const savedCommission = new Commission(
      'commission-id',
      input.role,
      input.percentage,
      input.productId,
      new Date(),
      new Date(),
    );

    commissionRepository.save.mockResolvedValue(savedCommission);

    await useCase.execute(input);

    expect(commissionRepository.save).toHaveBeenCalled();
    const savedCall = commissionRepository.save.mock.calls[0][0];
    expect(savedCall.role).toBe(input.role);
    expect(savedCall.percentage).toBe(input.percentage);
    expect(savedCall.productId).toBe(input.productId);
  });
});
