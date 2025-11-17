import { TransactionSplit } from './transaction-split';
import { UserRole } from '../types/user-role';

describe('TransactionSplit', () => {
  const validSplitData = {
    id: 'split-id',
    transactionId: 'transaction-id',
    userId: 'user-id',
    role: UserRole.PRODUCER,
    percentage: 60,
    amount: 57.3,
    createdAt: new Date(),
  };

  describe('constructor', () => {
    it('should create split with valid data', () => {
      const split = new TransactionSplit(
        validSplitData.id,
        validSplitData.transactionId,
        validSplitData.userId,
        validSplitData.role,
        validSplitData.percentage,
        validSplitData.amount,
        validSplitData.createdAt,
      );

      expect(split.role).toBe(validSplitData.role);
      expect(split.percentage).toBe(validSplitData.percentage);
      expect(split.amount).toBe(validSplitData.amount);
    });

    it('should reject negative percentage', () => {
      expect(() => {
        new TransactionSplit(
          validSplitData.id,
          validSplitData.transactionId,
          validSplitData.userId,
          validSplitData.role,
          -1,
          validSplitData.amount,
          validSplitData.createdAt,
        );
      }).toThrow('Percentage must be between 0 and 100');
    });

    it('should reject percentage greater than 100', () => {
      expect(() => {
        new TransactionSplit(
          validSplitData.id,
          validSplitData.transactionId,
          validSplitData.userId,
          validSplitData.role,
          101,
          validSplitData.amount,
          validSplitData.createdAt,
        );
      }).toThrow('Percentage must be between 0 and 100');
    });

    it('should reject zero amount', () => {
      expect(() => {
        new TransactionSplit(
          validSplitData.id,
          validSplitData.transactionId,
          validSplitData.userId,
          validSplitData.role,
          validSplitData.percentage,
          0,
          validSplitData.createdAt,
        );
      }).toThrow('Split amount must be positive');
    });

    it('should reject negative amount', () => {
      expect(() => {
        new TransactionSplit(
          validSplitData.id,
          validSplitData.transactionId,
          validSplitData.userId,
          validSplitData.role,
          validSplitData.percentage,
          -10,
          validSplitData.createdAt,
        );
      }).toThrow('Split amount must be positive');
    });

    it('should accept zero percentage', () => {
      const split = new TransactionSplit(
        validSplitData.id,
        validSplitData.transactionId,
        validSplitData.userId,
        validSplitData.role,
        0,
        0.01,
        validSplitData.createdAt,
      );

      expect(split.percentage).toBe(0);
    });

    it('should accept 100 percentage', () => {
      const split = new TransactionSplit(
        validSplitData.id,
        validSplitData.transactionId,
        validSplitData.userId,
        validSplitData.role,
        100,
        100,
        validSplitData.createdAt,
      );

      expect(split.percentage).toBe(100);
    });
  });
});
