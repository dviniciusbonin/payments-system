import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { IProductRepository } from '../../../application/interfaces/repositories/product-repository.interface';
import { Product } from '../../../domain/entities/product';

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    return product ? this.toDomain(product) : null;
  }

  async findAll(): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return products.map((product) => this.toDomain(product));
  }

  async findByProducerId(producerId: string): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      where: { producerId },
      orderBy: { createdAt: 'desc' },
    });
    return products.map((product) => this.toDomain(product));
  }

  async save(product: Product): Promise<Product> {
    const saved = await this.prisma.product.upsert({
      where: { id: product.id },
      create: {
        id: product.id,
        name: product.name,
        description: product.description,
        producerId: product.producerId,
      },
      update: {
        name: product.name,
        description: product.description,
        producerId: product.producerId,
      },
    });

    return this.toDomain(saved);
  }

  private toDomain(prismaProduct: {
    id: string;
    name: string;
    description: string | null;
    producerId: string;
    createdAt: Date;
    updatedAt: Date;
  }): Product {
    return new Product(
      prismaProduct.id,
      prismaProduct.name,
      prismaProduct.description,
      prismaProduct.producerId,
      prismaProduct.createdAt,
      prismaProduct.updatedAt,
    );
  }
}
