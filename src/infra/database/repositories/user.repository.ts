import { Injectable } from '@nestjs/common';
import { UserRole as PrismaUserRole } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { IUserRepository } from '../../../application/interfaces/repositories/user-repository.interface';
import { User } from '../../../domain/entities/user';
import { UserRole } from '../../../domain/types/user-role';
import { UserRoleMapper } from '../mappers/user-role.mapper';
import { Email } from '../../../domain/value-objects/email';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(user: User): Promise<User> {
    const saved = await this.prisma.user.upsert({
      where: { id: user.id },
      create: {
        id: user.id,
        name: user.name,
        email: user.email.toString(),
        passwordHash: user.passwordHash,
        role: UserRoleMapper.toPrisma(user.role),
        isActive: user.isActive,
      },
      update: {
        name: user.name,
        email: user.email.toString(),
        passwordHash: user.passwordHash,
        role: UserRoleMapper.toPrisma(user.role),
        isActive: user.isActive,
      },
    });

    return this.toDomain(saved);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return user ? this.toDomain(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return user ? this.toDomain(user) : null;
  }

  async findByRole(role: UserRole): Promise<User[]> {
    const prismaRole = UserRoleMapper.toPrisma(role);
    const users = await this.prisma.user.findMany({
      where: { role: prismaRole },
    });
    return users.map((user) => this.toDomain(user));
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return users.map((user) => this.toDomain(user));
  }

  private toDomain(prismaUser: {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    role: PrismaUserRole;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return new User(
      prismaUser.id,
      prismaUser.name,
      new Email(prismaUser.email),
      prismaUser.passwordHash,
      UserRoleMapper.toDomain(prismaUser.role),
      prismaUser.isActive,
      prismaUser.createdAt,
      prismaUser.updatedAt,
    );
  }
}
