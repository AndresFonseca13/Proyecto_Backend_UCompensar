import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserPrismaRepository } from 'src/user/infraestructure/prisma-user.repository';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { jwtConstants } from './contants';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserPrismaRepository, AuthGuard],
  exports: [AuthGuard, JwtModule],
})
export class AuthModule {}
