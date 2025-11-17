import { Injectable } from '@nestjs/common';
import { FeeType as PrismaFeeType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { PrismaService } from '../prisma.service';
import { IFeeRepository } from '../../../application/interfaces/repositories/fee-repository.interface';
import { Fee } from '../../../domain/entities/fee';
import { FeeTypeMapper } from '../mappers/fee-type.mapper';

@Injectable()
export class FeeRepository implements IFeeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(fee: Fee): Promise<Fee> {
    const saved = await this.prisma.fee.upsert({
      where: { id: fee.id },
      create: {
        id: fee.id,
        countryCode: fee.countryCode,
        feePercentage: new Decimal(fee.feePercentage),
        feeType: FeeTypeMapper.toPrisma(fee.feeType),
        isDefault: fee.isDefault,
      },
      update: {
        countryCode: fee.countryCode,
        feePercentage: new Decimal(fee.feePercentage),
        feeType: FeeTypeMapper.toPrisma(fee.feeType),
        isDefault: fee.isDefault,
      },
    });

    return this.toDomain({
      id: saved.id,
      countryCode: saved.countryCode,
      feePercentage: saved.feePercentage,
      feeType: saved.feeType,
      isDefault: saved.isDefault,
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt,
    });
  }

  async findByCountryCode(countryCode: string): Promise<Fee | null> {
    const fee = await this.prisma.fee.findUnique({
      where: { countryCode: countryCode.toUpperCase() },
    });

    return fee
      ? this.toDomain({
          id: fee.id,
          countryCode: fee.countryCode,
          feePercentage: fee.feePercentage,
          feeType: fee.feeType,
          isDefault: fee.isDefault,
          createdAt: fee.createdAt,
          updatedAt: fee.updatedAt,
        })
      : null;
  }

  async findDefault(): Promise<Fee | null> {
    const fee = await this.prisma.fee.findFirst({
      where: { isDefault: true },
    });

    return fee
      ? this.toDomain({
          id: fee.id,
          countryCode: fee.countryCode,
          feePercentage: fee.feePercentage,
          feeType: fee.feeType,
          isDefault: fee.isDefault,
          createdAt: fee.createdAt,
          updatedAt: fee.updatedAt,
        })
      : null;
  }

  private toDomain(prismaFee: {
    id: string;
    countryCode: string;
    feePercentage: Decimal;
    feeType: PrismaFeeType;
    isDefault: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): Fee {
    return new Fee(
      prismaFee.id,
      prismaFee.countryCode,
      prismaFee.feePercentage.toNumber(),
      FeeTypeMapper.toDomain(prismaFee.feeType),
      prismaFee.isDefault,
      prismaFee.createdAt,
      prismaFee.updatedAt,
    );
  }
}
