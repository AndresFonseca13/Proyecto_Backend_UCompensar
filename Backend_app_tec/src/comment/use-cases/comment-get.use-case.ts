import { Inject, Injectable } from '@nestjs/common';
import { type CommentRepository } from '../domain/repository/comment-repository';
@Injectable()
export class GetComment {
  constructor(
    @Inject('CommentRepository') private readonly repository: CommentRepository,
  ) {}
  async execute(id: string) {
    const comment = await this.repository.getComment(id);
    if (!comment) {
      throw new Error(`Comment with ${id} not exist`);
    }
    return comment;
  }
}
