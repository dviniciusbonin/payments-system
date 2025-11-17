import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IBalanceRepository } from '../../interfaces/repositories/balance-repository.interface';

export interface GetBalanceOutput {
  id: string;
  userId: string;
  amount: number;
  updatedAt: Date;
}

@Injectable()
export class GetBalanceUseCase {
  constructor(
    @Inject('IBalanceRepository')
    private readonly balanceRepository: IBalanceRepository,
  ) {}

  async execute(userId: string): Promise<GetBalanceOutput> {
    const balance = await this.balanceRepository.findByUserId(userId);

    if (!balance) {
      throw new NotFoundException('Balance not found for this user');
    }

    return {
      id: balance.id,
      userId: balance.userId,
      amount: balance.amount,
      updatedAt: balance.updatedAt,
    };
  }
}
