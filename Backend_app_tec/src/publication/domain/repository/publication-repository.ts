import { Publication } from '../entity.ts/publication.entity';

export interface PublicationRepository {
  getAllPublications(idUser?: string): Promise<Publication[]>;
  getById(id: string): Promise<Publication | null>;
  deleteById(id: string): Promise<void>;
  updatePublication(data: Partial<Publication>): Promise<Publication>;
  createPublication(data: Publication): Promise<Publication>;
}
