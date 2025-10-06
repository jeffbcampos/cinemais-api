import { UserRepository } from '../prisma/user-prisma.repository';

export const userPrismaRepositoryFactory = (): UserRepository => {
  return UserRepository.createInstance();
};
