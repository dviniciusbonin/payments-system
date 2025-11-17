import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { AuthController } from './controllers/auth.controller';
import { FeesController } from './controllers/fees.controller';
import { CommissionsController } from './controllers/commissions.controller';
import { PaymentsController } from './controllers/payments.controller';
import { BalancesController } from './controllers/balances.controller';
import { ProductsController } from './controllers/products.controller';
import { UsersController } from './controllers/users.controller';
import { RegisterUserUseCase } from '../../application/use-cases/auth/register-user';
import { AuthenticateUserUseCase } from '../../application/use-cases/auth/authenticate-user';
import { ValidateTokenUseCase } from '../../application/use-cases/auth/validate-token';
import { CreateFeeUseCase } from '../../application/use-cases/fees/create-fee';
import { GetFeeByCountryUseCase } from '../../application/use-cases/fees/get-fee-by-country';
import { CreateCommissionUseCase } from '../../application/use-cases/commissions/create-commission';
import { GetCommissionsUseCase } from '../../application/use-cases/commissions/get-commissions';
import { ProcessPaymentUseCase } from '../../application/use-cases/payments/process-payment';
import { GetBalanceUseCase } from '../../application/use-cases/balances/get-balance';
import { GetProductUseCase } from '../../application/use-cases/products/get-product';
import { ListProductsUseCase } from '../../application/use-cases/products/list-products';
import { CreateProductUseCase } from '../../application/use-cases/products/create-product';
import { GetUserUseCase } from '../../application/use-cases/users/get-user';
import { ListUsersUseCase } from '../../application/use-cases/users/list-users';
import { TransactionCalculator } from '../../domain/services/transaction-calculator';
import { ServicesModule } from '../services/services.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [ServicesModule, AuthModule],
  controllers: [
    HealthController,
    AuthController,
    FeesController,
    CommissionsController,
    PaymentsController,
    BalancesController,
    ProductsController,
    UsersController,
  ],
  providers: [
    RegisterUserUseCase,
    AuthenticateUserUseCase,
    ValidateTokenUseCase,
    CreateFeeUseCase,
    GetFeeByCountryUseCase,
    CreateCommissionUseCase,
    GetCommissionsUseCase,
    ProcessPaymentUseCase,
    GetBalanceUseCase,
    GetProductUseCase,
    ListProductsUseCase,
    CreateProductUseCase,
    GetUserUseCase,
    ListUsersUseCase,
    TransactionCalculator,
  ],
})
export class HttpModule {}
