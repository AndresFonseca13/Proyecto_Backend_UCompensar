import { Inject, Injectable } from '@nestjs/common';
import { type CommentRepository } from '../domain/repository/comment-repository';
@Injectable()
export class DeleteComment {
  constructor(
    @Inject('CommentRepository') private readonly repository: CommentRepository,
  ) {}
  async execute(id: string) {
    await this.repository.getComment(id);
    return this.repository.deleteComment(id);
  }
}
