import { MediaType } from "@prisma/client";
import { CreateMediaDto } from "../../application/dto/create-media.dto";
import { Media } from "../entities/media.entity";

export interface IMediaRepository {
    createMedia(body: CreateMediaDto): Promise<Media>;
}