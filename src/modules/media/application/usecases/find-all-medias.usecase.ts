import { Media } from "../../domain/entities/media.entity";
import { IMediaRepository } from "../../domain/repositories/media.repository.interface";

export namespace FindAllMediasUseCase {
  export type Input = {
    page?: number;
    limit?: number;
  };

  export type Output = {
    items: Media[];
    page: number;
    limit: number;
    total: number;
  };

  export class Usecase {
    constructor(
        private readonly repository: IMediaRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
        return this.repository.findAllMedia(input);
    }
  }
}