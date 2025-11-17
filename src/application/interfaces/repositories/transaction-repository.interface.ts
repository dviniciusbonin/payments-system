import { Transaction } from '../../../domain/entities/transaction';
import { ITransactionContext } from './transaction-context.interface';

export interface ITransactionRepository {
  save(
    transaction: Transaction,
    context?: ITransactionContext,
  ): Promise<Transaction>;
}
