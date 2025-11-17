import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ITokenGenerator } from '../../interfaces/services/token-generator.interface';
import { IUserRepository } from '../../interfaces/repositories/user-repository.interface';

export interface ValidateTokenInput {
  token: string;
}

export interface ValidateTokenOutput {
  userId: string;
  email: string;
  role: string;
}

@Injectable()
export class ValidateTokenUseCase {
  constructor(
    @Inject('ITokenGenerator')
    private readonly tokenGenerator: ITokenGenerator,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(input: ValidateTokenInput): Promise<ValidateTokenOutput> {
    const payload = this.tokenGenerator.verify(input.token);

    if (!payload) {
      throw new UnauthorizedException('Invalid token');
    }

    const user = await this.userRepository.findById(payload.sub);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or inactive');
    }

    return {
      userId: user.id,
      email: user.email.toString(),
      role: user.role,
    };
  }
}
