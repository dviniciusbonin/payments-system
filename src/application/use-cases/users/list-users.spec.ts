import { ListUsersUseCase } from './list-users';
import { IUserRepository } from '../../interfaces/repositories/user-repository.interface';
import { User } from '../../../domain/entities/user';
import { Email } from '../../../domain/value-objects/email';
import { UserRole } from '../../../domain/types/user-role';

describe('ListUsersUseCase', () => {
  let useCase: ListUsersUseCase;
  let userRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    userRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findByRole: jest.fn(),
      findAll: jest.fn(),
    } as jest.Mocked<IUserRepository>;

    useCase = new ListUsersUseCase(userRepository);
  });

  it('should list all users when role is not provided', async () => {
    const users = [
      new User(
        'id1',
        'User 1',
        new Email('user1@example.com'),
        'hash',
        UserRole.CUSTOMER,
        true,
        new Date(),
        new Date(),
      ),
      new User(
        'id2',
        'User 2',
        new Email('user2@example.com'),
        'hash',
        UserRole.PRODUCER,
        true,
        new Date(),
        new Date(),
      ),
    ];

    userRepository.findAll.mockResolvedValue(users);

    const result = await useCase.execute();

    expect(userRepository.findAll).toHaveBeenCalled();
    expect(userRepository.findByRole).not.toHaveBeenCalled();
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('id1');
    expect(result[1].id).toBe('id2');
  });

  it('should filter by role when provided', async () => {
    const role = UserRole.PRODUCER;
    const users = [
      new User(
        'id1',
        'Producer 1',
        new Email('producer1@example.com'),
        'hash',
        role,
        true,
        new Date(),
        new Date(),
      ),
    ];

    userRepository.findByRole.mockResolvedValue(users);

    const result = await useCase.execute(role);

    expect(userRepository.findByRole).toHaveBeenCalledWith(role);
    expect(userRepository.findAll).not.toHaveBeenCalled();
    expect(result).toHaveLength(1);
    expect(result[0].role).toBe(role);
  });

  it('should return empty array when no users exist', async () => {
    userRepository.findAll.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toHaveLength(0);
  });
});
