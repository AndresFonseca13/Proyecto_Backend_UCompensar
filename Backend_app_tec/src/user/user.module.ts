import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserController } from './user.controller';
import { GetUserUseCase } from './use-cases/get-user.user-case';
import { CreateUseCase } from './use-cases/create-user.use-case';
import { GetAllUsersUseCase } from './use-cases/getAll-user.use-case';
import { UpdateUserUseCase } from './use-cases/update-user.use-case';
import { DeleteUserUseCase } from './use-cases/delete-user.user-case';
import { UserPrismaRepository } from './infraestructure/prisma-user.repository';
import { AuthModule } from 'src/auth/auth.module';
@Module({
  controllers: [UserController],
  providers: [
    PrismaService,

    {
      provide: 'UserRepository',
      useClass: UserPrismaRepository,
    },

    {
      provide: GetUserUseCase,
      useFactory: (repo) => new GetUserUseCase(repo),
      inject: ['UserRepository'],
    },
    {
      provide: CreateUseCase,
      useFactory: (repo) => new CreateUseCase(repo),
      inject: ['UserRepository'],
    },
    {
      provide: GetAllUsersUseCase,
      useFactory: (repo) => new GetAllUsersUseCase(repo),
      inject: ['UserRepository'],
    },

    {
      provide: UpdateUserUseCase,
      useFactory: (repo) => new UpdateUserUseCase(repo),
      inject: ['UserRepository'],
    },

    {
      provide: DeleteUserUseCase,
      useFactory: (repo) => new DeleteUserUseCase(repo),
      inject: ['UserRepository'],
    },
  ],
  imports: [AuthModule],
})
export class UsersModule {}
