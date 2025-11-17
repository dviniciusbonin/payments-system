import { NotFoundException } from '@nestjs/common';
import { GetUserUseCase } from './get-user';
import { IUserRepository } from '../../interfaces/repositories/user-repository.interface';
import { User } from '../../../domain/entities/user';
import { Email } from '../../../domain/value-objects/email';
import { UserRole } from '../../../domain/types/user-role';

describe('GetUserUseCase', () => {
  let useCase: GetUserUseCase;
  let userRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    userRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findByRole: jest.fn(),
      findAll: jest.fn(),
    } as jest.Mocked<IUserRepository>;

    useCase = new GetUserUseCase(userRepository);
  });

  it('should get user by id', async () => {
    const userId = 'user-id';
    const user = new User(
      userId,
      'John Doe',
      new Email('john@example.com'),
      'hashed-password',
      UserRole.CUSTOMER,
      true,
      new Date(),
      new Date(),
    );

    userRepository.findById.mockResolvedValue(user);

    const result = await useCase.execute(userId);

    expect(userRepository.findById).toHaveBeenCalledWith(userId);
    expect(result.id).toBe(userId);
    expect(result.name).toBe('John Doe');
    expect(result.email).toBe('john@example.com');
    expect(result.role).toBe(UserRole.CUSTOMER);
  });

  it('should throw NotFoundException when user does not exist', async () => {
    const userId = 'non-existent-id';

    userRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(userId)).rejects.toThrow(NotFoundException);
    expect(userRepository.findById).toHaveBeenCalledWith(userId);
  });
});
