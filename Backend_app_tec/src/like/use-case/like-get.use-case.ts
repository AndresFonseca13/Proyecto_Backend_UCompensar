import { Inject, Injectable } from '@nestjs/common';
import { type LikeRepository } from '../domain/repository/like-repository';

@Injectable()
export class GetLike {
  constructor(
    @Inject('LikeRepository') private readonly repository: LikeRepository,
  ) {}
  async execute(id: string) {
    const like = await this.repository.getLike(id);
    if (!like) {
      throw new Error(`Not exist like withe id ${id}`);
    }
    return like;
  }
}
