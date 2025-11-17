import { UserRole } from '../types/user-role';
import { Email } from '../value-objects/email';

export class User {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: Email,
    public readonly passwordHash: string,
    public readonly role: UserRole,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {
    if (!name || name.trim().length === 0) {
      throw new Error('Name is required');
    }
  }

  isProducer(): boolean {
    return this.role === UserRole.PRODUCER;
  }

  isAffiliate(): boolean {
    return this.role === UserRole.AFFILIATE;
  }

  isCoproducer(): boolean {
    return this.role === UserRole.COPRODUCER;
  }

  isPlatform(): boolean {
    return this.role === UserRole.PLATFORM;
  }
}
