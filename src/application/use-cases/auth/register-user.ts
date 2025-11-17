import { Injectable, ConflictException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { IUserRepository } from '../../interfaces/repositories/user-repository.interface';
import { IPasswordHasher } from '../../interfaces/services/password-hasher.interface';
import { User } from '../../../domain/entities/user';
import { UserRole } from '../../../domain/types/user-role';
import { Email } from '../../../domain/value-objects/email';

export interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface RegisterUserOutput {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IPasswordHasher')
    private readonly passwordHasher: IPasswordHasher,
  ) {}

  async execute(input: RegisterUserInput): Promise<RegisterUserOutput> {
    const existingUser = await this.userRepository.findByEmail(input.email);

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const passwordHash = await this.passwordHasher.hash(input.password);

    const user = new User(
      crypto.randomUUID(),
      input.name,
      new Email(input.email),
      passwordHash,
      input.role,
      true,
      new Date(),
      new Date(),
    );

    const createdUser = await this.userRepository.save(user);

    return {
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email.toString(),
      role: createdUser.role,
    };
  }
}
