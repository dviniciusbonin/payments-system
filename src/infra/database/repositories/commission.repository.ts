import { Injectable } from '@nestjs/common';
import { UserRole as PrismaUserRole } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { PrismaService } from '../prisma.service';
import { ICommissionRepository } from '../../../application/interfaces/repositories/commission-repository.interface';
import { Commission } from '../../../domain/entities/commission';
import { UserRoleMapper } from '../mappers/user-role.mapper';

@Injectable()
export class CommissionRepository implements ICommissionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(commission: Commission): Promise<Commission> {
    const saved = await this.prisma.commission.upsert({
      where: { id: commission.id },
      create: {
        id: commission.id,
        role: UserRoleMapper.toPrisma(commission.role),
        percentage: new Decimal(commission.percentage),
        productId: commission.productId,
      },
      update: {
        role: UserRoleMapper.toPrisma(commission.role),
        percentage: new Decimal(commission.percentage),
        productId: commission.productId,
      },
    });

    return this.toDomain({
      id: saved.id,
      role: saved.role,
      percentage: saved.percentage,
      productId: saved.productId,
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt,
    });
  }

  async findByProductId(productId: string): Promise<Commission[]> {
    const commissions = await this.prisma.commission.findMany({
      where: { productId },
    });

    return commissions.map((commission) =>
      this.toDomain({
        id: commission.id,
        role: commission.role,
        percentage: commission.percentage,
        productId: commission.productId,
        createdAt: commission.createdAt,
        updatedAt: commission.updatedAt,
      }),
    );
  }

  private toDomain(prismaCommission: {
    id: string;
    role: PrismaUserRole;
    percentage: Decimal;
    productId: string;
    createdAt: Date;
    updatedAt: Date;
  }): Commission {
    return new Commission(
      prismaCommission.id,
      UserRoleMapper.toDomain(prismaCommission.role),
      prismaCommission.percentage.toNumber(),
      prismaCommission.productId,
      prismaCommission.createdAt,
      prismaCommission.updatedAt,
    );
  }
}
