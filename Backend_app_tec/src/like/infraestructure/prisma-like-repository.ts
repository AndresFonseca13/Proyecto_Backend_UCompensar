import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LikeRepository } from '../domain/repository/like-repository';
import { Like } from '../domain/entity/like-entity';

@Injectable()
export class PrismaLikeRepository implements LikeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getAllLike(publicationId: string): Promise<Like[]> {
    const likes = await this.prisma.like.findMany({
      where: { publicationId },
    });
    return likes.map((data) => Like.fromPersistence(data));
  }

  async getLike(id: string): Promise<Like | null> {
    const like = await this.prisma.like.findUnique({ where: { id } });
    if (!like) return null;
    return Like.fromPersistence(like);
  }

  async findByUserAndPublication(
    userId: string,
    publicationId: string,
  ): Promise<Like | null> {
    const like = await this.prisma.like.findUnique({
      where: { userId_publicationId: { userId, publicationId } },
    });
    if (!like) return null;
    return Like.fromPersistence(like);
  }

  async createLike(data: Like): Promise<Like> {
    const like = await this.prisma.like.create({
      data: {
        id: data.id,
        Isliked: data.Isliked,
        userId: data.userId,
        publicationId: data.publicationId,
        createdAt: data.createdAt,
      },
    });
    return Like.fromPersistence(like);
  }

  async updateLike(id: string, data: Partial<Like>): Promise<Like> {
    const like = await this.prisma.like.update({
      where: { id },
      data: {
        Isliked: data.Isliked,
      },
    });
    return Like.fromPersistence(like);
  }

  async deleteLike(id: string): Promise<void> {
    await this.prisma.like.delete({ where: { id } });
  }
}
