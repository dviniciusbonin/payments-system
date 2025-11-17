import { Injectable } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { IBalanceRepository } from '../../../application/interfaces/repositories/balance-repository.interface';
import { ITransactionContext } from '../../../application/interfaces/repositories/transaction-context.interface';
import { Balance } from '../../../domain/entities/balance';

type PrismaTransactionClient = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$extends'
>;

@Injectable()
export class BalanceRepository implements IBalanceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserId(userId: string): Promise<Balance | null> {
    const balance = await this.prisma.balance.findUnique({
      where: { userId },
    });

    return balance ? this.toDomain(balance) : null;
  }

  async save(
    balance: Balance,
    context?: ITransactionContext,
  ): Promise<Balance> {
    if (context) {
      const client = context as unknown as PrismaTransactionClient;
      return this.saveInTransaction(client, balance);
    } else {
      return await this.prisma.$transaction(async (tx) => {
        return this.saveInTransaction(tx, balance);
      });
    }
  }

  private async saveInTransaction(
    client: PrismaTransactionClient,
    balance: Balance,
  ): Promise<Balance> {
    const saved = await client.balance.upsert({
      where: { userId: balance.userId },
      create: {
        id: balance.id,
        userId: balance.userId,
        amount: new Decimal(balance.amount),
      },
      update: {
        amount: new Decimal(balance.amount),
      },
    });

    return this.toDomain(saved);
  }

  private toDomain(prismaBalance: {
    id: string;
    userId: string;
    amount: Decimal;
    updatedAt: Date;
  }): Balance {
    return new Balance(
      prismaBalance.id,
      prismaBalance.userId,
      prismaBalance.amount.toNumber(),
      prismaBalance.updatedAt,
    );
  }
}
