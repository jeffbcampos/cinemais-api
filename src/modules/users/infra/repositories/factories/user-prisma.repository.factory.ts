import { UserPrismaRepository } from '../prisma/user-prisma.repository';

export const userPrismaRepositoryFactory = (): UserPrismaRepository => {
  return UserPrismaRepository.createInstance();
};
