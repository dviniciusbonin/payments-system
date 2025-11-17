import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IProductRepository } from '../../interfaces/repositories/product-repository.interface';

export interface GetProductOutput {
  id: string;
  name: string;
  description: string | null;
  producerId: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class GetProductUseCase {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(id: string): Promise<GetProductOutput> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      producerId: product.producerId,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}
