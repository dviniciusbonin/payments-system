import { Balance } from './balance';

describe('Balance', () => {
  describe('constructor', () => {
    it('should create balance with valid value', () => {
      const balance = new Balance('id', 'userId', 100, new Date());
      expect(balance.amount).toBe(100);
    });

    it('should reject negative balance', () => {
      expect(() => new Balance('id', 'userId', -10, new Date())).toThrow(
        'Balance cannot be negative',
      );
    });

    it('should accept zero balance', () => {
      const balance = new Balance('id', 'userId', 0, new Date());
      expect(balance.amount).toBe(0);
    });
  });

  describe('add', () => {
    it('should add positive amount', () => {
      const initialDate = new Date('2024-01-01T00:00:00.000Z');
      const balance = new Balance('id', 'userId', 100, initialDate);

      balance.add(50);

      expect(balance.amount).toBe(150);
      expect(balance.updatedAt.getTime()).toBeGreaterThanOrEqual(
        initialDate.getTime(),
      );
    });

    it('should reject adding zero', () => {
      const balance = new Balance('id', 'userId', 100, new Date());
      expect(() => balance.add(0)).toThrow('Amount to add must be positive');
    });

    it('should reject adding negative amount', () => {
      const balance = new Balance('id', 'userId', 100, new Date());
      expect(() => balance.add(-10)).toThrow('Amount to add must be positive');
    });
  });

  describe('subtract', () => {
    it('should subtract positive amount', () => {
      const initialDate = new Date('2024-01-01T00:00:00.000Z');
      const balance = new Balance('id', 'userId', 100, initialDate);

      balance.subtract(30);

      expect(balance.amount).toBe(70);
      expect(balance.updatedAt.getTime()).toBeGreaterThanOrEqual(
        initialDate.getTime(),
      );
    });

    it('should reject subtracting zero', () => {
      const balance = new Balance('id', 'userId', 100, new Date());
      expect(() => balance.subtract(0)).toThrow(
        'Amount to subtract must be positive',
      );
    });

    it('should reject subtracting negative amount', () => {
      const balance = new Balance('id', 'userId', 100, new Date());
      expect(() => balance.subtract(-10)).toThrow(
        'Amount to subtract must be positive',
      );
    });

    it('should reject subtracting amount that would make balance negative', () => {
      const balance = new Balance('id', 'userId', 50, new Date());
      expect(() => balance.subtract(100)).toThrow('Balance cannot be negative');
    });

    it('should allow subtracting exact balance amount', () => {
      const balance = new Balance('id', 'userId', 50, new Date());
      balance.subtract(50);
      expect(balance.amount).toBe(0);
    });
  });

  describe('getters', () => {
    it('should return amount', () => {
      const balance = new Balance('id', 'userId', 100, new Date());
      expect(balance.amount).toBe(100);
    });

    it('should return updatedAt', () => {
      const date = new Date();
      const balance = new Balance('id', 'userId', 100, date);
      expect(balance.updatedAt).toBe(date);
    });
  });
});
