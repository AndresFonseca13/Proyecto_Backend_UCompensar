import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetComment } from './use-cases/comment-get.use-case';
import { GetAllComment } from './use-cases/comment-getAll.use-case';
import { CreateComment } from './use-cases/comment-create.use-case';
import { DeleteComment } from './use-cases/comment-delete.use-case';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comment')
export class CommentController {
  constructor(
    private readonly getCommentUseCase: GetComment,
    private readonly GetAllCommentUseCase: GetAllComment,
    private readonly CreateCommentUseCase: CreateComment,
    private readonly DeleteCommentUseCase: DeleteComment,
  ) {}
  @UseGuards(AuthGuard)
  @Get()
  async getAllComment(@Query('publicationId') publicationId?: string) {
    return await this.GetAllCommentUseCase.execute(publicationId);
  }
  @Get(':id')
  async getComment(@Param('id') id: string) {
    return await this.getCommentUseCase.execute(id);
  }
  @Delete(':id')
  async DeleteComment(@Param('id') id: string) {
    return await this.DeleteCommentUseCase.execute(id);
  }
  @Post()
  async createComment(@Body() data: CreateCommentDto) {
    return await this.CreateCommentUseCase.execute(data);
  }
}
