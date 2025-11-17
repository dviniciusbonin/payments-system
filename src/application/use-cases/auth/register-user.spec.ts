import { ConflictException } from '@nestjs/common';
import { RegisterUserUseCase } from './register-user';
import { IUserRepository } from '../../interfaces/repositories/user-repository.interface';
import { IPasswordHasher } from '../../interfaces/services/password-hasher.interface';
import { User } from '../../../domain/entities/user';
import { Email } from '../../../domain/value-objects/email';
import { UserRole } from '../../../domain/types/user-role';

describe('RegisterUserUseCase', () => {
  let useCase: RegisterUserUseCase;
  let userRepository: jest.Mocked<IUserRepository>;
  let passwordHasher: jest.Mocked<IPasswordHasher>;

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

    useCase = new RegisterUserUseCase(userRepository, passwordHasher);
  });

  it('should register user successfully', async () => {
    const input = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: UserRole.CUSTOMER,
    };

    userRepository.findByEmail.mockResolvedValue(null);
    passwordHasher.hash.mockResolvedValue('hashed-password');

    const savedUser = new User(
      'user-id',
      input.name,
      new Email(input.email),
      'hashed-password',
      input.role,
      true,
      new Date(),
      new Date(),
    );

    userRepository.save.mockResolvedValue(savedUser);

    const result = await useCase.execute(input);

    expect(userRepository.findByEmail).toHaveBeenCalledWith(input.email);
    expect(passwordHasher.hash).toHaveBeenCalledWith(input.password);
    expect(userRepository.save).toHaveBeenCalled();
    expect(result.id).toBe('user-id');
    expect(result.name).toBe(input.name);
    expect(result.email).toBe(input.email);
    expect(result.role).toBe(input.role);
  });

  it('should reject duplicate email', async () => {
    const input = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: UserRole.CUSTOMER,
    };

    const existingUser = new User(
      'existing-id',
      'Existing User',
      new Email(input.email),
      'hash',
      UserRole.CUSTOMER,
      true,
      new Date(),
      new Date(),
    );

    userRepository.findByEmail.mockResolvedValue(existingUser);

    await expect(useCase.execute(input)).rejects.toThrow(ConflictException);
    expect(userRepository.findByEmail).toHaveBeenCalledWith(input.email);
    expect(passwordHasher.hash).not.toHaveBeenCalled();
    expect(userRepository.save).not.toHaveBeenCalled();
  });

  it('should call passwordHasher.hash with correct password', async () => {
    const input = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: UserRole.CUSTOMER,
    };

    userRepository.findByEmail.mockResolvedValue(null);
    passwordHasher.hash.mockResolvedValue('hashed-password');

    const savedUser = new User(
      'user-id',
      input.name,
      new Email(input.email),
      'hashed-password',
      input.role,
      true,
      new Date(),
      new Date(),
    );

    userRepository.save.mockResolvedValue(savedUser);

    await useCase.execute(input);

    expect(passwordHasher.hash).toHaveBeenCalledWith('password123');
  });

  it('should call repository.save with correct user', async () => {
    const input = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: UserRole.PRODUCER,
    };

    userRepository.findByEmail.mockResolvedValue(null);
    passwordHasher.hash.mockResolvedValue('hashed-password');

    const savedUser = new User(
      'user-id',
      input.name,
      new Email(input.email),
      'hashed-password',
      input.role,
      true,
      new Date(),
      new Date(),
    );

    userRepository.save.mockResolvedValue(savedUser);

    await useCase.execute(input);

    expect(userRepository.save).toHaveBeenCalled();
    const savedCall = userRepository.save.mock.calls[0][0];
    expect(savedCall.name).toBe(input.name);
    expect(savedCall.email.toString()).toBe(input.email);
    expect(savedCall.role).toBe(input.role);
    expect(savedCall.isActive).toBe(true);
  });
});
