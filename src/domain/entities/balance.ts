export class Balance {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    private _amount: number,
    private _updatedAt: Date,
  ) {
    if (this._amount < 0) {
      throw new Error('Balance cannot be negative');
    }
  }

  add(amount: number): void {
    if (amount <= 0) {
      throw new Error('Amount to add must be positive');
    }

    this._amount += amount;
    this._updatedAt = new Date();
  }

  subtract(amount: number): void {
    if (amount <= 0) {
      throw new Error('Amount to subtract must be positive');
    }

    this._amount -= amount;
    if (this._amount < 0) {
      throw new Error('Balance cannot be negative');
    }
    this._updatedAt = new Date();
  }

  get amount(): number {
    return this._amount;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}
