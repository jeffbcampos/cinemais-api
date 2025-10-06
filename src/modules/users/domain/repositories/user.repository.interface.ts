import { CreateFavoriteMediaUseCase } from '../../application/usecases/create-favorite-media.usecase';
import { GetFavoritesMediaUseCase } from '../../application/usecases/get-favorites-media.usecase';
import { RemoveFavoriteMediaUseCase } from '../../application/usecases/remove-favorite-media.usecase';

export interface IUserRepository {
  createFavoriteMedia(
    input: CreateFavoriteMediaUseCase.Input,
  ): Promise<CreateFavoriteMediaUseCase.Output>;

  getUserFavorites(input: GetFavoritesMediaUseCase.Input): Promise<GetFavoritesMediaUseCase.Output>;

  removeFavoriteMedia(
    input: RemoveFavoriteMediaUseCase.Input,
  ): Promise<RemoveFavoriteMediaUseCase.Output>;
  
}
