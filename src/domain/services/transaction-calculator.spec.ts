import { TransactionCalculator } from './transaction-calculator';
import { Fee } from '../entities/fee';
import { Commission } from '../entities/commission';
import { FeeType } from '../types/fee-type';
import { UserRole } from '../types/user-role';

describe('TransactionCalculator', () => {
  let calculator: TransactionCalculator;

  beforeEach(() => {
    calculator = new TransactionCalculator();
  });

  describe('calculateFee', () => {
    it('should calculate feeAmount and netAmount correctly', () => {
      const fee = new Fee(
        'fee-id',
        'BR',
        4.5,
        FeeType.NATIONAL,
        false,
        new Date(),
        new Date(),
      );

      const result = calculator.calculateFee(100, fee);

      expect(result.feeAmount).toBe(4.5);
      expect(result.netAmount).toBe(95.5);
    });

    it('should calculate with zero fee percentage', () => {
      const fee = new Fee(
        'fee-id',
        'BR',
        0,
        FeeType.NATIONAL,
        false,
        new Date(),
        new Date(),
      );

      const result = calculator.calculateFee(100, fee);

      expect(result.feeAmount).toBe(0);
      expect(result.netAmount).toBe(100);
    });

    it('should calculate with 100 fee percentage', () => {
      const fee = new Fee(
        'fee-id',
        'BR',
        100,
        FeeType.NATIONAL,
        false,
        new Date(),
        new Date(),
      );

      const result = calculator.calculateFee(100, fee);

      expect(result.feeAmount).toBe(100);
      expect(result.netAmount).toBe(0);
    });
  });

  describe('calculateCommissions', () => {
    it('should distribute commissions to all participants', () => {
      const commissions = [
        new Commission(
          'id1',
          UserRole.PRODUCER,
          60,
          'product-id',
          new Date(),
          new Date(),
        ),
        new Commission(
          'id2',
          UserRole.AFFILIATE,
          20,
          'product-id',
          new Date(),
          new Date(),
        ),
        new Commission(
          'id3',
          UserRole.COPRODUCER,
          10,
          'product-id',
          new Date(),
          new Date(),
        ),
        new Commission(
          'id4',
          UserRole.PLATFORM,
          10,
          'product-id',
          new Date(),
          new Date(),
        ),
      ];

      const participants = {
        producerId: 'producer-id',
        affiliateId: 'affiliate-id',
        coproducerId: 'coproducer-id',
        platformId: 'platform-id',
      };

      const splits = calculator.calculateCommissions(
        100,
        commissions,
        participants,
      );

      expect(splits).toHaveLength(4);
      expect(splits.find((s) => s.role === UserRole.PRODUCER)?.amount).toBe(60);
      expect(splits.find((s) => s.role === UserRole.AFFILIATE)?.amount).toBe(
        20,
      );
      expect(splits.find((s) => s.role === UserRole.COPRODUCER)?.amount).toBe(
        10,
      );
      expect(splits.find((s) => s.role === UserRole.PLATFORM)?.amount).toBe(10);
    });

    it('should ignore participants not provided', () => {
      const commissions = [
        new Commission(
          'id1',
          UserRole.PRODUCER,
          60,
          'product-id',
          new Date(),
          new Date(),
        ),
        new Commission(
          'id2',
          UserRole.AFFILIATE,
          20,
          'product-id',
          new Date(),
          new Date(),
        ),
        new Commission(
          'id3',
          UserRole.COPRODUCER,
          10,
          'product-id',
          new Date(),
          new Date(),
        ),
        new Commission(
          'id4',
          UserRole.PLATFORM,
          10,
          'product-id',
          new Date(),
          new Date(),
        ),
      ];

      const participants = {
        producerId: 'producer-id',
        platformId: 'platform-id',
      };

      const splits = calculator.calculateCommissions(
        100,
        commissions,
        participants,
      );

      expect(splits).toHaveLength(2);
      expect(splits.find((s) => s.role === UserRole.PRODUCER)).toBeDefined();
      expect(splits.find((s) => s.role === UserRole.PLATFORM)).toBeDefined();
      expect(splits.find((s) => s.role === UserRole.AFFILIATE)).toBeUndefined();
      expect(
        splits.find((s) => s.role === UserRole.COPRODUCER),
      ).toBeUndefined();
    });

    it('should calculate amounts correctly', () => {
      const commissions = [
        new Commission(
          'id1',
          UserRole.PRODUCER,
          50,
          'product-id',
          new Date(),
          new Date(),
        ),
      ];

      const participants = {
        producerId: 'producer-id',
        platformId: 'platform-id',
      };

      const splits = calculator.calculateCommissions(
        100,
        commissions,
        participants,
      );

      expect(splits[0].amount).toBe(50);
      expect(splits[0].percentage).toBe(50);
      expect(splits[0].userId).toBe('producer-id');
    });
  });

  describe('validateCommissionPercentages', () => {
    it('should accept sum equal to 100', () => {
      const commissions = [
        new Commission(
          'id1',
          UserRole.PRODUCER,
          60,
          'product-id',
          new Date(),
          new Date(),
        ),
        new Commission(
          'id2',
          UserRole.AFFILIATE,
          40,
          'product-id',
          new Date(),
          new Date(),
        ),
      ];

      expect(() => {
        calculator.validateCommissionPercentages(commissions);
      }).not.toThrow();
    });

    it('should accept sum less than 100', () => {
      const commissions = [
        new Commission(
          'id1',
          UserRole.PRODUCER,
          50,
          'product-id',
          new Date(),
          new Date(),
        ),
        new Commission(
          'id2',
          UserRole.AFFILIATE,
          30,
          'product-id',
          new Date(),
          new Date(),
        ),
      ];

      expect(() => {
        calculator.validateCommissionPercentages(commissions);
      }).not.toThrow();
    });

    it('should reject sum greater than 100', () => {
      const commissions = [
        new Commission(
          'id1',
          UserRole.PRODUCER,
          60,
          'product-id',
          new Date(),
          new Date(),
        ),
        new Commission(
          'id2',
          UserRole.AFFILIATE,
          50,
          'product-id',
          new Date(),
          new Date(),
        ),
      ];

      expect(() => {
        calculator.validateCommissionPercentages(commissions);
      }).toThrow('Total commission percentage (110%) cannot exceed 100%');
    });

    it('should accept empty array', () => {
      expect(() => {
        calculator.validateCommissionPercentages([]);
      }).not.toThrow();
    });
  });
});
