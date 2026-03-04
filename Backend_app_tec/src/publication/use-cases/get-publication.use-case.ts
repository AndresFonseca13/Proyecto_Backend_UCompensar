import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { type PublicationRepository } from '../domain/repository/publication-repository';

@Injectable()
export class GetPublicationById {
  constructor(
    @Inject('PublicationRepository')
    private readonly repository: PublicationRepository,
  ) {}
  async execute(id: string) {
    const publication = await this.repository.getById(id);
    if (!publication) {
      throw new NotFoundException(`Publication with id ${id} not found`);
    }
    return publication;
  }
}
