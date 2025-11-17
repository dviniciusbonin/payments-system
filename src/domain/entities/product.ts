export class Product {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string | null,
    public readonly producerId: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {
    if (!name || name.trim().length === 0) {
      throw new Error('Product name is required');
    }
    if (!producerId || producerId.trim().length === 0) {
      throw new Error('Producer ID is required');
    }
  }
}
