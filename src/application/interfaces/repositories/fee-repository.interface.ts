import { Fee } from '../../../domain/entities/fee';

export interface IFeeRepository {
  save(fee: Fee): Promise<Fee>;
  findByCountryCode(countryCode: string): Promise<Fee | null>;
  findDefault(): Promise<Fee | null>;
}
