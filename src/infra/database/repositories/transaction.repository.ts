import { Injectable } from '@nestjs/common';
import { TransactionStatus as PrismaStatus } from '@prisma/client';
import { UserRole as PrismaUserRole } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { ITransactionRepository } from '../../../application/interfaces/repositories/transaction-repository.interface';
import { ITransactionContext } from '../../../application/interfaces/repositories/transaction-context.interface';
import { Transaction } from '../../../domain/entities/transaction';
import { TransactionSplit } from '../../../domain/entities/transaction-split';
import { TransactionStatusMapper } from '../mappers/transaction-status.mapper';
import { UserRoleMapper } from '../mappers/user-role.mapper';

type PrismaTransactionClient = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$extends'
>;

@Injectable()
export class TransactionRepository implements ITransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(
    transaction: Transaction,
    context?: ITransactionContext,
  ): Promise<Transaction> {
    if (context) {
      const client = context as unknown as PrismaTransactionClient;
      return this.saveInTransaction(client, transaction);
    } else {
      return await this.prisma.$transaction(async (tx) => {
        return this.saveInTransaction(tx, transaction);
      });
    }
  }

  private async saveInTransaction(
    client: PrismaTransactionClient,
    transaction: Transaction,
  ): Promise<Transaction> {
    const savedTransaction = await client.transaction.upsert({
      where: { id: transaction.id },
      create: {
        id: transaction.id,
        amount: new Decimal(transaction.amount),
        countryCode: transaction.countryCode,
        status: TransactionStatusMapper.toPrisma(transaction.status),
        feeAmount: new Decimal(transaction.feeAmount),
        netAmount: new Decimal(transaction.netAmount),
        buyerId: transaction.buyerId,
        productId: transaction.productId,
      },
      update: {
        amount: new Decimal(transaction.amount),
        countryCode: transaction.countryCode,
        status: TransactionStatusMapper.toPrisma(transaction.status),
        feeAmount: new Decimal(transaction.feeAmount),
        netAmount: new Decimal(transaction.netAmount),
        buyerId: transaction.buyerId,
        productId: transaction.productId,
      },
    });

    await Promise.all(
      transaction.splits.map((split) =>
        client.transactionSplit.upsert({
          where: { id: split.id },
          create: {
            id: split.id,
            transactionId: split.transactionId,
            userId: split.userId,
            role: UserRoleMapper.toPrisma(split.role),
            percentage: new Decimal(split.percentage),
            amount: new Decimal(split.amount),
          },
          update: {
            transactionId: split.transactionId,
            userId: split.userId,
            role: UserRoleMapper.toPrisma(split.role),
            percentage: new Decimal(split.percentage),
            amount: new Decimal(split.amount),
          },
        }),
      ),
    );

    const savedSplits = await client.transactionSplit.findMany({
      where: { transactionId: transaction.id },
    });

    return this.toDomainWithSplits(savedTransaction, savedSplits);
  }

  private toDomainWithSplits(
    prismaTransaction: {
      id: string;
      amount: Decimal;
      countryCode: string;
      status: PrismaStatus;
      feeAmount: Decimal;
      netAmount: Decimal;
      buyerId: string;
      productId: string;
      createdAt: Date;
      updatedAt: Date;
    },
    prismaSplits: Array<{
      id: string;
      transactionId: string;
      userId: string;
      role: PrismaUserRole;
      percentage: Decimal;
      amount: Decimal;
      createdAt: Date;
    }>,
  ): Transaction {
    const splits = prismaSplits.map((split) =>
      this.toDomainSplit({
        id: split.id,
        transactionId: split.transactionId,
        userId: split.userId,
        role: split.role,
        percentage: split.percentage,
        amount: split.amount,
        createdAt: split.createdAt,
      }),
    );

    return new Transaction(
      prismaTransaction.id,
      prismaTransaction.amount.toNumber(),
      prismaTransaction.countryCode,
      TransactionStatusMapper.toDomain(prismaTransaction.status),
      prismaTransaction.feeAmount.toNumber(),
      prismaTransaction.netAmount.toNumber(),
      prismaTransaction.buyerId,
      prismaTransaction.productId,
      splits,
      prismaTransaction.createdAt,
      prismaTransaction.updatedAt,
    );
  }

  private toDomainSplit(prismaSplit: {
    id: string;
    transactionId: string;
    userId: string;
    role: PrismaUserRole;
    percentage: Decimal;
    amount: Decimal;
    createdAt: Date;
  }): TransactionSplit {
    return new TransactionSplit(
      prismaSplit.id,
      prismaSplit.transactionId,
      prismaSplit.userId,
      UserRoleMapper.toDomain(prismaSplit.role),
      prismaSplit.percentage.toNumber(),
      prismaSplit.amount.toNumber(),
      prismaSplit.createdAt,
    );
  }
}
