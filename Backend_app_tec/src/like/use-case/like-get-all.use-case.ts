import { Inject, Injectable } from '@nestjs/common';
import { type LikeRepository } from '../domain/repository/like-repository';

@Injectable()
export class GetAllLikes {
  constructor(
    @Inject('LikeRepository') private readonly repository: LikeRepository,
  ) {}
  async execute(publicationId: string) {
    return this.repository.getAllLike(publicationId);
  }
}
