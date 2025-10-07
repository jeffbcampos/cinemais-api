import { MediaType } from "@prisma/client";
import { CreateMediaDto } from "../../application/dto/create-media.dto";
import { Media } from "../entities/media.entity";
import { FindAllMediasUseCase } from "../../application/usecases/find-all-medias.usecase";
import { FindMediaByIdUseCase } from "../../application/usecases/find-media-by-id.usecase";

export interface IMediaRepository {
  createMedia(body: CreateMediaDto): Promise<Media>;
  findAllMedia(body: FindAllMediasUseCase.Input): Promise<FindAllMediasUseCase.Output>;
  findMediaById(body: FindMediaByIdUseCase.Input): Promise<FindMediaByIdUseCase.Output>;
}