import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateLike } from './use-case/like-create.use-case';
import { UpdateLike } from './use-case/like-update.use-case';
import { GetAllLikes } from './use-case/like-get-all.use-case';
import { GetLike } from './use-case/like-get.use-case';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';

@Controller('like')
export class LikeController {
  private constructor(
    private readonly createLikeUseCase: CreateLike,
    private readonly UpdateLikeUseCase: UpdateLike,
    private readonly getAllLikeUseCase: GetAllLikes,
    private readonly getLikeUseCase: GetLike,
  ) {}
  @Get()
  async getAllLike(@Query('publicationId') publicationId: string) {
    return await this.getAllLikeUseCase.execute(publicationId);
  }
  @Post()
  async createliKe(@Body() data: CreateLikeDto) {
    return await this.createLikeUseCase.execute(data);
  }
  @Patch(':id')
  async updateLike(@Param('id') id: string, data: UpdateLikeDto) {
    return await this.UpdateLikeUseCase.execute(id, data);
  }
}
