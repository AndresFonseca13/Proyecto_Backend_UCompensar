import { Inject, Injectable } from '@nestjs/common';
import { type PublicationRepository } from '../domain/repository/publication-repository';

@Injectable()
export class GetAllPublications {
  constructor(
    @Inject('PublicationRepository')
    private readonly repository: PublicationRepository,
  ) {}
  async execute(userId?: string) {
    return this.repository.getAllPublications(userId);
  }
}
