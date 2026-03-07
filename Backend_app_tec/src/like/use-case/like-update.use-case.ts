import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { type LikeRepository } from '../domain/repository/like-repository';

@Injectable()
export class UpdateLike {
  constructor(
    @Inject('LikeRepository') private readonly repository: LikeRepository,
  ) {}

  async execute(id: string, data: { Isliked?: boolean }) {
    const like = await this.repository.getLike(id);
    if (!like) {
      throw new NotFoundException(`Like with id ${id} not found`);
    }
    const updated = like.update(data);
    return this.repository.updateLike(id, updated);
  }
}
