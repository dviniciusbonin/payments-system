import { Injectable, Inject } from '@nestjs/common';
import { IProductRepository } from '../../interfaces/repositories/product-repository.interface';
import { Product } from '../../../domain/entities/product';

export interface CreateProductInput {
  name: string;
  description?: string | null;
  producerId: string;
}

export interface CreateProductOutput {
  id: string;
  name: string;
  description: string | null;
  producerId: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(input: CreateProductInput): Promise<CreateProductOutput> {
    const product = new Product(
      crypto.randomUUID(),
      input.name,
      input.description || null,
      input.producerId,
      new Date(),
      new Date(),
    );

    const created = await this.productRepository.save(product);

    return {
      id: created.id,
      name: created.name,
      description: created.description,
      producerId: created.producerId,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    };
  }
}
