import { Inject, Injectable } from '@nestjs/common';
import { type LikeRepository } from '../domain/repository/like-repository';
import { Like } from '../domain/entity/like-entity';

@Injectable()
export class ToggleLike {
  constructor(
    @Inject('LikeRepository') private readonly repository: LikeRepository,
  ) {}

  async execute(data: {
    userId: string;
    publicationId: string;
  }): Promise<{ liked: boolean; like?: Like }> {
    const existing = await this.repository.findByUserAndPublication(
      data.userId,
      data.publicationId,
    );

    if (existing) {
      await this.repository.deleteLike(existing.id);
      return { liked: false };
    }

    const like = Like.create(data);
    const created = await this.repository.createLike(like);
    return { liked: true, like: created };
  }
}
