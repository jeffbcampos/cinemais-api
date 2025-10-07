import { MediaPrismaRepository } from "../../infra/repositories/prisma/media-prisma.repository";
import { FindMediaByIdUseCase } from "../usecases/find-media-by-id.usecase";

export const findMediaByIdUsecaseFactory = (): FindMediaByIdUseCase.Usecase => {
  const repository = MediaPrismaRepository.createInstance();
  return new FindMediaByIdUseCase.Usecase(repository);
};
