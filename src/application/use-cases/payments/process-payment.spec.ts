import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ProcessPaymentUseCase } from './process-payment';
import { IProductRepository } from '../../interfaces/repositories/product-repository.interface';
import { IFeeRepository } from '../../interfaces/repositories/fee-repository.interface';
import { ICommissionRepository } from '../../interfaces/repositories/commission-repository.interface';
import { ITransactionRepository } from '../../interfaces/repositories/transaction-repository.interface';
import { IBalanceRepository } from '../../interfaces/repositories/balance-repository.interface';
import { IUserRepository } from '../../interfaces/repositories/user-repository.interface';
import { ITransactionManager } from '../../interfaces/repositories/transaction-manager.interface';
import { Product } from '../../../domain/entities/product';
import { Fee } from '../../../domain/entities/fee';
import { Commission } from '../../../domain/entities/commission';
import { User } from '../../../domain/entities/user';
import { Balance } from '../../../domain/entities/balance';
import { Email } from '../../../domain/value-objects/email';
import { FeeType } from '../../../domain/types/fee-type';
import { UserRole } from '../../../domain/types/user-role';
import { TransactionStatus } from '../../../domain/types/transaction-status';
import { TransactionCalculator } from '../../../domain/services/transaction-calculator';

describe('ProcessPaymentUseCase', () => {
  let useCase: ProcessPaymentUseCase;
  let productRepository: jest.Mocked<IProductRepository>;
  let feeRepository: jest.Mocked<IFeeRepository>;
  let commissionRepository: jest.Mocked<ICommissionRepository>;
  let transactionRepository: jest.Mocked<ITransactionRepository>;
  let balanceRepository: jest.Mocked<IBalanceRepository>;
  let userRepository: jest.Mocked<IUserRepository>;
  let transactionManager: jest.Mocked<ITransactionManager>;
  let transactionCalculator: TransactionCalculator;

  beforeEach(() => {
    productRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      findByProducerId: jest.fn(),
    } as jest.Mocked<IProductRepository>;

    feeRepository = {
      save: jest.fn(),
      findByCountryCode: jest.fn(),
      findDefault: jest.fn(),
    } as jest.Mocked<IFeeRepository>;

    commissionRepository = {
      save: jest.fn(),
      findByProductId: jest.fn(),
    } as jest.Mocked<ICommissionRepository>;

    transactionRepository = {
      save: jest.fn(),
    } as jest.Mocked<ITransactionRepository>;

    balanceRepository = {
      save: jest.fn(),
      findByUserId: jest.fn(),
    } as jest.Mocked<IBalanceRepository>;

    userRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findByRole: jest.fn(),
      findAll: jest.fn(),
    } as jest.Mocked<IUserRepository>;

    transactionManager = {
      execute: jest.fn(),
    } as jest.Mocked<ITransactionManager>;

    transactionCalculator = new TransactionCalculator();

    useCase = new ProcessPaymentUseCase(
      productRepository,
      feeRepository,
      commissionRepository,
      transactionRepository,
      balanceRepository,
      userRepository,
      transactionManager,
      transactionCalculator,
    );
  });

  it('should process payment successfully', async () => {
    const input = {
      amount: 100,
      countryCode: 'BR',
      buyerId: 'buyer-id',
      productId: 'product-id',
      affiliateId: 'affiliate-id',
      coproducerId: 'coproducer-id',
    };

    const product = new Product(
      'product-id',
      'Test Product',
      'Description',
      'producer-id',
      new Date(),
      new Date(),
    );

    const buyer = new User(
      'buyer-id',
      'Buyer',
      new Email('buyer@example.com'),
      'hash',
      UserRole.CUSTOMER,
      true,
      new Date(),
      new Date(),
    );

    const fee = new Fee(
      'fee-id',
      'BR',
      4.5,
      FeeType.NATIONAL,
      false,
      new Date(),
      new Date(),
    );

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

    const affiliate = new User(
      'affiliate-id',
      'Affiliate',
      new Email('affiliate@example.com'),
      'hash',
      UserRole.AFFILIATE,
      true,
      new Date(),
      new Date(),
    );

    const coproducer = new User(
      'coproducer-id',
      'Coproducer',
      new Email('coproducer@example.com'),
      'hash',
      UserRole.COPRODUCER,
      true,
      new Date(),
      new Date(),
    );

    const producer = new User(
      'producer-id',
      'Producer',
      new Email('producer@example.com'),
      'hash',
      UserRole.PRODUCER,
      true,
      new Date(),
      new Date(),
    );

    const platform = new User(
      'platform-id',
      'Platform',
      new Email('platform@example.com'),
      'hash',
      UserRole.PLATFORM,
      true,
      new Date(),
      new Date(),
    );

    productRepository.findById.mockResolvedValue(product);
    userRepository.findById
      .mockResolvedValueOnce(buyer)
      .mockResolvedValueOnce(affiliate)
      .mockResolvedValueOnce(coproducer);
    feeRepository.findByCountryCode.mockResolvedValue(fee);
    commissionRepository.findByProductId.mockResolvedValue(commissions);
    userRepository.findByRole
      .mockResolvedValueOnce([producer])
      .mockResolvedValueOnce([platform]);
    balanceRepository.findByUserId.mockResolvedValue(null);
    transactionManager.execute.mockImplementation(async (fn) => {
      await fn({});
    });

    const result = await useCase.execute(input);

    expect(result.amount).toBe(100);
    expect(result.feeAmount).toBe(4.5);
    expect(result.netAmount).toBe(95.5);
    expect(result.status).toBe(TransactionStatus.APPROVED);
    expect(result.splits).toHaveLength(4);
    expect(transactionManager.execute).toHaveBeenCalled();
  });

  it('should reject zero amount', async () => {
    const input = {
      amount: 0,
      countryCode: 'BR',
      buyerId: 'buyer-id',
      productId: 'product-id',
    };

    await expect(useCase.execute(input)).rejects.toThrow(BadRequestException);
  });

  it('should reject negative amount', async () => {
    const input = {
      amount: -10,
      countryCode: 'BR',
      buyerId: 'buyer-id',
      productId: 'product-id',
    };

    await expect(useCase.execute(input)).rejects.toThrow(BadRequestException);
  });

  it('should reject non-existent product', async () => {
    const input = {
      amount: 100,
      countryCode: 'BR',
      buyerId: 'buyer-id',
      productId: 'non-existent',
    };

    productRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(input)).rejects.toThrow(NotFoundException);
  });

  it('should reject non-existent buyer', async () => {
    const input = {
      amount: 100,
      countryCode: 'BR',
      buyerId: 'non-existent',
      productId: 'product-id',
    };

    const product = new Product(
      'product-id',
      'Test',
      null,
      'producer-id',
      new Date(),
      new Date(),
    );

    productRepository.findById.mockResolvedValue(product);
    userRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(input)).rejects.toThrow(NotFoundException);
  });

  it('should reject inactive buyer', async () => {
    const input = {
      amount: 100,
      countryCode: 'BR',
      buyerId: 'buyer-id',
      productId: 'product-id',
    };

    const product = new Product(
      'product-id',
      'Test',
      null,
      'producer-id',
      new Date(),
      new Date(),
    );

    const buyer = new User(
      'buyer-id',
      'Buyer',
      new Email('buyer@example.com'),
      'hash',
      UserRole.CUSTOMER,
      false,
      new Date(),
      new Date(),
    );

    productRepository.findById.mockResolvedValue(product);
    userRepository.findById.mockResolvedValue(buyer);

    await expect(useCase.execute(input)).rejects.toThrow(NotFoundException);
  });

  it('should require affiliateId when affiliate commission is configured', async () => {
    const input = {
      amount: 100,
      countryCode: 'BR',
      buyerId: 'buyer-id',
      productId: 'product-id',
    };

    const product = new Product(
      'product-id',
      'Test',
      null,
      'producer-id',
      new Date(),
      new Date(),
    );

    const buyer = new User(
      'buyer-id',
      'Buyer',
      new Email('buyer@example.com'),
      'hash',
      UserRole.CUSTOMER,
      true,
      new Date(),
      new Date(),
    );

    const fee = new Fee(
      'fee-id',
      'BR',
      4.5,
      FeeType.NATIONAL,
      false,
      new Date(),
      new Date(),
    );

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
    ];

    productRepository.findById.mockResolvedValue(product);
    userRepository.findById.mockResolvedValue(buyer);
    feeRepository.findByCountryCode.mockResolvedValue(fee);
    commissionRepository.findByProductId.mockResolvedValue(commissions);

    await expect(useCase.execute(input)).rejects.toThrow(BadRequestException);
  });

  it('should require coproducerId when coproducer commission is configured', async () => {
    const input = {
      amount: 100,
      countryCode: 'BR',
      buyerId: 'buyer-id',
      productId: 'product-id',
      affiliateId: 'affiliate-id',
    };

    const product = new Product(
      'product-id',
      'Test',
      null,
      'producer-id',
      new Date(),
      new Date(),
    );

    const buyer = new User(
      'buyer-id',
      'Buyer',
      new Email('buyer@example.com'),
      'hash',
      UserRole.CUSTOMER,
      true,
      new Date(),
      new Date(),
    );

    const fee = new Fee(
      'fee-id',
      'BR',
      4.5,
      FeeType.NATIONAL,
      false,
      new Date(),
      new Date(),
    );

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
        'id3',
        UserRole.COPRODUCER,
        10,
        'product-id',
        new Date(),
        new Date(),
      ),
    ];

    const affiliate = new User(
      'affiliate-id',
      'Affiliate',
      new Email('affiliate@example.com'),
      'hash',
      UserRole.AFFILIATE,
      true,
      new Date(),
      new Date(),
    );

    productRepository.findById.mockResolvedValue(product);
    userRepository.findById
      .mockResolvedValueOnce(buyer)
      .mockResolvedValueOnce(affiliate);
    feeRepository.findByCountryCode.mockResolvedValue(fee);
    commissionRepository.findByProductId.mockResolvedValue(commissions);

    await expect(useCase.execute(input)).rejects.toThrow(BadRequestException);
  });

  it('should validate affiliate has AFFILIATE role', async () => {
    const input = {
      amount: 100,
      countryCode: 'BR',
      buyerId: 'buyer-id',
      productId: 'product-id',
      affiliateId: 'wrong-role-id',
    };

    const product = new Product(
      'product-id',
      'Test',
      null,
      'producer-id',
      new Date(),
      new Date(),
    );

    const buyer = new User(
      'buyer-id',
      'Buyer',
      new Email('buyer@example.com'),
      'hash',
      UserRole.CUSTOMER,
      true,
      new Date(),
      new Date(),
    );

    const fee = new Fee(
      'fee-id',
      'BR',
      4.5,
      FeeType.NATIONAL,
      false,
      new Date(),
      new Date(),
    );

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
    ];

    const wrongRoleUser = new User(
      'wrong-role-id',
      'User',
      new Email('user@example.com'),
      'hash',
      UserRole.CUSTOMER,
      true,
      new Date(),
      new Date(),
    );

    productRepository.findById.mockResolvedValue(product);
    userRepository.findById
      .mockResolvedValueOnce(buyer)
      .mockResolvedValueOnce(wrongRoleUser);
    feeRepository.findByCountryCode.mockResolvedValue(fee);
    commissionRepository.findByProductId.mockResolvedValue(commissions);

    await expect(useCase.execute(input)).rejects.toThrow(BadRequestException);
  });

  it('should use default fee when country fee not found', async () => {
    const input = {
      amount: 100,
      countryCode: 'XX',
      buyerId: 'buyer-id',
      productId: 'product-id',
    };

    const product = new Product(
      'product-id',
      'Test',
      null,
      'producer-id',
      new Date(),
      new Date(),
    );

    const buyer = new User(
      'buyer-id',
      'Buyer',
      new Email('buyer@example.com'),
      'hash',
      UserRole.CUSTOMER,
      true,
      new Date(),
      new Date(),
    );

    const defaultFee = new Fee(
      'default-fee-id',
      'US',
      6.0,
      FeeType.INTERNATIONAL,
      true,
      new Date(),
      new Date(),
    );

    const commissions = [
      new Commission(
        'id1',
        UserRole.PRODUCER,
        100,
        'product-id',
        new Date(),
        new Date(),
      ),
    ];

    const producer = new User(
      'producer-id',
      'Producer',
      new Email('producer@example.com'),
      'hash',
      UserRole.PRODUCER,
      true,
      new Date(),
      new Date(),
    );

    const platform = new User(
      'platform-id',
      'Platform',
      new Email('platform@example.com'),
      'hash',
      UserRole.PLATFORM,
      true,
      new Date(),
      new Date(),
    );

    productRepository.findById.mockResolvedValue(product);
    userRepository.findById.mockResolvedValue(buyer);
    feeRepository.findByCountryCode.mockResolvedValue(null);
    feeRepository.findDefault.mockResolvedValue(defaultFee);
    commissionRepository.findByProductId.mockResolvedValue(commissions);
    userRepository.findByRole
      .mockResolvedValueOnce([producer])
      .mockResolvedValueOnce([platform]);
    balanceRepository.findByUserId.mockResolvedValue(null);
    transactionManager.execute.mockImplementation(async (fn) => {
      await fn({});
    });

    const result = await useCase.execute(input);

    expect(result.feeAmount).toBe(6.0);
    expect(result.netAmount).toBe(94.0);
    expect(feeRepository.findDefault).toHaveBeenCalled();
  });

  it('should update existing balances', async () => {
    const input = {
      amount: 100,
      countryCode: 'BR',
      buyerId: 'buyer-id',
      productId: 'product-id',
    };

    const product = new Product(
      'product-id',
      'Test',
      null,
      'producer-id',
      new Date(),
      new Date(),
    );

    const buyer = new User(
      'buyer-id',
      'Buyer',
      new Email('buyer@example.com'),
      'hash',
      UserRole.CUSTOMER,
      true,
      new Date(),
      new Date(),
    );

    const fee = new Fee(
      'fee-id',
      'BR',
      4.5,
      FeeType.NATIONAL,
      false,
      new Date(),
      new Date(),
    );

    const commissions = [
      new Commission(
        'id1',
        UserRole.PRODUCER,
        100,
        'product-id',
        new Date(),
        new Date(),
      ),
    ];

    const producer = new User(
      'producer-id',
      'Producer',
      new Email('producer@example.com'),
      'hash',
      UserRole.PRODUCER,
      true,
      new Date(),
      new Date(),
    );

    const platform = new User(
      'platform-id',
      'Platform',
      new Email('platform@example.com'),
      'hash',
      UserRole.PLATFORM,
      true,
      new Date(),
      new Date(),
    );

    const existingBalance = new Balance(
      'balance-id',
      'producer-id',
      50,
      new Date(),
    );

    productRepository.findById.mockResolvedValue(product);
    userRepository.findById.mockResolvedValue(buyer);
    feeRepository.findByCountryCode.mockResolvedValue(fee);
    commissionRepository.findByProductId.mockResolvedValue(commissions);
    userRepository.findByRole
      .mockResolvedValueOnce([producer])
      .mockResolvedValueOnce([platform]);
    balanceRepository.findByUserId.mockResolvedValue(existingBalance);
    transactionManager.execute.mockImplementation(async (fn) => {
      await fn({});
    });

    await useCase.execute(input);

    expect(balanceRepository.findByUserId).toHaveBeenCalledWith('producer-id');
    expect(existingBalance.amount).toBeGreaterThan(50);
  });
});
