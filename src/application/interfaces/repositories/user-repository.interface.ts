import { User } from '../../../domain/entities/user';
import { UserRole } from '../../../domain/types/user-role';

export interface IUserRepository {
  save(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByRole(role: UserRole): Promise<User[]>;
  findAll(): Promise<User[]>;
}
