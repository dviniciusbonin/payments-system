import { Injectable, Inject } from '@nestjs/common';
import { IProductRepository } from '../../interfaces/repositories/product-repository.interface';

export interface ListProductsOutput {
  id: string;
  name: string;
  description: string | null;
  producerId: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class ListProductsUseCase {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(producerId?: string): Promise<ListProductsOutput[]> {
    const products = producerId
      ? await this.productRepository.findByProducerId(producerId)
      : await this.productRepository.findAll();

    return products.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      producerId: product.producerId,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }));
  }
}
