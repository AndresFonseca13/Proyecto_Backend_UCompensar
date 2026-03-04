import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRepository } from '../domain/repositories/user.repository';
import { User } from '../domain/entity/user.entity';

@Injectable()
export class UserPrismaRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getUserById(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new Error(`Not exist the user`);
    }

    return User.fromPersistence({
      id: user.id,
      email: user.email,
      password: user.password,
      name: user.name,
      photo: user.photo,
      rol: user.rol,
      createdAt: user.createdAt,
      description: user.description,
      city: user.city,
    });
  }
  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) return null;

    return User.fromPersistence({
      id: user.id,
      email: user.email,
      password: user.password,
      name: user.name,
      photo: user.photo,
      rol: user.rol,
      createdAt: user.createdAt,
      description: user.description,
      city: user.city,
    });
  }
  async createUser(user: User): Promise<User> {
    const create = await this.prisma.user.create({
      data: {
        id: user.id,
        email: user.email.getEmail(),
        name: user.name,
        city: user.city ?? '',
        password: user.password.getPassword(),
        rol: '',
        photo: user.photo ?? '',
        description: user.description ?? '',
        createdAt: user.createdAt,
      },
    });

    return User.fromPersistence({
      id: create.id,
      email: create.email,
      password: create.password,
      name: create.name,
      rol: create.rol,
      photo: create.photo,
      createdAt: create.createdAt,
      description: create.description,
      city: create.city,
    });
  }

  async getAllUsers(): Promise<User[]> {
    const users = await this.prisma.user.findMany();

    return users.map((u) =>
      User.fromPersistence({
        id: u.id,
        email: u.email,
        password: u.password,
        name: u.name,
        rol: u.rol,
        photo: u.photo,
        createdAt: u.createdAt,
        description: u.description,
        city: u.city,
      }),
    );
  }

  async deleteUser(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  async updateUser(user: User): Promise<User> {
    const updated = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        email: user.email.getEmail(),
        password: user.password.getPassword(),
        name: user.name,
        photo: user.photo ?? '',
        description: user.description ?? '',
        city: user.city ?? '',
      },
    });

    return User.fromPersistence({
      id: updated.id,
      email: updated.email,
      password: updated.password,
      name: updated.name,
      rol: updated.rol,
      photo: updated.photo,
      createdAt: updated.createdAt,
      description: updated.description,
      city: updated.city,
    });
  }
}
