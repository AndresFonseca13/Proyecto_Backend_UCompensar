import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BrandRepository } from '../domain/repository/brand-repository';
import { Brand } from '../domain/entity/brand.entity';

@Injectable()
export class PrismaBrandRepository implements BrandRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toDomain(raw: { id: string; name: string; createAt: Date }): Brand {
    return Brand.fromPersistence(raw);
  }

  async getAll(): Promise<Brand[]> {
    const brands = await this.prisma.brand.findMany();
    return brands.map((b) => this.toDomain(b));
  }

  async getById(id: string): Promise<Brand | null> {
    const brand = await this.prisma.brand.findUnique({ where: { id } });
    if (!brand) return null;
    return this.toDomain(brand);
  }

  async getByName(name: string): Promise<Brand | null> {
    const brand = await this.prisma.brand.findUnique({ where: { name } });
    if (!brand) return null;
    return this.toDomain(brand);
  }

  async create(brand: Brand): Promise<Brand> {
    const created = await this.prisma.brand.create({
      data: { id: brand.id, name: brand.name },
    });
    return this.toDomain(created);
  }

  async update(brand: Brand): Promise<Brand> {
    const updated = await this.prisma.brand.update({
      where: { id: brand.id },
      data: { name: brand.name },
    });
    return this.toDomain(updated);
  }

  async deleteById(id: string): Promise<void> {
    await this.prisma.brand.delete({ where: { id } });
  }
}
