export class Comment {
  private constructor(
    public readonly id: string,
    public readonly createdAt: Date,
    public readonly content: string,
    public readonly userId: string,
    public readonly publicationId: string,
  ) {}
  static create(data: {
    content: string;
    userId: string;
    publicationId: string;
  }): Comment {
    return new Comment(
      crypto.randomUUID(),
      new Date(),
      data.content,
      data.userId,
      data.publicationId,
    );
  }
  update(data: {
    content?: string;
    userId?: string;
    publicationId?: string;
  }): Comment {
    return new Comment(
      this.id,
      this.createdAt,
      data.content ?? this.content,
      data.userId ?? this.userId,
      data.publicationId ?? this.publicationId,
    );
  }
  static persitence(data: {
    content: string;
    userId: string;
    publicationId: string;
  }): Comment {
    return new Comment(
      crypto.randomUUID(),
      new Date(),
      data.content,
      data.userId,
      data.publicationId,
    );
  }
}
