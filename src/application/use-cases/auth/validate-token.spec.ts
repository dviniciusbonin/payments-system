import { UnauthorizedException } from '@nestjs/common';
import { ValidateTokenUseCase } from './validate-token';
import { ITokenGenerator } from '../../interfaces/services/token-generator.interface';
import { IUserRepository } from '../../interfaces/repositories/user-repository.interface';
import { User } from '../../../domain/entities/user';
import { Email } from '../../../domain/value-objects/email';
import { UserRole } from '../../../domain/types/user-role';

describe('ValidateTokenUseCase', () => {
  let useCase: ValidateTokenUseCase;
  let tokenGenerator: jest.Mocked<ITokenGenerator>;
  let userRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    tokenGenerator = {
      generate: jest.fn(),
      verify: jest.fn(),
    } as jest.Mocked<ITokenGenerator>;

    userRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findByRole: jest.fn(),
      findAll: jest.fn(),
    } as jest.Mocked<IUserRepository>;

    useCase = new ValidateTokenUseCase(tokenGenerator, userRepository);
  });

  it('should validate token and return user data', async () => {
    const input = {
      token: 'valid-token',
    };

    const payload = {
      sub: 'user-id',
      email: 'john@example.com',
      role: UserRole.CUSTOMER,
    };

    const user = new User(
      'user-id',
      'John Doe',
      new Email('john@example.com'),
      'hashed-password',
      UserRole.CUSTOMER,
      true,
      new Date(),
      new Date(),
    );

    tokenGenerator.verify.mockReturnValue(payload);
    userRepository.findById.mockResolvedValue(user);

    const result = await useCase.execute(input);

    expect(tokenGenerator.verify).toHaveBeenCalledWith(input.token);
    expect(userRepository.findById).toHaveBeenCalledWith('user-id');
    expect(result.userId).toBe('user-id');
    expect(result.email).toBe('john@example.com');
    expect(result.role).toBe(UserRole.CUSTOMER);
  });

  it('should reject invalid token', async () => {
    const input = {
      token: 'invalid-token',
    };

    tokenGenerator.verify.mockReturnValue(null);

    await expect(useCase.execute(input)).rejects.toThrow(UnauthorizedException);
    expect(tokenGenerator.verify).toHaveBeenCalledWith(input.token);
    expect(userRepository.findById).not.toHaveBeenCalled();
  });

  it('should reject when user not found', async () => {
    const input = {
      token: 'valid-token',
    };

    const payload = {
      sub: 'user-id',
      email: 'john@example.com',
      role: UserRole.CUSTOMER,
    };

    tokenGenerator.verify.mockReturnValue(payload);
    userRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(input)).rejects.toThrow(UnauthorizedException);
    expect(userRepository.findById).toHaveBeenCalledWith('user-id');
  });

  it('should reject when user is inactive', async () => {
    const input = {
      token: 'valid-token',
    };

    const payload = {
      sub: 'user-id',
      email: 'john@example.com',
      role: UserRole.CUSTOMER,
    };

    const user = new User(
      'user-id',
      'John Doe',
      new Email('john@example.com'),
      'hashed-password',
      UserRole.CUSTOMER,
      false,
      new Date(),
      new Date(),
    );

    tokenGenerator.verify.mockReturnValue(payload);
    userRepository.findById.mockResolvedValue(user);

    await expect(useCase.execute(input)).rejects.toThrow(UnauthorizedException);
  });
});
