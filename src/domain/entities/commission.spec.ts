import { Commission } from './commission';
import { UserRole } from '../types/user-role';

describe('Commission', () => {
  const validCommissionData = {
    id: 'commission-id',
    role: UserRole.PRODUCER,
    percentage: 60,
    productId: 'product-id',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe('constructor', () => {
    it('should create commission with valid data', () => {
      const commission = new Commission(
        validCommissionData.id,
        validCommissionData.role,
        validCommissionData.percentage,
        validCommissionData.productId,
        validCommissionData.createdAt,
        validCommissionData.updatedAt,
      );

      expect(commission.role).toBe(validCommissionData.role);
      expect(commission.percentage).toBe(validCommissionData.percentage);
    });

    it('should reject negative percentage', () => {
      expect(() => {
        new Commission(
          validCommissionData.id,
          validCommissionData.role,
          -1,
          validCommissionData.productId,
          validCommissionData.createdAt,
          validCommissionData.updatedAt,
        );
      }).toThrow('Commission percentage must be between 0 and 100');
    });

    it('should reject percentage greater than 100', () => {
      expect(() => {
        new Commission(
          validCommissionData.id,
          validCommissionData.role,
          101,
          validCommissionData.productId,
          validCommissionData.createdAt,
          validCommissionData.updatedAt,
        );
      }).toThrow('Commission percentage must be between 0 and 100');
    });

    it('should accept zero percentage', () => {
      const commission = new Commission(
        validCommissionData.id,
        validCommissionData.role,
        0,
        validCommissionData.productId,
        validCommissionData.createdAt,
        validCommissionData.updatedAt,
      );

      expect(commission.percentage).toBe(0);
    });

    it('should accept 100 percentage', () => {
      const commission = new Commission(
        validCommissionData.id,
        validCommissionData.role,
        100,
        validCommissionData.productId,
        validCommissionData.createdAt,
        validCommissionData.updatedAt,
      );

      expect(commission.percentage).toBe(100);
    });
  });

  describe('calculateAmount', () => {
    it('should calculate amount correctly', () => {
      const commission = new Commission(
        validCommissionData.id,
        validCommissionData.role,
        60,
        validCommissionData.productId,
        validCommissionData.createdAt,
        validCommissionData.updatedAt,
      );

      const amount = commission.calculateAmount(100);
      expect(amount).toBe(60);
    });

    it('should calculate amount with zero percentage', () => {
      const commission = new Commission(
        validCommissionData.id,
        validCommissionData.role,
        0,
        validCommissionData.productId,
        validCommissionData.createdAt,
        validCommissionData.updatedAt,
      );

      const amount = commission.calculateAmount(100);
      expect(amount).toBe(0);
    });

    it('should calculate amount with 100 percentage', () => {
      const commission = new Commission(
        validCommissionData.id,
        validCommissionData.role,
        100,
        validCommissionData.productId,
        validCommissionData.createdAt,
        validCommissionData.updatedAt,
      );

      const amount = commission.calculateAmount(100);
      expect(amount).toBe(100);
    });

    it('should calculate amount with decimal percentage', () => {
      const commission = new Commission(
        validCommissionData.id,
        validCommissionData.role,
        33.33,
        validCommissionData.productId,
        validCommissionData.createdAt,
        validCommissionData.updatedAt,
      );

      const amount = commission.calculateAmount(100);
      expect(amount).toBeCloseTo(33.33, 2);
    });
  });
});
