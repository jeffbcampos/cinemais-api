import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFavoriteMediaUseCase } from 'src/modules/users/application/usecases/create-favorite-media.usecase';
import { GetFavoritesMediaUseCase } from 'src/modules/users/application/usecases/get-favorites-media.usecase';
import { IUserRepository } from 'src/modules/users/domain/repositories/user.repository.interface';
import { PrismaService } from 'src/shared/infra/prisma/prisma.service';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UserRepository implements IUserRepository {
  private static instance: UserRepository;

  constructor(private readonly prisma: PrismaService) {}

  public static createInstance(): UserRepository {
    if (!UserRepository.instance) {
      const prisma = new PrismaService();
      UserRepository.instance = new UserRepository(prisma);
    }
    return this.instance;
  }

  private async findById(id: string) {
    const user = await this.prisma.users.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  private async findMediaById(id: string) {
    const media = await this.prisma.media.findUnique({
      where: { id },
    });

    if (!media) {
      throw new NotFoundException('Media not found');
    }

    return media;
  }

  async createFavoriteMedia(
    body: CreateFavoriteMediaUseCase.Input,
  ): Promise<CreateFavoriteMediaUseCase.Output> {
    const user = await this.findById(body.userId);

    const media = await this.findMediaById(body.mediaId);

    const existingFavorite = await this.prisma.favorite.findFirst({
      where: {
        userId: body.userId,
        mediaId: body.mediaId,
      },
    });

    if (existingFavorite) {
      throw new ConflictException('Media already favorited by this user');
    }

    const favorite = await this.prisma.favorite.create({
      data: {
        id: uuid(),
        userId: body.userId,
        mediaId: body.mediaId,
      },
    });
  }

  async getUserFavorites(body: GetFavoritesMediaUseCase.Input): Promise<GetFavoritesMediaUseCase.Output> {
    const user = await this.findById(body.userId);

    const page = body.page ?? 1;
    const limit = body.limit ?? 10;
    const skip = (page - 1) * limit;


    const favorites = await this.prisma.favorite.findMany({
      where: { userId: user.id },
      include: { media: true },
      skip,
      take: limit,
    });

    return {
        items: favorites.map(fav => fav.media),        
        page,
        limit,
        total: await this.prisma.favorite.count({ where: { userId: user.id } }),
      };
    }
}
