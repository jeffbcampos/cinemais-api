import { CreateFavoriteMediaUseCase } from '../../application/usecases/create-favorite-media.usecase';

export interface IUserRepository {
  createFavoriteMedia(
    body: CreateFavoriteMediaUseCase.Input,
  ): Promise<CreateFavoriteMediaUseCase.Output>;
}
