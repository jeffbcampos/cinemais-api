import { media } from "@prisma/client";
import { IUserRepository } from "../../domain/repositories/user.repository.interface";
import { GetFavoritesMediaDto } from "../dto/get-favorites-media.dto";

export namespace GetFavoritesMediaUseCase {
  export type Input = GetFavoritesMediaDto;

  export type Output = {  
    items: media[];
    total: number;
    page: number;
    limit: number;
  };

  export class Usecase {
    constructor(
        private readonly userRepository: IUserRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
      const media = await this.userRepository.getUserFavorites(input);
      return media;
    }
  }
}