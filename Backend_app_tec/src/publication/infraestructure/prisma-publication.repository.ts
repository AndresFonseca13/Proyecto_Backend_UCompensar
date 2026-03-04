import { Injectable } from '@nestjs/common';
import { PublicationRepository } from '../domain/repository/publication-repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { Publication } from '../domain/entity.ts/publication.entity';

@Injectable()
export class PrismaPublicationRepository implements PublicationRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toDomain(pub: {
    id: string;
    createAt: Date;
    name: string;
    description: string;
    img: string;
    price: number;
    brandId: string;
    userId: string;
    author: { id: string; name: string; photo: string };
    brand: { id: string; name: string };
    _count: { likes: number; comments: number };
  }): Publication {
    return Publication.fromPersistence({
      id: pub.id,
      createAt: pub.createAt,
      name: pub.name,
      description: pub.description,
      img: pub.img,
      price: pub.price,
      brandId: pub.brandId,
      userId: pub.userId,
      author: pub.author,
      brand: pub.brand,
      likesCount: pub._count.likes,
      commentsCount: pub._count.comments,
    });
  }

  async getAllPublications(userId?: string): Promise<Publication[]> {
    const publications = await this.prisma.publication.findMany({
      where: userId ? { userId } : undefined,
      include: {
        author: { select: { id: true, name: true, photo: true } },
        brand: { select: { id: true, name: true } },
        _count: { select: { likes: true, comments: true } },
      },
    });

    return publications.map((pub) => this.toDomain(pub));
  }

  async getById(id: string): Promise<Publication | null> {
    const pub = await this.prisma.publication.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, photo: true } },
        brand: { select: { id: true, name: true } },
        _count: { select: { likes: true, comments: true } },
      },
    });
    if (!pub) return null;
    return this.toDomain(pub);
  }

  async deleteById(id: string): Promise<void> {
    await this.prisma.publication.delete({
      where: { id },
    });
  }

  async createPublication(data: Publication): Promise<Publication> {
    const created = await this.prisma.publication.create({
      data: {
        id: data.id,
        name: data.name,
        description: data.description,
        img: data.img,
        price: data.price,
        brandId: data.brandId,
        userId: data.userId,
      },
      include: {
        author: { select: { id: true, name: true, photo: true } },
        brand: { select: { id: true, name: true } },
        _count: { select: { likes: true, comments: true } },
      },
    });

    return this.toDomain(created);
  }

  async updatePublication(data: Partial<Publication>): Promise<Publication> {
    if (!data.id) {
      throw new Error('ID is required for update');
    }

    const updated = await this.prisma.publication.update({
      where: { id: data.id },
      data: {
        name: data.name,
        description: data.description,
        img: data.img,
        price: data.price,
        brandId: data.brandId,
      },
      include: {
        author: { select: { id: true, name: true, photo: true } },
        brand: { select: { id: true, name: true } },
        _count: { select: { likes: true, comments: true } },
      },
    });

    return this.toDomain(updated);
  }
}
