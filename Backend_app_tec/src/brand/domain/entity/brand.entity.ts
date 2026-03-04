export class Brand {
  private constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly createAt: Date,
  ) {}

  static create(data: { name: string }): Brand {
    return new Brand(crypto.randomUUID(), data.name, new Date());
  }

  update(data: { name?: string }): Brand {
    return new Brand(this.id, data.name ?? this.name, this.createAt);
  }

  static fromPersistence(data: {
    id: string;
    name: string;
    createAt: Date;
  }): Brand {
    return new Brand(data.id, data.name, data.createAt);
  }
}
