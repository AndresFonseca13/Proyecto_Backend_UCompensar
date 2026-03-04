import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { User } from '../domain/entity/user.entity';
import { type UserRepository } from '../domain/repositories/user.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CreateUseCase {
  constructor(
    @Inject('UserRepository') private readonly userRepo: UserRepository,
  ) {}
  async execute(data: {
    email: string;
    password: string;
    name: string;
    rol: string;
    photo?: string;
    description?: string;
    city?: string;
  }) {
    const findUser = await this.userRepo.getUserByEmail(data.email);
    if (findUser) {
      throw new ConflictException('The user already exist');
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = User.create({ ...data, password: hashedPassword });
    return this.userRepo.createUser(user);
  }
}
