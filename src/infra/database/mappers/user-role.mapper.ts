import { UserRole as DomainUserRole } from '../../../domain/types/user-role';
import { UserRole as PrismaUserRole } from '@prisma/client';

export class UserRoleMapper {
  static toDomain(prismaRole: PrismaUserRole): DomainUserRole {
    return prismaRole as DomainUserRole;
  }

  static toPrisma(domainRole: DomainUserRole): PrismaUserRole {
    return domainRole as PrismaUserRole;
  }
}
