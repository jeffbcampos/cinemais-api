import { UserRepository } from "../../infra/repositories/prisma/user-prisma.repository";
import { RemoveFavoriteMediaUseCase } from "../usecases/remove-favorite-media.usecase";

export const removeFavoriteMediaUseCaseFactory = (): RemoveFavoriteMediaUseCase.Usecase => {
  const repository = UserRepository.createInstance();
  return new RemoveFavoriteMediaUseCase.Usecase(repository);
};
