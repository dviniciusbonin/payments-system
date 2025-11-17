import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ITokenGenerator,
  ITokenPayload,
} from '../../application/interfaces/services/token-generator.interface';
import { UserRole } from '../../domain/types/user-role';

@Injectable()
export class JwtTokenService implements ITokenGenerator {
  constructor(private readonly jwtService: JwtService) {}

  generate(payload: ITokenPayload): string {
    return this.jwtService.sign({
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
    });
  }

  verify(token: string): ITokenPayload | null {
    try {
      const decoded = this.jwtService.verify<{
        sub: string;
        email: string;
        role: string;
      }>(token);
      return {
        sub: decoded.sub,
        email: decoded.email,
        role: decoded.role as UserRole,
      };
    } catch {
      return null;
    }
  }
}
