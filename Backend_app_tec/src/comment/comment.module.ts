import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetComment } from './use-cases/comment-get.use-case';
import { DeleteComment } from './use-cases/comment-delete.use-case';
import { CreateComment } from './use-cases/comment-create.use-case';
import { GetAllComment } from './use-cases/comment-getAll.use-case';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaCommentRepository } from './infraestructure/prisma-comment-repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: 'CommentRepository',
      useClass: PrismaCommentRepository,
    },
    {
      provide: GetComment,
      useFactory: (repo) => new GetComment(repo),
      inject: ['CommentRepository'],
    },
    {
      provide: DeleteComment,
      useFactory: (repo) => new DeleteComment(repo),
      inject: ['CommentRepository'],
    },
    {
      provide: CreateComment,
      useFactory: (repo) => new CreateComment(repo),
      inject: ['CommentRepository'],
    },
    {
      provide: GetAllComment,
      useFactory: (repo) => new GetAllComment(repo),
      inject: ['CommentRepository'],
    },
  ],
  controllers: [CommentController],
  imports: [AuthModule],
})
export class CommentModule {}
