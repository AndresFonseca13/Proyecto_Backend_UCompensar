import { Comment } from '../entitys/comment-entity';

export interface CommentRepository {
  getAllComments(publicationId?: string): Promise<Comment[]>;
  getComment(id: string): Promise<Comment>;
  deleteComment(id: string): Promise<void>;
  createComment(data: Comment): Promise<Comment>;
}
