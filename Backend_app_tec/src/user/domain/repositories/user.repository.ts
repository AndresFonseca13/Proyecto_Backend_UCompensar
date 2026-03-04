import { User } from '../entity/user.entity';

export interface UserRepository {
  getUserById(email: string): Promise<User>;
  getUserByEmail(email: string): Promise<User | null>;
  getAllUsers(): Promise<User[]>;
  createUser(user: User): Promise<User>;
  updateUser(user: Partial<User>): Promise<User>;
  deleteUser(id: string): Promise<void>;
}
