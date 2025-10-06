import { CreateFavoriteMediaUseCase } from '../../application/usecases/create-favorite-media.usecase';
import { GetFavoritesMediaUseCase } from '../../application/usecases/get-favorites-media.usecase';

export interface IUserRepository {
  createFavoriteMedia(
    body: CreateFavoriteMediaUseCase.Input,
  ): Promise<CreateFavoriteMediaUseCase.Output>;

  getUserFavorites(input: GetFavoritesMediaUseCase.Input): Promise<GetFavoritesMediaUseCase.Output>;
  
}
