import { userPrismaRepositoryFactory } from '../../infra/repositories/factories/user-prisma.repository.factory';
import { CreateFavoriteMediaUseCase } from '../usecases/create-favorite-media.usecase';

export const createFavoriteMediaUseCaseFactory =
  (): CreateFavoriteMediaUseCase.Usecase => {
    const repository = userPrismaRepositoryFactory();
    return new CreateFavoriteMediaUseCase.Usecase(repository);
  };
