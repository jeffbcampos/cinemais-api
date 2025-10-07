import { MediaType } from "@prisma/client";
import { IMediaRepository } from "../../domain/repositories/media.repository.interface";
import { CreateMediaDto } from "../dto/create-media.dto";
import { Media } from "../../domain/entities/media.entity";

export namespace CreateMediaUseCase {
  export type Input = CreateMediaDto;

    export type Output = Media;

    export class Usecase {
        constructor(private readonly repository: IMediaRepository) {}

        async execute(input: Input): Promise<Output> {
            return await this.repository.createMedia(input);
        }
    }
}