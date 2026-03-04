import { Inject, Injectable } from '@nestjs/common';
import { type LikeRepository } from '../domain/repository/like-repository';
import { Like } from '../domain/entity/like-entity';

@Injectable()
export class CreateLike {
  constructor(
    @Inject('LikeRepository') private readonly repository: LikeRepository,
  ) {}
  async execute(data: {
    userId: string;
    Isliked: boolean;
    publicationId: string;
  }) {
    const like = Like.create(data);
    return this.repository.createLike(like);
  }
}
