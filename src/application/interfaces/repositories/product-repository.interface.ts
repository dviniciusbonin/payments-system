import { Product } from '../../../domain/entities/product';

export interface IProductRepository {
  findById(id: string): Promise<Product | null>;
  findAll(): Promise<Product[]>;
  findByProducerId(producerId: string): Promise<Product[]>;
  save(product: Product): Promise<Product>;
}
