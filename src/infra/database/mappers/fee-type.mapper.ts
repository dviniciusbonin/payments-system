import { FeeType as DomainFeeType } from '../../../domain/types/fee-type';
import { FeeType as PrismaFeeType } from '@prisma/client';

export class FeeTypeMapper {
  static toDomain(prismaType: PrismaFeeType): DomainFeeType {
    return prismaType as DomainFeeType;
  }

  static toPrisma(domainType: DomainFeeType): PrismaFeeType {
    return domainType as PrismaFeeType;
  }
}
