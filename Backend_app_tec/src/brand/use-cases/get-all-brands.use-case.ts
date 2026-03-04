import { Inject, Injectable } from '@nestjs/common';
import { type BrandRepository } from '../domain/repository/brand-repository';

@Injectable()
export class GetAllBrands {
  constructor(
    @Inject('BrandRepository')
    private readonly repository: BrandRepository,
  ) {}

  async execute() {
    return this.repository.getAll();
  }
}
