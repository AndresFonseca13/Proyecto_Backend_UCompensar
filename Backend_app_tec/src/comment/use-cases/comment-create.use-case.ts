import { Inject, Injectable } from '@nestjs/common';
import { type CommentRepository } from '../domain/repository/comment-repository';
import { Comment } from '../domain/entitys/comment-entity';
@Injectable()
export class CreateComment {
  constructor(
    @Inject('CommentRepository') private readonly repository: CommentRepository,
  ) {}
  execute(data: { content: string; userId: string; publicationId: string }) {
    const comment = Comment.create(data);
    return this.repository.createComment(comment);
  }
}
