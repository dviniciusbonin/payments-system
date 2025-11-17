import { TransactionStatus as DomainStatus } from '../../../domain/types/transaction-status';
import { TransactionStatus as PrismaStatus } from '@prisma/client';

export class TransactionStatusMapper {
  static toDomain(prismaStatus: PrismaStatus): DomainStatus {
    return prismaStatus as DomainStatus;
  }

  static toPrisma(domainStatus: DomainStatus): PrismaStatus {
    return domainStatus as PrismaStatus;
  }
}
