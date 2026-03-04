import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { GetAllPublications } from './use-cases/get-publications.use-case';
import { GetPublicationById } from './use-cases/get-publication.use-case';
import { CreatePublication } from './use-cases/create-publication.use-case';
import { UpdatePublication } from './use-cases/update-publication.use-case';
import { DeletePublication } from './use-cases/delete-publication.use-case';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';

@Controller('publication')
export class PublicationController {
  constructor(
    private readonly getAllPublication: GetAllPublications,
    private readonly getPublication: GetPublicationById,
    private readonly createPublication: CreatePublication,
    private readonly updatePublication: UpdatePublication,
    private readonly deletePublication: DeletePublication,
  ) {}
  @UseGuards(AuthGuard)
  @Get()
  async getAll(@Query('userId') userId?: string) {
    return this.getAllPublication.execute(userId);
  }
  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.getPublication.execute(id);
  }
  @Post()
  async createP(@Body() data: CreatePublicationDto) {
    return this.createPublication.execute(data);
  }
  @Patch(':id')
  async updateP(@Body() data: UpdatePublicationDto, @Param('id') id: string) {
    return this.updatePublication.execute(id, data);
  }
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.deletePublication.execute(id);
  }
}
