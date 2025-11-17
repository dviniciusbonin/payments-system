import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ITransactionManager } from '../../../application/interfaces/repositories/transaction-manager.interface';
import { ITransactionContext } from '../../../application/interfaces/repositories/transaction-context.interface';
import { PrismaClient } from '@prisma/client';

type PrismaTransactionClient = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$extends'
>;

@Injectable()
export class TransactionManager implements ITransactionManager {
  constructor(private readonly prisma: PrismaService) {}

  async execute<T>(
    fn: (context: ITransactionContext) => Promise<T>,
  ): Promise<T> {
    return await this.prisma.$transaction(async (tx) => {
      return fn(tx as ITransactionContext & PrismaTransactionClient);
    });
  }
}
