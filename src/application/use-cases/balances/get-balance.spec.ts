import { NotFoundException } from '@nestjs/common';
import { GetBalanceUseCase } from './get-balance';
import { IBalanceRepository } from '../../interfaces/repositories/balance-repository.interface';
import { Balance } from '../../../domain/entities/balance';

describe('GetBalanceUseCase', () => {
  let useCase: GetBalanceUseCase;
  let balanceRepository: jest.Mocked<IBalanceRepository>;

  beforeEach(() => {
    balanceRepository = {
      save: jest.fn(),
      findByUserId: jest.fn(),
    } as jest.Mocked<IBalanceRepository>;

    useCase = new GetBalanceUseCase(balanceRepository);
  });

  it('should get balance for existing user', async () => {
    const userId = 'user-id';
    const balance = new Balance('balance-id', userId, 100, new Date());

    balanceRepository.findByUserId.mockResolvedValue(balance);

    const result = await useCase.execute(userId);

    expect(balanceRepository.findByUserId).toHaveBeenCalledWith(userId);
    expect(result.id).toBe('balance-id');
    expect(result.userId).toBe(userId);
    expect(result.amount).toBe(100);
  });

  it('should throw NotFoundException when balance does not exist', async () => {
    const userId = 'user-id';

    balanceRepository.findByUserId.mockResolvedValue(null);

    await expect(useCase.execute(userId)).rejects.toThrow(NotFoundException);
    expect(balanceRepository.findByUserId).toHaveBeenCalledWith(userId);
  });
});
