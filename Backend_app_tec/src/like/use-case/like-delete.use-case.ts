import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { type LikeRepository } from '../domain/repository/like-repository';

@Injectable()
export class DeleteLike {
  constructor(
    @Inject('LikeRepository') private readonly repository: LikeRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const like = await this.repository.getLike(id);
    if (!like) {
      throw new NotFoundException(`Like with id ${id} not found`);
    }
    await this.repository.deleteLike(id);
  }
}
