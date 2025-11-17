import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { IProductRepository } from '../../interfaces/repositories/product-repository.interface';
import { IFeeRepository } from '../../interfaces/repositories/fee-repository.interface';
import { ICommissionRepository } from '../../interfaces/repositories/commission-repository.interface';
import { ITransactionRepository } from '../../interfaces/repositories/transaction-repository.interface';
import { IBalanceRepository } from '../../interfaces/repositories/balance-repository.interface';
import { IUserRepository } from '../../interfaces/repositories/user-repository.interface';
import { ITransactionManager } from '../../interfaces/repositories/transaction-manager.interface';
import { Transaction } from '../../../domain/entities/transaction';
import { TransactionSplit } from '../../../domain/entities/transaction-split';
import { Balance } from '../../../domain/entities/balance';
import { Fee } from '../../../domain/entities/fee';
import { TransactionStatus } from '../../../domain/types/transaction-status';
import { UserRole } from '../../../domain/types/user-role';
import { TransactionCalculator } from '../../../domain/services/transaction-calculator';

export interface ProcessPaymentInput {
  amount: number;
  countryCode: string;
  buyerId: string;
  productId: string;
  affiliateId?: string;
  coproducerId?: string;
}

export interface ProcessPaymentOutput {
  transactionId: string;
  amount: number;
  feeAmount: number;
  netAmount: number;
  status: string;
  splits: Array<{
    userId: string;
    role: string;
    percentage: number;
    amount: number;
  }>;
}

@Injectable()
export class ProcessPaymentUseCase {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
    @Inject('IFeeRepository')
    private readonly feeRepository: IFeeRepository,
    @Inject('ICommissionRepository')
    private readonly commissionRepository: ICommissionRepository,
    @Inject('ITransactionRepository')
    private readonly transactionRepository: ITransactionRepository,
    @Inject('IBalanceRepository')
    private readonly balanceRepository: IBalanceRepository,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('ITransactionManager')
    private readonly transactionManager: ITransactionManager,
    private readonly transactionCalculator: TransactionCalculator,
  ) {}

  async execute(input: ProcessPaymentInput): Promise<ProcessPaymentOutput> {
    const grossAmount = input.amount;

    if (grossAmount <= 0) {
      throw new BadRequestException('Amount must be positive');
    }

    const product = await this.productRepository.findById(input.productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const buyer = await this.userRepository.findById(input.buyerId);
    if (!buyer || !buyer.isActive) {
      throw new NotFoundException('Buyer not found or inactive');
    }

    const fee = await this.feeRepository.findByCountryCode(input.countryCode);
    if (!fee) {
      const defaultFee = await this.feeRepository.findDefault();
      if (!defaultFee) {
        throw new NotFoundException(
          `Fee not found for country ${input.countryCode} and no default fee configured`,
        );
      }
      const feeCalculation = this.transactionCalculator.calculateFee(
        grossAmount,
        defaultFee,
      );
      return this.processWithFee(
        input,
        grossAmount,
        defaultFee,
        feeCalculation,
      );
    }

    const feeCalculation = this.transactionCalculator.calculateFee(
      grossAmount,
      fee,
    );

    return this.processWithFee(input, grossAmount, fee, feeCalculation);
  }

  private async processWithFee(
    input: ProcessPaymentInput,
    grossAmount: number,
    fee: Fee,
    feeCalculation: { feeAmount: number; netAmount: number },
  ): Promise<ProcessPaymentOutput> {
    const commissions = await this.commissionRepository.findByProductId(
      input.productId,
    );

    if (commissions.length === 0) {
      throw new NotFoundException('No commissions configured for this product');
    }

    this.transactionCalculator.validateCommissionPercentages(commissions);

    const hasAffiliateCommission = commissions.some(
      (c) => c.role === UserRole.AFFILIATE,
    );
    const hasCoproducerCommission = commissions.some(
      (c) => c.role === UserRole.COPRODUCER,
    );

    if (hasAffiliateCommission && !input.affiliateId) {
      throw new BadRequestException(
        'Affiliate ID is required when affiliate commission is configured',
      );
    }

    if (hasCoproducerCommission && !input.coproducerId) {
      throw new BadRequestException(
        'Coproducer ID is required when coproducer commission is configured',
      );
    }

    if (input.affiliateId) {
      const affiliate = await this.userRepository.findById(input.affiliateId);
      if (!affiliate || affiliate.role !== UserRole.AFFILIATE) {
        throw new BadRequestException(
          'Affiliate ID must be a valid user with AFFILIATE role',
        );
      }
    }

    if (input.coproducerId) {
      const coproducer = await this.userRepository.findById(input.coproducerId);
      if (!coproducer || coproducer.role !== UserRole.COPRODUCER) {
        throw new BadRequestException(
          'Coproducer ID must be a valid user with COPRODUCER role',
        );
      }
    }

    const producer = await this.userRepository.findByRole(UserRole.PRODUCER);
    if (producer.length === 0) {
      throw new NotFoundException('Producer not found');
    }

    const platform = await this.userRepository.findByRole(UserRole.PLATFORM);
    if (platform.length === 0) {
      throw new NotFoundException('Platform user not found');
    }

    const participants = {
      producerId: producer[0].id,
      affiliateId: input.affiliateId,
      coproducerId: input.coproducerId,
      platformId: platform[0].id,
    };

    const splits = this.transactionCalculator.calculateCommissions(
      feeCalculation.netAmount,
      commissions,
      participants,
    );

    const transactionId = crypto.randomUUID();

    const transactionSplits = splits.map(
      (split) =>
        new TransactionSplit(
          crypto.randomUUID(),
          transactionId,
          split.userId,
          split.role,
          split.percentage,
          split.amount,
          new Date(),
        ),
    );

    const transaction = new Transaction(
      transactionId,
      grossAmount,
      input.countryCode,
      TransactionStatus.APPROVED,
      feeCalculation.feeAmount,
      feeCalculation.netAmount,
      input.buyerId,
      input.productId,
      transactionSplits,
      new Date(),
      new Date(),
    );

    const balances: Balance[] = [];

    for (const split of splits) {
      let balance = await this.balanceRepository.findByUserId(split.userId);

      if (!balance) {
        balance = new Balance(crypto.randomUUID(), split.userId, 0, new Date());
      }

      balance.add(split.amount);
      balances.push(balance);
    }

    await this.transactionManager.execute(async (context) => {
      await this.transactionRepository.save(transaction, context);

      for (const balance of balances) {
        await this.balanceRepository.save(balance, context);
      }
    });

    return {
      transactionId: transaction.id,
      amount: grossAmount,
      feeAmount: feeCalculation.feeAmount,
      netAmount: feeCalculation.netAmount,
      status: transaction.status,
      splits: splits.map((split) => ({
        userId: split.userId,
        role: split.role,
        percentage: split.percentage,
        amount: split.amount,
      })),
    };
  }
}
