import { Inject, Injectable } from '@nestjs/common';
import { type UserRepository } from '../domain/repositories/user.repository';
@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject('UserRepository') private readonly userRep: UserRepository,
  ) {}
  async execute(id: string) {
    const findUser = await this.userRep.getUserById(id);
    if (!findUser) {
      throw new Error(`The user with id ${id} not exist`);
    }
    return this.userRep.deleteUser(id);
  }
}
