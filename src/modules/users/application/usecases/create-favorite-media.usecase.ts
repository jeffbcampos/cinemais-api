import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { CreateFavoriteMediaDto } from '../dto/create-favorite-media.dto';

export namespace CreateFavoriteMediaUseCase {
  export type Input = CreateFavoriteMediaDto & { userId: string };

  export type Output = void;

  export class Usecase {
    constructor(private readonly repository: IUserRepository) {}

    async execute(input: Input): Promise<Output> {
      await this.repository.createFavoriteMedia(input);
    }
  }
}
