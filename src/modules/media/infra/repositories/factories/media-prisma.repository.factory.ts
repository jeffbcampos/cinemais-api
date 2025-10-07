import { MediaPrismaRepository } from "../prisma/media-prisma.repository";

export const mediaPrismaRepositoryFactory = (): MediaPrismaRepository => {
  return MediaPrismaRepository.createInstance();
};