import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserPrismaRepository } from 'src/user/infraestructure/prisma-user.repository';
import { JwtPaiload } from './types/jwt-pailod.type';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private users: UserPrismaRepository,
    private jwtService: JwtService,
  ) {}

  async AuthUser(
    email: string,
    pass: string,
  ): Promise<{
    access_token: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  }> {
    const user = await this.users.getUserByEmail(email);
    if (!user) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    const isMatch = await bcrypt.compare(pass, user.password.getPassword());
    if (!isMatch) {
      throw new UnauthorizedException();
    }
    const payload: JwtPaiload = {
      name: user.name,
      email: user.email.getEmail(),
      sub: user.id,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id || '',
        name: user.name,
        email: user.email.getEmail(),
      },
    };
  }
}
