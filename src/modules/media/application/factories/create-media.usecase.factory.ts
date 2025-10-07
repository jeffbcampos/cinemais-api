import { mediaPrismaRepositoryFactory } from "../../infra/repositories/factories/media-prisma.repository.factory";
import { CreateMediaUseCase } from "../usecases/create-media.usecase";

export const createMediaUseCaseFactory = (): CreateMediaUseCase.Usecase => {
    const repository = mediaPrismaRepositoryFactory();
    return new CreateMediaUseCase.Usecase(repository);
}