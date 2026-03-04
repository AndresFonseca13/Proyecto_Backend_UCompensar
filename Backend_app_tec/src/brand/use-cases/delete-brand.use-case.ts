import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { type BrandRepository } from '../domain/repository/brand-repository';

@Injectable()
export class DeleteBrand {
  constructor(
    @Inject('BrandRepository')
    private readonly repository: BrandRepository,
  ) {}

  async execute(id: string) {
    const brand = await this.repository.getById(id);
    if (!brand) throw new NotFoundException(`Brand with id ${id} not found`);
    await this.repository.deleteById(id);
    return { message: `Brand "${brand.name}" deleted successfully` };
  }
}
