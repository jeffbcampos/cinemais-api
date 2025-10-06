import { userPrismaRepositoryFactory } from '../../infra/repositories/factories/user-prisma.repository.factory';
import { GetFavoritesMediaUseCase } from '../usecases/get-favorites-media.usecase';

export const getFavoritesMediaUseCaseFactory = (): GetFavoritesMediaUseCase.Usecase => {
    const repository = userPrismaRepositoryFactory();
    return new GetFavoritesMediaUseCase.Usecase(repository);
};
