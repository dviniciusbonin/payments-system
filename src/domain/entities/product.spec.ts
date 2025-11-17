import { Product } from './product';

describe('Product', () => {
  const validProductData = {
    id: 'product-id',
    name: 'Test Product',
    description: 'Test Description',
    producerId: 'producer-id',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe('constructor', () => {
    it('should create product with valid data', () => {
      const product = new Product(
        validProductData.id,
        validProductData.name,
        validProductData.description,
        validProductData.producerId,
        validProductData.createdAt,
        validProductData.updatedAt,
      );

      expect(product.id).toBe(validProductData.id);
      expect(product.name).toBe(validProductData.name);
      expect(product.description).toBe(validProductData.description);
      expect(product.producerId).toBe(validProductData.producerId);
    });

    it('should create product with null description', () => {
      const product = new Product(
        validProductData.id,
        validProductData.name,
        null,
        validProductData.producerId,
        validProductData.createdAt,
        validProductData.updatedAt,
      );

      expect(product.description).toBeNull();
    });

    it('should reject empty name', () => {
      expect(() => {
        new Product(
          validProductData.id,
          '',
          validProductData.description,
          validProductData.producerId,
          validProductData.createdAt,
          validProductData.updatedAt,
        );
      }).toThrow('Product name is required');
    });

    it('should reject name with only whitespace', () => {
      expect(() => {
        new Product(
          validProductData.id,
          '   ',
          validProductData.description,
          validProductData.producerId,
          validProductData.createdAt,
          validProductData.updatedAt,
        );
      }).toThrow('Product name is required');
    });

    it('should reject empty producer ID', () => {
      expect(() => {
        new Product(
          validProductData.id,
          validProductData.name,
          validProductData.description,
          '',
          validProductData.createdAt,
          validProductData.updatedAt,
        );
      }).toThrow('Producer ID is required');
    });

    it('should reject producer ID with only whitespace', () => {
      expect(() => {
        new Product(
          validProductData.id,
          validProductData.name,
          validProductData.description,
          '   ',
          validProductData.createdAt,
          validProductData.updatedAt,
        );
      }).toThrow('Producer ID is required');
    });
  });
});
