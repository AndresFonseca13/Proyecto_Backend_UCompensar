import { Module } from '@nestjs/common';
import { PublicationController } from './publication.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaPublicationRepository } from './infraestructure/prisma-publication.repository';
import { CreatePublication } from './use-cases/create-publication.use-case';
import { GetPublicationById } from './use-cases/get-publication.use-case';
import { GetAllPublications } from './use-cases/get-publications.use-case';
import { DeletePublication } from './use-cases/delete-publication.use-case';
import { UpdatePublication } from './use-cases/update-publication.use-case';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [PublicationController],
  providers: [
    PrismaService,
    {
      provide: 'PublicationRepository',
      useClass: PrismaPublicationRepository,
    },
    {
      provide: CreatePublication,
      useFactory: (repo) => new CreatePublication(repo),
      inject: ['PublicationRepository'],
    },
    {
      provide: GetPublicationById,
      useFactory: (repo) => new GetPublicationById(repo),
      inject: ['PublicationRepository'],
    },
    {
      provide: GetAllPublications,
      useFactory: (repo) => new GetAllPublications(repo),
      inject: ['PublicationRepository'],
    },
    {
      provide: DeletePublication,
      useFactory: (repo) => new DeletePublication(repo),
      inject: ['PublicationRepository'],
    },
    {
      provide: UpdatePublication,
      useFactory: (repo) => new UpdatePublication(repo),
      inject: ['PublicationRepository'],
    },
  ],
  imports: [AuthModule],
})
export class PublicationModule {}
