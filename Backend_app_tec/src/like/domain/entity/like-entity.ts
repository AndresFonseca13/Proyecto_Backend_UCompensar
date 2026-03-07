export class Like {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly Isliked: boolean,
    public readonly publicationId: string,
    public readonly createdAt: Date,
  ) {}

  static create(data: { userId: string; publicationId: string }): Like {
    return new Like(
      crypto.randomUUID(),
      data.userId,
      true,
      data.publicationId,
      new Date(),
    );
  }

  update(data: { Isliked?: boolean }): Like {
    return new Like(
      this.id,
      this.userId,
      data.Isliked ?? this.Isliked,
      this.publicationId,
      this.createdAt,
    );
  }

  static fromPersistence(data: {
    id: string;
    userId: string;
    Isliked: boolean;
    publicationId: string;
    createdAt: Date;
  }): Like {
    return new Like(
      data.id,
      data.userId,
      data.Isliked,
      data.publicationId,
      data.createdAt,
    );
  }
}
