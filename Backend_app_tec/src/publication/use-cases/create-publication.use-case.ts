import { Inject, Injectable } from '@nestjs/common';
import { type PublicationRepository } from '../domain/repository/publication-repository';
import { Publication } from '../domain/entity.ts/publication.entity';

@Injectable()
export class CreatePublication {
  constructor(
    @Inject('PublicationRepository')
    private readonly repository: PublicationRepository,
  ) {}
  async execute(data: {
    name: string;
    description: string;
    img: string;
    price: number;
    brandId: string;
    userId: string;
  }) {
    const publication = Publication.create(data);
    return this.repository.createPublication(publication);
  }
}
