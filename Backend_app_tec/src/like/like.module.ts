import { Module } from '@nestjs/common';
import { LikeController } from './like.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaLikeRepository } from './infraestructure/prisma-like-repository';
import { CreateLike } from './use-case/like-create.use-case';
import { GetLike } from './use-case/like-get.use-case';
import { GetAllLikes } from './use-case/like-get-all.use-case';
import { UpdateLike } from './use-case/like-update.use-case';
import { ToggleLike } from './use-case/like-toggle.use-case';
import { DeleteLike } from './use-case/like-delete.use-case';

@Module({
  controllers: [LikeController],
  providers: [
    PrismaService,
    {
      provide: 'LikeRepository',
      useClass: PrismaLikeRepository,
    },
    {
      provide: CreateLike,
      useFactory: (repo) => new CreateLike(repo),
      inject: ['LikeRepository'],
    },
    {
      provide: GetLike,
      useFactory: (repo) => new GetLike(repo),
      inject: ['LikeRepository'],
    },
    {
      provide: GetAllLikes,
      useFactory: (repo) => new GetAllLikes(repo),
      inject: ['LikeRepository'],
    },
    {
      provide: UpdateLike,
      useFactory: (repo) => new UpdateLike(repo),
      inject: ['LikeRepository'],
    },
    {
      provide: ToggleLike,
      useFactory: (repo) => new ToggleLike(repo),
      inject: ['LikeRepository'],
    },
    {
      provide: DeleteLike,
      useFactory: (repo) => new DeleteLike(repo),
      inject: ['LikeRepository'],
    },
  ],
})
export class LikeModule {}
