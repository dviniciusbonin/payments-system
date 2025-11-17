import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { IUserRepository } from '../../interfaces/repositories/user-repository.interface';
import { IPasswordHasher } from '../../interfaces/services/password-hasher.interface';
import { ITokenGenerator } from '../../interfaces/services/token-generator.interface';

export interface AuthenticateUserInput {
  email: string;
  password: string;
}

export interface AuthenticateUserOutput {
  accessToken: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

@Injectable()
export class AuthenticateUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IPasswordHasher')
    private readonly passwordHasher: IPasswordHasher,
    @Inject('ITokenGenerator')
    private readonly tokenGenerator: ITokenGenerator,
  ) {}

  async execute(input: AuthenticateUserInput): Promise<AuthenticateUserOutput> {
    const user = await this.userRepository.findByEmail(input.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User is inactive');
    }

    const isPasswordValid = await this.passwordHasher.compare(
      input.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.tokenGenerator.generate({
      sub: user.id,
      email: user.email.toString(),
      role: user.role,
    });

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email.toString(),
        role: user.role,
      },
    };
  }
}
