import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { type BrandRepository } from '../domain/repository/brand-repository';

@Injectable()
export class UpdateBrand {
  constructor(
    @Inject('BrandRepository')
    private readonly repository: BrandRepository,
  ) {}

  async execute(id: string, data: { name?: string }) {
    const brand = await this.repository.getById(id);
    if (!brand) throw new NotFoundException(`Brand with id ${id} not found`);
    const updated = brand.update(data);
    return this.repository.update(updated);
  }
}
