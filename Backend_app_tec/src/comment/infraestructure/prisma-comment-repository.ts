import { Injectable } from '@nestjs/common';
import { CommentRepository } from '../domain/repository/comment-repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { Comment } from '../domain/entitys/comment-entity';
import { error } from 'console';
@Injectable()
export class PrismaCommentRepository implements CommentRepository {
  constructor(private readonly prisma: PrismaService) {}
  async getAllComments(publicationId?: string): Promise<Comment[]> {
    const comment = await this.prisma.comment.findMany({
      where: publicationId ? { publicationId } : undefined,
    });
    return comment.map((c) => Comment.persitence(c));
  }
  async getComment(id: string): Promise<Comment> {
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment) {
      throw new error(`Not exist comment with id ${id}`);
    }
    return Comment.persitence(comment);
  }
  async createComment(data: Comment): Promise<Comment> {
    const comment = await this.prisma.comment.create({
      data: {
        id: data.id,
        content: data.content,
        createdAt: data.createdAt,
        userId: data.userId,
        publicationId: data.publicationId,
      },
    });
    return Comment.persitence(comment);
  }
  async deleteComment(id: string): Promise<void> {
    await this.getComment(id);
    await this.prisma.comment.delete({ where: { id } });
  }
}
