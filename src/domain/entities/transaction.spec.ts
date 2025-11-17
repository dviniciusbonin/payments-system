import { Transaction } from './transaction';
import { TransactionSplit } from './transaction-split';
import { TransactionStatus } from '../types/transaction-status';
import { UserRole } from '../types/user-role';

describe('Transaction', () => {
  const validTransactionData = {
    id: 'transaction-id',
    amount: 100,
    countryCode: 'BR',
    status: TransactionStatus.APPROVED,
    feeAmount: 4.5,
    netAmount: 95.5,
    buyerId: 'buyer-id',
    productId: 'product-id',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe('constructor', () => {
    it('should create transaction with valid data', () => {
      const splits: TransactionSplit[] = [];
      const transaction = new Transaction(
        validTransactionData.id,
        validTransactionData.amount,
        validTransactionData.countryCode,
        validTransactionData.status,
        validTransactionData.feeAmount,
        validTransactionData.netAmount,
        validTransactionData.buyerId,
        validTransactionData.productId,
        splits,
        validTransactionData.createdAt,
        validTransactionData.updatedAt,
      );

      expect(transaction.amount).toBe(validTransactionData.amount);
      expect(transaction.countryCode).toBe(validTransactionData.countryCode);
      expect(transaction.status).toBe(validTransactionData.status);
    });

    it('should reject zero amount', () => {
      expect(() => {
        new Transaction(
          validTransactionData.id,
          0,
          validTransactionData.countryCode,
          validTransactionData.status,
          validTransactionData.feeAmount,
          validTransactionData.netAmount,
          validTransactionData.buyerId,
          validTransactionData.productId,
          [],
          validTransactionData.createdAt,
          validTransactionData.updatedAt,
        );
      }).toThrow('Transaction amount must be positive');
    });

    it('should reject negative amount', () => {
      expect(() => {
        new Transaction(
          validTransactionData.id,
          -10,
          validTransactionData.countryCode,
          validTransactionData.status,
          validTransactionData.feeAmount,
          validTransactionData.netAmount,
          validTransactionData.buyerId,
          validTransactionData.productId,
          [],
          validTransactionData.createdAt,
          validTransactionData.updatedAt,
        );
      }).toThrow('Transaction amount must be positive');
    });

    it('should reject invalid country code length', () => {
      expect(() => {
        new Transaction(
          validTransactionData.id,
          validTransactionData.amount,
          'B',
          validTransactionData.status,
          validTransactionData.feeAmount,
          validTransactionData.netAmount,
          validTransactionData.buyerId,
          validTransactionData.productId,
          [],
          validTransactionData.createdAt,
          validTransactionData.updatedAt,
        );
      }).toThrow('Country code must be 2 characters (ISO 3166-1 alpha-2)');
    });

    it('should reject negative fee amount', () => {
      expect(() => {
        new Transaction(
          validTransactionData.id,
          validTransactionData.amount,
          validTransactionData.countryCode,
          validTransactionData.status,
          -1,
          validTransactionData.netAmount,
          validTransactionData.buyerId,
          validTransactionData.productId,
          [],
          validTransactionData.createdAt,
          validTransactionData.updatedAt,
        );
      }).toThrow('Fee amount cannot be negative');
    });

    it('should reject zero or negative net amount', () => {
      expect(() => {
        new Transaction(
          validTransactionData.id,
          validTransactionData.amount,
          validTransactionData.countryCode,
          validTransactionData.status,
          validTransactionData.feeAmount,
          0,
          validTransactionData.buyerId,
          validTransactionData.productId,
          [],
          validTransactionData.createdAt,
          validTransactionData.updatedAt,
        );
      }).toThrow('Net amount must be positive');
    });

    it('should reject net amount that does not equal amount minus fee amount', () => {
      expect(() => {
        new Transaction(
          validTransactionData.id,
          100,
          validTransactionData.countryCode,
          validTransactionData.status,
          4.5,
          100,
          validTransactionData.buyerId,
          validTransactionData.productId,
          [],
          validTransactionData.createdAt,
          validTransactionData.updatedAt,
        );
      }).toThrow('Net amount must equal amount minus fee amount');
    });
  });

  describe('splits', () => {
    it('should store and return splits', () => {
      const split = new TransactionSplit(
        'split-id',
        validTransactionData.id,
        'user-id',
        UserRole.PRODUCER,
        60,
        57.3,
        new Date(),
      );

      const transaction = new Transaction(
        validTransactionData.id,
        validTransactionData.amount,
        validTransactionData.countryCode,
        validTransactionData.status,
        validTransactionData.feeAmount,
        validTransactionData.netAmount,
        validTransactionData.buyerId,
        validTransactionData.productId,
        [split],
        validTransactionData.createdAt,
        validTransactionData.updatedAt,
      );

      expect(transaction.splits).toHaveLength(1);
      expect(transaction.splits[0]).toBe(split);
    });
  });

  describe('status methods', () => {
    it('should return true for isApproved when status is APPROVED', () => {
      const transaction = new Transaction(
        validTransactionData.id,
        validTransactionData.amount,
        validTransactionData.countryCode,
        TransactionStatus.APPROVED,
        validTransactionData.feeAmount,
        validTransactionData.netAmount,
        validTransactionData.buyerId,
        validTransactionData.productId,
        [],
        validTransactionData.createdAt,
        validTransactionData.updatedAt,
      );

      expect(transaction.isApproved()).toBe(true);
      expect(transaction.isPending()).toBe(false);
      expect(transaction.isRejected()).toBe(false);
    });

    it('should return true for isPending when status is PENDING', () => {
      const transaction = new Transaction(
        validTransactionData.id,
        validTransactionData.amount,
        validTransactionData.countryCode,
        TransactionStatus.PENDING,
        validTransactionData.feeAmount,
        validTransactionData.netAmount,
        validTransactionData.buyerId,
        validTransactionData.productId,
        [],
        validTransactionData.createdAt,
        validTransactionData.updatedAt,
      );

      expect(transaction.isApproved()).toBe(false);
      expect(transaction.isPending()).toBe(true);
      expect(transaction.isRejected()).toBe(false);
    });

    it('should return true for isRejected when status is REJECTED', () => {
      const transaction = new Transaction(
        validTransactionData.id,
        validTransactionData.amount,
        validTransactionData.countryCode,
        TransactionStatus.REJECTED,
        validTransactionData.feeAmount,
        validTransactionData.netAmount,
        validTransactionData.buyerId,
        validTransactionData.productId,
        [],
        validTransactionData.createdAt,
        validTransactionData.updatedAt,
      );

      expect(transaction.isApproved()).toBe(false);
      expect(transaction.isPending()).toBe(false);
      expect(transaction.isRejected()).toBe(true);
    });
  });
});
