import { UserRole } from '../../../domain/types/user-role';

export interface ITokenPayload {
  sub: string;
  email: string;
  role: UserRole;
}

export interface ITokenGenerator {
  generate(payload: ITokenPayload): string;
  verify(token: string): ITokenPayload | null;
}
