import { Balance } from '../../../domain/entities/balance';
import { ITransactionContext } from './transaction-context.interface';

export interface IBalanceRepository {
  findByUserId(userId: string): Promise<Balance | null>;
  save(balance: Balance, context?: ITransactionContext): Promise<Balance>;
}
