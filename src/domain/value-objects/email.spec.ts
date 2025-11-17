import { Email } from './email';

describe('Email', () => {
  describe('constructor', () => {
    it('should create email with valid format', () => {
      const email = new Email('test@example.com');
      expect(email.toString()).toBe('test@example.com');
    });

    it('should reject empty email', () => {
      expect(() => new Email('')).toThrow('Email is required');
      expect(() => new Email('   ')).toThrow('Email is required');
    });

    it('should reject invalid email format', () => {
      expect(() => new Email('invalid')).toThrow('Invalid email format');
      expect(() => new Email('invalid@')).toThrow('Invalid email format');
      expect(() => new Email('@example.com')).toThrow('Invalid email format');
      expect(() => new Email('invalid@example')).toThrow(
        'Invalid email format',
      );
      expect(() => new Email('invalid example.com')).toThrow(
        'Invalid email format',
      );
    });

    it('should normalize email to lowercase', () => {
      const email = new Email('TEST@EXAMPLE.COM');
      expect(email.toString()).toBe('test@example.com');
    });

    it('should reject email with whitespace', () => {
      expect(() => new Email('  test@example.com  ')).toThrow(
        'Invalid email format',
      );
    });
  });

  describe('equals', () => {
    it('should return true for same email', () => {
      const email1 = new Email('test@example.com');
      const email2 = new Email('test@example.com');
      expect(email1.equals(email2)).toBe(true);
    });

    it('should return false for different emails', () => {
      const email1 = new Email('test@example.com');
      const email2 = new Email('other@example.com');
      expect(email1.equals(email2)).toBe(false);
    });

    it('should be case insensitive', () => {
      const email1 = new Email('TEST@EXAMPLE.COM');
      const email2 = new Email('test@example.com');
      expect(email1.equals(email2)).toBe(true);
    });
  });
});
