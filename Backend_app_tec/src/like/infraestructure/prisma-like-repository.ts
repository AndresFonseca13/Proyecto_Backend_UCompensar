import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LikeRepository } from '../domain/repository/like-repository';
import { Like } from '../domain/entity/like-entity';

@Injectable()
export class PrismaLikeRepository implements LikeRepository {
  private constructor(private readonly prisma: PrismaService) {}
  async getAllLike(publicationId: string): Promise<Like[]> {
    const likes = await this.prisma.like.findMany({
      where: { publicationId },
    });
    return likes.map((data) => Like.persistence(data));
  }
  async getLike(id: string): Promise<Like | null> {
    const like = await this.prisma.like.findUnique({ where: { id } });
    if (!like) return null;
    return Like.persistence(like);
  }
  async createLike(data: Like): Promise<Like> {
    const like = await this.prisma.like.create({
      data: {
        id: data.id,
        Isliked: true,
        userId: data.userId,
        publicationId: data.publicationId,
        createdAt: data.createdAt,
      },
    });
    return Like.persistence(like);
  }
  async updateLike(id: string, data: Partial<Like>): Promise<Like> {
    const like = await this.prisma.like.update({
      where: { id },
      data: {
        Isliked: data.Isliked,
      },
    });
    return Like.persistence(like);
  }
}
