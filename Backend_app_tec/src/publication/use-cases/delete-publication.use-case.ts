import { Inject, Injectable } from '@nestjs/common';
import { type PublicationRepository } from '../domain/repository/publication-repository';

@Injectable()
export class DeletePublication {
  constructor(
    @Inject('PublicationRepository')
    private readonly repository: PublicationRepository,
  ) {}
  async execute(id: string) {
    const verifyExist = await this.repository.getById(id);
    if (!verifyExist) {
      throw new Error(`The publication with ${id} not exist`);
    }
    return this.repository.deleteById(id);
  }
}
