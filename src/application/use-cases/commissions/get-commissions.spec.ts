import { GetCommissionsUseCase } from './get-commissions';
import { ICommissionRepository } from '../../interfaces/repositories/commission-repository.interface';
import { Commission } from '../../../domain/entities/commission';
import { UserRole } from '../../../domain/types/user-role';

describe('GetCommissionsUseCase', () => {
  let useCase: GetCommissionsUseCase;
  let commissionRepository: jest.Mocked<ICommissionRepository>;

  beforeEach(() => {
    commissionRepository = {
      save: jest.fn(),
      findByProductId: jest.fn(),
    } as jest.Mocked<ICommissionRepository>;

    useCase = new GetCommissionsUseCase(commissionRepository);
  });

  it('should get commissions by productId', async () => {
    const productId = 'product-id';

    const commissions = [
      new Commission(
        'id1',
        UserRole.PRODUCER,
        60,
        productId,
        new Date(),
        new Date(),
      ),
      new Commission(
        'id2',
        UserRole.AFFILIATE,
        20,
        productId,
        new Date(),
        new Date(),
      ),
    ];

    commissionRepository.findByProductId.mockResolvedValue(commissions);

    const result = await useCase.execute(productId);

    expect(commissionRepository.findByProductId).toHaveBeenCalledWith(
      productId,
    );
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('id1');
    expect(result[0].role).toBe(UserRole.PRODUCER);
    expect(result[1].id).toBe('id2');
    expect(result[1].role).toBe(UserRole.AFFILIATE);
  });

  it('should return empty array when no commissions exist', async () => {
    const productId = 'product-id';

    commissionRepository.findByProductId.mockResolvedValue([]);

    const result = await useCase.execute(productId);

    expect(commissionRepository.findByProductId).toHaveBeenCalledWith(
      productId,
    );
    expect(result).toHaveLength(0);
  });
});
