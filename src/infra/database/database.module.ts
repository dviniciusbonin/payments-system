import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { TransactionManager } from './repositories/transaction-manager.repository';
import { UserRepository } from './repositories/user.repository';
import { ProductRepository } from './repositories/product.repository';
import { BalanceRepository } from './repositories/balance.repository';
import { FeeRepository } from './repositories/fee.repository';
import { CommissionRepository } from './repositories/commission.repository';
import { TransactionRepository } from './repositories/transaction.repository';

@Global()
@Module({
  providers: [
    PrismaService,
    {
      provide: 'ITransactionManager',
      useClass: TransactionManager,
    },
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    {
      provide: 'IProductRepository',
      useClass: ProductRepository,
    },
    {
      provide: 'IBalanceRepository',
      useClass: BalanceRepository,
    },
    {
      provide: 'IFeeRepository',
      useClass: FeeRepository,
    },
    {
      provide: 'ICommissionRepository',
      useClass: CommissionRepository,
    },
    {
      provide: 'ITransactionRepository',
      useClass: TransactionRepository,
    },
  ],
  exports: [
    PrismaService,
    'ITransactionManager',
    'IUserRepository',
    'IProductRepository',
    'IBalanceRepository',
    'IFeeRepository',
    'ICommissionRepository',
    'ITransactionRepository',
  ],
})
export class DatabaseModule {}
