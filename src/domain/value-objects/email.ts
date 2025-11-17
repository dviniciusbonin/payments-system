export class Email {
  private readonly value: string;

  constructor(email: string) {
    if (!email || email.trim().length === 0) {
      throw new Error('Email is required');
    }

    if (!this.isValid(email)) {
      throw new Error('Invalid email format');
    }

    this.value = email.toLowerCase().trim();
  }

  private isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  toString(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }
}
