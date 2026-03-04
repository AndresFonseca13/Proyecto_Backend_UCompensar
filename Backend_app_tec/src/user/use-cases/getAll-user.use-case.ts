import { Inject, Injectable } from '@nestjs/common';
import { type UserRepository } from '../domain/repositories/user.repository';
@Injectable()
export class GetAllUsersUseCase {
  constructor(
    @Inject('UserRepository') private readonly userRep: UserRepository,
  ) {}
  execute() {
    return this.userRep.getAllUsers();
  }
}
