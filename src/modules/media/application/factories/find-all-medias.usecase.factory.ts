import { MediaPrismaRepository } from "../../infra/repositories/prisma/media-prisma.repository";
import { FindAllMediasUseCase } from "../usecases/find-all-medias.usecase";

export const findAllMediasUseCaseFactory = (): FindAllMediasUseCase.Usecase => {
    const repository = MediaPrismaRepository.createInstance();
    return new FindAllMediasUseCase.Usecase(repository);
}