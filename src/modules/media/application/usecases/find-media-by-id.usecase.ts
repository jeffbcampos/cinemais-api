import { Media } from "../../domain/entities/media.entity";
import { IMediaRepository } from "../../domain/repositories/media.repository.interface";

export namespace FindMediaByIdUseCase {
  export type Input = {
    id: string;
  };

  export type Output = Media | null;

  export class Usecase {
    constructor(private readonly repository: IMediaRepository) {}

    async execute(input: Input): Promise<Output> {
      return await this.repository.findMediaById(input);
    }
  }
}