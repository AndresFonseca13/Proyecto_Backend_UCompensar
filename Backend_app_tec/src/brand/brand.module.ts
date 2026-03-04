import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BrandController } from './brand.controller';
import { PrismaBrandRepository } from './infraestructure/prisma-brand.repository';
import { GetAllBrands } from './use-cases/get-all-brands.use-case';
import { GetBrand } from './use-cases/get-brand.use-case';
import { CreateBrand } from './use-cases/create-brand.use-case';
import { UpdateBrand } from './use-cases/update-brand.use-case';
import { DeleteBrand } from './use-cases/delete-brand.use-case';

@Module({
  controllers: [BrandController],
  providers: [
    PrismaService,
    {
      provide: 'BrandRepository',
      useClass: PrismaBrandRepository,
    },
    {
      provide: GetAllBrands,
      useFactory: (repo) => new GetAllBrands(repo),
      inject: ['BrandRepository'],
    },
    {
      provide: GetBrand,
      useFactory: (repo) => new GetBrand(repo),
      inject: ['BrandRepository'],
    },
    {
      provide: CreateBrand,
      useFactory: (repo) => new CreateBrand(repo),
      inject: ['BrandRepository'],
    },
    {
      provide: UpdateBrand,
      useFactory: (repo) => new UpdateBrand(repo),
      inject: ['BrandRepository'],
    },
    {
      provide: DeleteBrand,
      useFactory: (repo) => new DeleteBrand(repo),
      inject: ['BrandRepository'],
    },
  ],
})
export class BrandModule {}
