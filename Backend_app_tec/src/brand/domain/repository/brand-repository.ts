import { Brand } from '../entity/brand.entity';

export interface BrandRepository {
  getAll(): Promise<Brand[]>;
  getById(id: string): Promise<Brand | null>;
  getByName(name: string): Promise<Brand | null>;
  create(brand: Brand): Promise<Brand>;
  update(brand: Brand): Promise<Brand>;
  deleteById(id: string): Promise<void>;
}
