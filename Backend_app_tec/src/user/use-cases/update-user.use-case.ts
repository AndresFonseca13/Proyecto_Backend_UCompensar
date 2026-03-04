import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { type UserRepository } from '../domain/repositories/user.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRep: UserRepository,
  ) {}

  async execute(
    id: string,
    data: {
      email?: string;
      password?: string;
      Uname?: string;
      photo?: string | null;
      description?: string | null;
      city?: string | null;
    },
  ) {
    const existingUser = await this.userRep.getUserById(id);

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    const updatedUser = existingUser.update(data);
    return this.userRep.updateUser(updatedUser);
  }
}
