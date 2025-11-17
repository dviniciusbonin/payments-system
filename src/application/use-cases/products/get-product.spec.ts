import { NotFoundException } from '@nestjs/common';
import { GetProductUseCase } from './get-product';
import { IProductRepository } from '../../interfaces/repositories/product-repository.interface';
import { Product } from '../../../domain/entities/product';

describe('GetProductUseCase', () => {
  let useCase: GetProductUseCase;
  let productRepository: jest.Mocked<IProductRepository>;

  beforeEach(() => {
    productRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      findByProducerId: jest.fn(),
    } as jest.Mocked<IProductRepository>;

    useCase = new GetProductUseCase(productRepository);
  });

  it('should get product by id', async () => {
    const productId = 'product-id';
    const product = new Product(
      productId,
      'Test Product',
      'Test Description',
      'producer-id',
      new Date(),
      new Date(),
    );

    productRepository.findById.mockResolvedValue(product);

    const result = await useCase.execute(productId);

    expect(productRepository.findById).toHaveBeenCalledWith(productId);
    expect(result.id).toBe(productId);
    expect(result.name).toBe('Test Product');
  });

  it('should throw NotFoundException when product does not exist', async () => {
    const productId = 'non-existent-id';

    productRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(productId)).rejects.toThrow(NotFoundException);
    expect(productRepository.findById).toHaveBeenCalledWith(productId);
  });
});
