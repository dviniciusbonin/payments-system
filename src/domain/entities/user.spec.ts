import { User } from './user';
import { Email } from '../value-objects/email';
import { UserRole } from '../types/user-role';

describe('User', () => {
  const validUserData = {
    id: 'user-id',
    name: 'John Doe',
    email: new Email('john@example.com'),
    passwordHash: 'hashed-password',
    role: UserRole.CUSTOMER,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe('constructor', () => {
    it('should create user with valid data', () => {
      const user = new User(
        validUserData.id,
        validUserData.name,
        validUserData.email,
        validUserData.passwordHash,
        validUserData.role,
        validUserData.isActive,
        validUserData.createdAt,
        validUserData.updatedAt,
      );

      expect(user.id).toBe(validUserData.id);
      expect(user.name).toBe(validUserData.name);
      expect(user.email).toBe(validUserData.email);
      expect(user.role).toBe(validUserData.role);
    });

    it('should reject empty name', () => {
      expect(() => {
        new User(
          validUserData.id,
          '',
          validUserData.email,
          validUserData.passwordHash,
          validUserData.role,
          validUserData.isActive,
          validUserData.createdAt,
          validUserData.updatedAt,
        );
      }).toThrow('Name is required');
    });

    it('should reject name with only whitespace', () => {
      expect(() => {
        new User(
          validUserData.id,
          '   ',
          validUserData.email,
          validUserData.passwordHash,
          validUserData.role,
          validUserData.isActive,
          validUserData.createdAt,
          validUserData.updatedAt,
        );
      }).toThrow('Name is required');
    });
  });

  describe('isProducer', () => {
    it('should return true for PRODUCER role', () => {
      const user = new User(
        validUserData.id,
        validUserData.name,
        validUserData.email,
        validUserData.passwordHash,
        UserRole.PRODUCER,
        validUserData.isActive,
        validUserData.createdAt,
        validUserData.updatedAt,
      );

      expect(user.isProducer()).toBe(true);
    });

    it('should return false for other roles', () => {
      const user = new User(
        validUserData.id,
        validUserData.name,
        validUserData.email,
        validUserData.passwordHash,
        UserRole.CUSTOMER,
        validUserData.isActive,
        validUserData.createdAt,
        validUserData.updatedAt,
      );

      expect(user.isProducer()).toBe(false);
    });
  });

  describe('isAffiliate', () => {
    it('should return true for AFFILIATE role', () => {
      const user = new User(
        validUserData.id,
        validUserData.name,
        validUserData.email,
        validUserData.passwordHash,
        UserRole.AFFILIATE,
        validUserData.isActive,
        validUserData.createdAt,
        validUserData.updatedAt,
      );

      expect(user.isAffiliate()).toBe(true);
    });

    it('should return false for other roles', () => {
      const user = new User(
        validUserData.id,
        validUserData.name,
        validUserData.email,
        validUserData.passwordHash,
        UserRole.CUSTOMER,
        validUserData.isActive,
        validUserData.createdAt,
        validUserData.updatedAt,
      );

      expect(user.isAffiliate()).toBe(false);
    });
  });

  describe('isCoproducer', () => {
    it('should return true for COPRODUCER role', () => {
      const user = new User(
        validUserData.id,
        validUserData.name,
        validUserData.email,
        validUserData.passwordHash,
        UserRole.COPRODUCER,
        validUserData.isActive,
        validUserData.createdAt,
        validUserData.updatedAt,
      );

      expect(user.isCoproducer()).toBe(true);
    });

    it('should return false for other roles', () => {
      const user = new User(
        validUserData.id,
        validUserData.name,
        validUserData.email,
        validUserData.passwordHash,
        UserRole.CUSTOMER,
        validUserData.isActive,
        validUserData.createdAt,
        validUserData.updatedAt,
      );

      expect(user.isCoproducer()).toBe(false);
    });
  });

  describe('isPlatform', () => {
    it('should return true for PLATFORM role', () => {
      const user = new User(
        validUserData.id,
        validUserData.name,
        validUserData.email,
        validUserData.passwordHash,
        UserRole.PLATFORM,
        validUserData.isActive,
        validUserData.createdAt,
        validUserData.updatedAt,
      );

      expect(user.isPlatform()).toBe(true);
    });

    it('should return false for other roles', () => {
      const user = new User(
        validUserData.id,
        validUserData.name,
        validUserData.email,
        validUserData.passwordHash,
        UserRole.CUSTOMER,
        validUserData.isActive,
        validUserData.createdAt,
        validUserData.updatedAt,
      );

      expect(user.isPlatform()).toBe(false);
    });
  });
});
