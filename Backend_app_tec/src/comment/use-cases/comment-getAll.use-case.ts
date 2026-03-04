import { Inject, Injectable } from '@nestjs/common';
import { type CommentRepository } from '../domain/repository/comment-repository';
@Injectable()
export class GetAllComment {
  constructor(
    @Inject('CommentRepository') private readonly repository: CommentRepository,
  ) {}
  execute(publicationId?: string) {
    return this.repository.getAllComments(publicationId);
  }
}
