import { Inject, Injectable } from '@nestjs/common';
import { type UserRepository } from '../domain/repositories/user.repository';
@Injectable()
export class GetUserUseCase {
  constructor(
    @Inject('UserRepository') private readonly userRep: UserRepository,
  ) {}
  async execute(id: string) {
    const user = await this.userRep.getUserById(id);
    if (!user) {
      throw new Error(`The user with id ${id} not exist`);
    }
    return user;
  }
}
