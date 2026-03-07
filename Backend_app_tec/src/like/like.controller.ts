import {
  Body,
  Controller,
  Delete,
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
import { ToggleLike } from './use-case/like-toggle.use-case';
import { DeleteLike } from './use-case/like-delete.use-case';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import { ToggleLikeDto } from './dto/toggle-like.dto';

@Controller('like')
export class LikeController {
  constructor(
    private readonly createLikeUseCase: CreateLike,
    private readonly updateLikeUseCase: UpdateLike,
    private readonly getAllLikeUseCase: GetAllLikes,
    private readonly getLikeUseCase: GetLike,
    private readonly toggleLikeUseCase: ToggleLike,
    private readonly deleteLikeUseCase: DeleteLike,
  ) {}

  @Post('toggle')
  async toggleLike(@Body() data: ToggleLikeDto) {
    return this.toggleLikeUseCase.execute(data);
  }

  @Get()
  async getAllLike(@Query('publicationId') publicationId: string) {
    return this.getAllLikeUseCase.execute(publicationId);
  }

  @Get(':id')
  async getLike(@Param('id') id: string) {
    return this.getLikeUseCase.execute(id);
  }

  @Post()
  async createLike(@Body() data: CreateLikeDto) {
    return this.createLikeUseCase.execute(data);
  }

  @Patch(':id')
  async updateLike(@Param('id') id: string, @Body() data: UpdateLikeDto) {
    return this.updateLikeUseCase.execute(id, data);
  }

  @Delete(':id')
  async deleteLike(@Param('id') id: string) {
    return this.deleteLikeUseCase.execute(id);
  }
}
