import { NotFoundException } from "@nestjs/common";
import { MediaType } from "@prisma/client";
import { NotFoundError } from "rxjs";
import { CreateMediaUseCase } from "src/modules/media/application/usecases/create-media.usecase";
import { FindAllMediasUseCase } from "src/modules/media/application/usecases/find-all-medias.usecase";
import { FindMediaByIdUseCase } from "src/modules/media/application/usecases/find-media-by-id.usecase";
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

    async findAllMedia(body: FindAllMediasUseCase.Input): Promise<FindAllMediasUseCase.Output> {

        const page = Number(body.page) || 1;
        const limit = Number(body.limit) || 10;
        const skip = (page - 1) * limit;

        const medias = await this.prisma.media.findMany({
            skip,
            take: limit,
        });
        return {
            items: medias.map(media => ({
            ...media
            })),
            page,
            limit,
            total: await this.prisma.media.count()
        };
    }

    async findMediaById(body: FindMediaByIdUseCase.Input): Promise<FindMediaByIdUseCase.Output> {
        const media = await this.prisma.media.findUnique({
            where: { id: body.id },
        });

        if (!media) {
            throw new NotFoundException('Media not found');
        }

        return media;
    }

}