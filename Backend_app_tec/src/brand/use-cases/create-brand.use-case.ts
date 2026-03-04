import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { type BrandRepository } from '../domain/repository/brand-repository';
import { Brand } from '../domain/entity/brand.entity';

@Injectable()
export class CreateBrand {
  constructor(
    @Inject('BrandRepository')
    private readonly repository: BrandRepository,
  ) {}

  async execute(data: { name: string }) {
    const existing = await this.repository.getByName(data.name);
    if (existing) throw new ConflictException(`Brand "${data.name}" already exists`);
    const brand = Brand.create(data);
    return this.repository.create(brand);
  }
}
