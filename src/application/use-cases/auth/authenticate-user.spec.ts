import { UnauthorizedException } from '@nestjs/common';
import { AuthenticateUserUseCase } from './authenticate-user';
import { IUserRepository } from '../../interfaces/repositories/user-repository.interface';
import { IPasswordHasher } from '../../interfaces/services/password-hasher.interface';
import { ITokenGenerator } from '../../interfaces/services/token-generator.interface';
import { User } from '../../../domain/entities/user';
import { Email } from '../../../domain/value-objects/email';
import { UserRole } from '../../../domain/types/user-role';

describe('AuthenticateUserUseCase', () => {
  let useCase: AuthenticateUserUseCase;
  let userRepository: jest.Mocked<IUserRepository>;
  let passwordHasher: jest.Mocked<IPasswordHasher>;
  let tokenGenerator: jest.Mocked<ITokenGenerator>;

  beforeEach(() => {
    userRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findByRole: jest.fn(),
      findAll: jest.fn(),
    } as jest.Mocked<IUserRepository>;

    passwordHasher = {
      hash: jest.fn(),
      compare: jest.fn(),
    } as jest.Mocked<IPasswordHasher>;

    tokenGenerator = {
      generate: jest.fn(),
      verify: jest.fn(),
    } as jest.Mocked<ITokenGenerator>;

    useCase = new AuthenticateUserUseCase(
      userRepository,
      passwordHasher,
      tokenGenerator,
    );
  });

  it('should authenticate user with valid credentials', async () => {
    const input = {
      email: 'john@example.com',
      password: 'password123',
    };

    const user = new User(
      'user-id',
      'John Doe',
      new Email(input.email),
      'hashed-password',
      UserRole.CUSTOMER,
      true,
      new Date(),
      new Date(),
    );

    userRepository.findByEmail.mockResolvedValue(user);
    passwordHasher.compare.mockResolvedValue(true);
    tokenGenerator.generate.mockReturnValue('access-token');

    const result = await useCase.execute(input);

    expect(userRepository.findByEmail).toHaveBeenCalledWith(input.email);
    expect(passwordHasher.compare).toHaveBeenCalledWith(
      input.password,
      user.passwordHash,
    );
    expect(tokenGenerator.generate).toHaveBeenCalledWith({
      sub: user.id,
      email: input.email,
      role: user.role,
    });
    expect(result.accessToken).toBe('access-token');
    expect(result.user.id).toBe('user-id');
    expect(result.user.email).toBe(input.email);
    expect(result.user.role).toBe(user.role);
  });

  it('should reject non-existent email', async () => {
    const input = {
      email: 'nonexistent@example.com',
      password: 'password123',
    };

    userRepository.findByEmail.mockResolvedValue(null);

    await expect(useCase.execute(input)).rejects.toThrow(UnauthorizedException);
    expect(userRepository.findByEmail).toHaveBeenCalledWith(input.email);
    expect(passwordHasher.compare).not.toHaveBeenCalled();
    expect(tokenGenerator.generate).not.toHaveBeenCalled();
  });

  it('should reject incorrect password', async () => {
    const input = {
      email: 'john@example.com',
      password: 'wrong-password',
    };

    const user = new User(
      'user-id',
      'John Doe',
      new Email(input.email),
      'hashed-password',
      UserRole.CUSTOMER,
      true,
      new Date(),
      new Date(),
    );

    userRepository.findByEmail.mockResolvedValue(user);
    passwordHasher.compare.mockResolvedValue(false);

    await expect(useCase.execute(input)).rejects.toThrow(UnauthorizedException);
    expect(passwordHasher.compare).toHaveBeenCalled();
    expect(tokenGenerator.generate).not.toHaveBeenCalled();
  });

  it('should reject inactive user', async () => {
    const input = {
      email: 'john@example.com',
      password: 'password123',
    };

    const user = new User(
      'user-id',
      'John Doe',
      new Email(input.email),
      'hashed-password',
      UserRole.CUSTOMER,
      false,
      new Date(),
      new Date(),
    );

    userRepository.findByEmail.mockResolvedValue(user);

    await expect(useCase.execute(input)).rejects.toThrow(UnauthorizedException);
    expect(passwordHasher.compare).not.toHaveBeenCalled();
    expect(tokenGenerator.generate).not.toHaveBeenCalled();
  });
});
