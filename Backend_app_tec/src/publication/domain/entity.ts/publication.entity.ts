export class Publication {
  private constructor(
    public readonly id: string,
    public readonly createAt: Date,
    public readonly name: string,
    public readonly description: string,
    public readonly img: string,
    public readonly price: number,
    public readonly brandId: string,
    public readonly userId: string,
    public readonly author?: {
      id: string;
      name: string;
      photo: string;
    },
    public readonly brand?: {
      id: string;
      name: string;
    },
    public readonly likesCount: number = 0,
    public readonly commentsCount: number = 0,
  ) {}

  static create(data: {
    name: string;
    description: string;
    img: string;
    price: number;
    brandId: string;
    userId: string;
  }): Publication {
    return new Publication(
      crypto.randomUUID(),
      new Date(),
      data.name,
      data.description,
      data.img,
      data.price,
      data.brandId,
      data.userId,
    );
  }

  update(data: {
    name?: string;
    description?: string;
    img?: string;
    price?: number;
    brandId?: string;
  }): Publication {
    return new Publication(
      this.id,
      this.createAt,
      data.name ?? this.name,
      data.description ?? this.description,
      data.img ?? this.img,
      data.price ?? this.price,
      data.brandId ?? this.brandId,
      this.userId,
      this.author,
      this.brand,
      this.likesCount,
      this.commentsCount,
    );
  }

  static fromPersistence(data: {
    id: string;
    createAt: Date;
    name: string;
    description: string;
    img: string;
    price: number;
    brandId: string;
    userId: string;
    author: { id: string; name: string; photo: string };
    brand: { id: string; name: string };
    likesCount: number;
    commentsCount: number;
  }): Publication {
    return new Publication(
      data.id,
      data.createAt,
      data.name,
      data.description,
      data.img,
      data.price,
      data.brandId,
      data.userId,
      data.author,
      data.brand,
      data.likesCount,
      data.commentsCount,
    );
  }
}
