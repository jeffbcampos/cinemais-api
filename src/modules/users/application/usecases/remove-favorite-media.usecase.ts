import { IUserPrismaRepository } from "../../domain/repositories/user.repository.interface";
import { RemoveFavoriteMediaDto } from "../dto/remove-favorite-media.dto";

export namespace RemoveFavoriteMediaUseCase {
  export type Input = RemoveFavoriteMediaDto;

  export type Output = void;

  export class Usecase {
    constructor(private readonly repository: IUserPrismaRepository) {}

    async execute(input: Input): Promise<Output> {
      await this.repository.removeFavoriteMedia(input);
    }
  }
}
