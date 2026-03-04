import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Patch,
  UseGuards,
} from '@nestjs/common';

import { GetUserUseCase } from './use-cases/get-user.user-case';
import { CreateUseCase } from './use-cases/create-user.use-case';
import { UpdateUserUseCase } from './use-cases/update-user.use-case';
import { DeleteUserUseCase } from './use-cases/delete-user.user-case';
import { GetAllUsersUseCase } from './use-cases/getAll-user.use-case';
import { CreateUserDto } from './dto/user-create.dto';
import { UpdateUserDto } from './dto/user.update.dto';
import { AuthGuard } from 'src/auth/auth.guard';
@Controller('users')
export class UserController {
  constructor(
    private readonly getUserUseCase: GetUserUseCase,
    private readonly createUserUseCase: CreateUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly GetAllUsersUseCase: GetAllUsersUseCase,
  ) {}
  @UseGuards(AuthGuard)
  @Get()
  async getAllUsers() {
    return this.GetAllUsersUseCase.execute();
  }
  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.getUserUseCase.execute(id);
  }

  @Post()
  async createUser(@Body() body: CreateUserDto) {
    return this.createUserUseCase.execute(body);
  }

  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.updateUserUseCase.execute(id, body);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.deleteUserUseCase.execute(id);
  }
}
