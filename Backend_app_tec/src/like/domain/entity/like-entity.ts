export class Like {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly Isliked: boolean,
    public readonly publicationId: string,
    public readonly createdAt: Date,
  ) {}
  static create(data: {
    userId: string;
    Isliked: boolean;
    publicationId: string;
  }): Like {
    return new Like(
      crypto.randomUUID(),
      data.userId,
      data.Isliked,
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
  static persistence(data: {
    id: string;
    userId: string;
    Isliked: boolean;
    publicationId: string;
    createdAt: Date;
  }): Like {
    return new Like(
      crypto.randomUUID(),
      data.userId,
      data.Isliked,
      data.publicationId,
      new Date(),
    );
  }
}
