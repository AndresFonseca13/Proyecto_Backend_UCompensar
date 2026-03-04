import { Like } from '../entity/like-entity';

export interface LikeRepository {
  getAllLike(publicationId: string): Promise<Like[]>;
  createLike(data: Like): Promise<Like>;
  updateLike(id: string, data: Partial<Like>): Promise<Like>;
  getLike(id: string): Promise<Like | null>;
}
