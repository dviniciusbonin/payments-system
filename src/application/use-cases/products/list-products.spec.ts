import { ListProductsUseCase } from './list-products';
import { IProductRepository } from '../../interfaces/repositories/product-repository.interface';
import { Product } from '../../../domain/entities/product';

describe('ListProductsUseCase', () => {
  let useCase: ListProductsUseCase;
  let productRepository: jest.Mocked<IProductRepository>;

  beforeEach(() => {
    productRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      findByProducerId: jest.fn(),
    } as jest.Mocked<IProductRepository>;

    useCase = new ListProductsUseCase(productRepository);
  });

  it('should list all products when producerId is not provided', async () => {
    const products = [
      new Product(
        'id1',
        'Product 1',
        'Desc 1',
        'producer-1',
        new Date(),
        new Date(),
      ),
      new Product(
        'id2',
        'Product 2',
        'Desc 2',
        'producer-2',
        new Date(),
        new Date(),
      ),
    ];

    productRepository.findAll.mockResolvedValue(products);

    const result = await useCase.execute();

    expect(productRepository.findAll).toHaveBeenCalled();
    expect(productRepository.findByProducerId).not.toHaveBeenCalled();
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('id1');
    expect(result[1].id).toBe('id2');
  });

  it('should filter by producerId when provided', async () => {
    const producerId = 'producer-1';
    const products = [
      new Product(
        'id1',
        'Product 1',
        'Desc 1',
        producerId,
        new Date(),
        new Date(),
      ),
    ];

    productRepository.findByProducerId.mockResolvedValue(products);

    const result = await useCase.execute(producerId);

    expect(productRepository.findByProducerId).toHaveBeenCalledWith(producerId);
    expect(productRepository.findAll).not.toHaveBeenCalled();
    expect(result).toHaveLength(1);
    expect(result[0].producerId).toBe(producerId);
  });

  it('should return empty array when no products exist', async () => {
    productRepository.findAll.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toHaveLength(0);
  });
});
