import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { GetAllBrands } from './use-cases/get-all-brands.use-case';
import { GetBrand } from './use-cases/get-brand.use-case';
import { CreateBrand } from './use-cases/create-brand.use-case';
import { UpdateBrand } from './use-cases/update-brand.use-case';
import { DeleteBrand } from './use-cases/delete-brand.use-case';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Controller('brand')
export class BrandController {
  constructor(
    private readonly getAllBrands: GetAllBrands,
    private readonly getBrand: GetBrand,
    private readonly createBrand: CreateBrand,
    private readonly updateBrand: UpdateBrand,
    private readonly deleteBrand: DeleteBrand,
  ) {}

  @Get()
  async getAll() {
    return this.getAllBrands.execute();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.getBrand.execute(id);
  }

  @Post()
  async create(@Body() body: CreateBrandDto) {
    return this.createBrand.execute(body);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateBrandDto) {
    return this.updateBrand.execute(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.deleteBrand.execute(id);
  }
}
