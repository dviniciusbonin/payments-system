import { ITransactionContext } from './transaction-context.interface';

export interface ITransactionManager {
  execute<T>(fn: (context: ITransactionContext) => Promise<T>): Promise<T>;
}
