import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '../../interfaces/repositories/user-repository.interface';
import { UserRole } from '../../../domain/types/user-role';

export interface ListUsersOutput {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class ListUsersUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(role?: UserRole): Promise<ListUsersOutput[]> {
    const users = role
      ? await this.userRepository.findByRole(role)
      : await this.userRepository.findAll();

    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email.toString(),
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
  }
}
