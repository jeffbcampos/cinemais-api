import { favorite } from '@prisma/client';

export class User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  favorites: favorite[];
}
