import { UserPrismaRepository } from "../../infra/repositories/prisma/user-prisma.repository";
import { RemoveFavoriteMediaUseCase } from "../usecases/remove-favorite-media.usecase";

export const removeFavoriteMediaUseCaseFactory = (): RemoveFavoriteMediaUseCase.Usecase => {
  const repository = UserPrismaRepository.createInstance();
  return new RemoveFavoriteMediaUseCase.Usecase(repository);
};
