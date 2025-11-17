import { CreateProductUseCase } from './create-product';
import { IProductRepository } from '../../interfaces/repositories/product-repository.interface';
import { Product } from '../../../domain/entities/product';

describe('CreateProductUseCase', () => {
  let useCase: CreateProductUseCase;
  let productRepository: jest.Mocked<IProductRepository>;

  beforeEach(() => {
    productRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      findByProducerId: jest.fn(),
    } as jest.Mocked<IProductRepository>;

    useCase = new CreateProductUseCase(productRepository);
  });

  it('should create product successfully', async () => {
    const input = {
      name: 'Test Product',
      description: 'Test Description',
      producerId: 'producer-id',
    };

    const savedProduct = new Product(
      'product-id',
      input.name,
      input.description,
      input.producerId,
      new Date(),
      new Date(),
    );

    productRepository.save.mockResolvedValue(savedProduct);

    const result = await useCase.execute(input);

    expect(productRepository.save).toHaveBeenCalled();
    expect(result.name).toBe(input.name);
    expect(result.description).toBe(input.description);
    expect(result.producerId).toBe(input.producerId);
  });

  it('should handle null description', async () => {
    const input = {
      name: 'Test Product',
      producerId: 'producer-id',
    };

    const savedProduct = new Product(
      'product-id',
      input.name,
      null,
      input.producerId,
      new Date(),
      new Date(),
    );

    productRepository.save.mockResolvedValue(savedProduct);

    const result = await useCase.execute(input);

    expect(result.description).toBeNull();
  });

  it('should call repository.save with product', async () => {
    const input = {
      name: 'Test Product',
      description: 'Test Description',
      producerId: 'producer-id',
    };

    const savedProduct = new Product(
      'product-id',
      input.name,
      input.description,
      input.producerId,
      new Date(),
      new Date(),
    );

    productRepository.save.mockResolvedValue(savedProduct);

    await useCase.execute(input);

    expect(productRepository.save).toHaveBeenCalled();
    const savedCall = productRepository.save.mock.calls[0][0];
    expect(savedCall.name).toBe(input.name);
    expect(savedCall.producerId).toBe(input.producerId);
  });
});
