import { Inject, Injectable } from '@nestjs/common';
import { type PublicationRepository } from '../domain/repository/publication-repository';

@Injectable()
export class UpdatePublication {
  constructor(
    @Inject('PublicationRepository')
    private readonly repository: PublicationRepository,
  ) {}
  async execute(
    id: string,
    data: {
      name?: string;
      description?: string;
      img?: string;
      price?: number;
      brandId?: string;
    },
  ) {
    const verifyExist = await this.repository.getById(id);
    if (!verifyExist) {
      throw new Error(`The publication with ${id} not exist`);
    }
    const publication = verifyExist.update(data);
    return this.repository.updatePublication(publication);
  }
}
