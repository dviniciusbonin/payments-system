import { Fee } from './fee';
import { FeeType } from '../types/fee-type';

describe('Fee', () => {
  const validFeeData = {
    id: 'fee-id',
    countryCode: 'BR',
    feePercentage: 4.5,
    feeType: FeeType.NATIONAL,
    isDefault: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe('constructor', () => {
    it('should create fee with valid data', () => {
      const fee = new Fee(
        validFeeData.id,
        validFeeData.countryCode,
        validFeeData.feePercentage,
        validFeeData.feeType,
        validFeeData.isDefault,
        validFeeData.createdAt,
        validFeeData.updatedAt,
      );

      expect(fee.countryCode).toBe(validFeeData.countryCode);
      expect(fee.feePercentage).toBe(validFeeData.feePercentage);
    });

    it('should reject invalid country code length', () => {
      expect(() => {
        new Fee(
          validFeeData.id,
          'B',
          validFeeData.feePercentage,
          validFeeData.feeType,
          validFeeData.isDefault,
          validFeeData.createdAt,
          validFeeData.updatedAt,
        );
      }).toThrow('Country code must be 2 characters (ISO 3166-1 alpha-2)');

      expect(() => {
        new Fee(
          validFeeData.id,
          'BRA',
          validFeeData.feePercentage,
          validFeeData.feeType,
          validFeeData.isDefault,
          validFeeData.createdAt,
          validFeeData.updatedAt,
        );
      }).toThrow('Country code must be 2 characters (ISO 3166-1 alpha-2)');
    });

    it('should reject negative fee percentage', () => {
      expect(() => {
        new Fee(
          validFeeData.id,
          validFeeData.countryCode,
          -1,
          validFeeData.feeType,
          validFeeData.isDefault,
          validFeeData.createdAt,
          validFeeData.updatedAt,
        );
      }).toThrow('Fee percentage must be between 0 and 100');
    });

    it('should reject fee percentage greater than 100', () => {
      expect(() => {
        new Fee(
          validFeeData.id,
          validFeeData.countryCode,
          101,
          validFeeData.feeType,
          validFeeData.isDefault,
          validFeeData.createdAt,
          validFeeData.updatedAt,
        );
      }).toThrow('Fee percentage must be between 0 and 100');
    });

    it('should accept zero fee percentage', () => {
      const fee = new Fee(
        validFeeData.id,
        validFeeData.countryCode,
        0,
        validFeeData.feeType,
        validFeeData.isDefault,
        validFeeData.createdAt,
        validFeeData.updatedAt,
      );

      expect(fee.feePercentage).toBe(0);
    });

    it('should accept 100 fee percentage', () => {
      const fee = new Fee(
        validFeeData.id,
        validFeeData.countryCode,
        100,
        validFeeData.feeType,
        validFeeData.isDefault,
        validFeeData.createdAt,
        validFeeData.updatedAt,
      );

      expect(fee.feePercentage).toBe(100);
    });
  });

  describe('calculateFee', () => {
    it('should calculate fee amount correctly', () => {
      const fee = new Fee(
        validFeeData.id,
        validFeeData.countryCode,
        4.5,
        validFeeData.feeType,
        validFeeData.isDefault,
        validFeeData.createdAt,
        validFeeData.updatedAt,
      );

      const feeAmount = fee.calculateFee(100);
      expect(feeAmount).toBe(4.5);
    });

    it('should calculate fee with zero percentage', () => {
      const fee = new Fee(
        validFeeData.id,
        validFeeData.countryCode,
        0,
        validFeeData.feeType,
        validFeeData.isDefault,
        validFeeData.createdAt,
        validFeeData.updatedAt,
      );

      const feeAmount = fee.calculateFee(100);
      expect(feeAmount).toBe(0);
    });

    it('should calculate fee with 100 percentage', () => {
      const fee = new Fee(
        validFeeData.id,
        validFeeData.countryCode,
        100,
        validFeeData.feeType,
        validFeeData.isDefault,
        validFeeData.createdAt,
        validFeeData.updatedAt,
      );

      const feeAmount = fee.calculateFee(100);
      expect(feeAmount).toBe(100);
    });
  });

  describe('calculateNetAmount', () => {
    it('should calculate net amount correctly', () => {
      const fee = new Fee(
        validFeeData.id,
        validFeeData.countryCode,
        4.5,
        validFeeData.feeType,
        validFeeData.isDefault,
        validFeeData.createdAt,
        validFeeData.updatedAt,
      );

      const netAmount = fee.calculateNetAmount(100);
      expect(netAmount).toBe(95.5);
    });

    it('should calculate net amount with zero fee', () => {
      const fee = new Fee(
        validFeeData.id,
        validFeeData.countryCode,
        0,
        validFeeData.feeType,
        validFeeData.isDefault,
        validFeeData.createdAt,
        validFeeData.updatedAt,
      );

      const netAmount = fee.calculateNetAmount(100);
      expect(netAmount).toBe(100);
    });

    it('should calculate net amount with 100 fee', () => {
      const fee = new Fee(
        validFeeData.id,
        validFeeData.countryCode,
        100,
        validFeeData.feeType,
        validFeeData.isDefault,
        validFeeData.createdAt,
        validFeeData.updatedAt,
      );

      const netAmount = fee.calculateNetAmount(100);
      expect(netAmount).toBe(0);
    });
  });
});
