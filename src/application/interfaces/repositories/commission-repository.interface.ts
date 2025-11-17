import { Commission } from '../../../domain/entities/commission';

export interface ICommissionRepository {
  save(commission: Commission): Promise<Commission>;
  findByProductId(productId: string): Promise<Commission[]>;
}
