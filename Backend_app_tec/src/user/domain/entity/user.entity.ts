import { Email } from '../value-objects/email.vo';
import { Password } from '../value-objects/password';

export class User {
  private constructor(
    public readonly id: string,
    public readonly email: Email,
    public readonly password: Password,
    public readonly name: string,
    public readonly photo: string | null,
    public readonly createdAt: Date,
    public readonly description: string | null,
    public readonly city: string | null,
    public readonly rol: string | null,
  ) {}

  static create(data: {
    email: string;
    password: string;
    name: string;
    photo?: string;
    description?: string;
    city?: string;
    rol?: string;
  }) {
    return new User(
      crypto.randomUUID(),
      Email.create(data.email),
      Password.create(data.password),
      data.name,
      data.photo ?? null,
      new Date(),
      data.description ?? null,
      data.city ?? null,
      data.rol ?? null,
    );
  }

  update(data: {
    email?: string;
    password?: string;
    name?: string;
    photo?: string | null;
    description?: string | null;
    city?: string | null;
  }): User {
    return new User(
      this.id,
      data.email ? Email.create(data.email) : this.email,
      data.password ? Password.create(data.password) : this.password,
      data.name ? data.name : this.name,
      data.photo !== undefined ? data.photo : this.photo,
      this.createdAt,
      data.description !== undefined ? data.description : this.description,
      data.city !== undefined ? data.city : this.city,
      this.rol,
    );
  }

  static fromPersistence(data: {
    id: string;
    email: string;
    password: string;
    name: string;
    photo: string | null;
    createdAt: Date;
    description: string | null;
    city: string | null;
    rol: string | null;
  }) {
    return new User(
      data.id,
      Email.create(data.email),
      Password.create(data.password),
      data.name,
      data.photo,
      data.createdAt,
      data.description,
      data.city,
      data.rol,
    );
  }
}
