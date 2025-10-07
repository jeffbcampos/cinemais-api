import { MediaType } from "@prisma/client";
import { CreateMediaUseCase } from "src/modules/media/application/usecases/create-media.usecase";
import { IMediaRepository } from "src/modules/media/domain/repositories/media.repository.interface";
import { PrismaService } from "src/shared/infra/prisma/prisma.service";
import { v4 as uuid } from 'uuid';

export class MediaPrismaRepository implements IMediaRepository {
    private static instance: MediaPrismaRepository;

    constructor(
        private readonly prisma: PrismaService
    ) {}

    public static createInstance(): MediaPrismaRepository {
        if (!MediaPrismaRepository.instance) {
            const prisma = PrismaService.getInstance();
            MediaPrismaRepository.instance = new MediaPrismaRepository(prisma);
        }
        return this.instance;
    }

    async createMedia(body: CreateMediaUseCase.Input): Promise<CreateMediaUseCase.Output> {
        const media = await this.prisma.media.create({
            data: {
                id: uuid(),
                title: body.title,
                description: body.description,
                type: body.type,
                releaseYear: body.releaseYear,
                genre: body.genre,
            }
        });

        return media;
    }

}