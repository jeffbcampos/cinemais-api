import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { CreateFavoriteMediaUseCase } from '../../application/usecases/create-favorite-media.usecase';
import { GetFavoritesMediaUseCase } from '../../application/usecases/get-favorites-media.usecase';
import { RemoveFavoriteMediaUseCase } from '../../application/usecases/remove-favorite-media.usecase';
import * as createFavoriteMediaFactory from '../../application/factories/create-favorite-media.usecase.factory';
import * as getFavoritesMediaFactory from '../../application/factories/get-favorites-media.usecase.factory';
import * as removeFavoriteMediaFactory from '../../application/factories/remove-favorite-media.usecase.factory';

describe('UsersController', () => {
  let controller: UsersController;
  let createFavoriteMediaUseCase: CreateFavoriteMediaUseCase.Usecase;
  let getFavoritesMediaUseCase: GetFavoritesMediaUseCase.Usecase;
  let removeFavoriteMediaUseCase: RemoveFavoriteMediaUseCase.Usecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
    }).compile();

    controller = module.get<UsersController>(UsersController);

    createFavoriteMediaUseCase = {
      execute: jest.fn(),
    } as any;

    getFavoritesMediaUseCase = {
      execute: jest.fn(),
    } as any;

    removeFavoriteMediaUseCase = {
      execute: jest.fn(),
    } as any;

    jest.spyOn(createFavoriteMediaFactory, 'createFavoriteMediaUseCaseFactory').mockReturnValue(createFavoriteMediaUseCase);
    jest.spyOn(getFavoritesMediaFactory, 'getFavoritesMediaUseCaseFactory').mockReturnValue(getFavoritesMediaUseCase);
    jest.spyOn(removeFavoriteMediaFactory, 'removeFavoriteMediaUseCaseFactory').mockReturnValue(removeFavoriteMediaUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createFavorite', () => {
    it('should create a favorite media for a user', async () => {
      const userId = 'user-123';
      const body = { mediaId: 'media-456' };

      (createFavoriteMediaUseCase.execute as jest.Mock).mockResolvedValue(undefined);

      await controller.createFavorite(userId, body);

      expect(createFavoriteMediaFactory.createFavoriteMediaUseCaseFactory).toHaveBeenCalled();
      expect(createFavoriteMediaUseCase.execute).toHaveBeenCalledWith({
        userId,
        mediaId: body.mediaId,
      });
    });

    it('should handle errors when creating a favorite', async () => {
      const userId = 'user-123';
      const body = { mediaId: 'media-456' };
      const error = new Error('Failed to create favorite');

      (createFavoriteMediaUseCase.execute as jest.Mock).mockRejectedValue(error);

      await expect(controller.createFavorite(userId, body)).rejects.toThrow(error);
      expect(createFavoriteMediaUseCase.execute).toHaveBeenCalledWith({
        userId,
        mediaId: body.mediaId,
      });
    });
  });

  describe('getFavorites', () => {
    it('should get favorites media for a user with pagination', async () => {
      const userId = 'user-123';
      const page = 1;
      const limit = 10;
      const mockOutput: GetFavoritesMediaUseCase.Output = {
        items: [
          {
            id: 'media-1',
            title: 'Movie 1',
            description: 'Description 1',
            type: 'movie' as any,
            releaseYear: 2020,
            genre: 'Action',
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
          },
        ],
        total: 1,
        page: 1,
        limit: 10,
      };

      (getFavoritesMediaUseCase.execute as jest.Mock).mockResolvedValue(mockOutput);

      const result = await controller.getFavorites(userId, page, limit);

      expect(getFavoritesMediaFactory.getFavoritesMediaUseCaseFactory).toHaveBeenCalled();
      expect(getFavoritesMediaUseCase.execute).toHaveBeenCalledWith({
        userId,
        page,
        limit,
      });
      expect(result).toEqual(mockOutput);
    });

    it('should get favorites media for a user without pagination params', async () => {
      const userId = 'user-123';
      const mockOutput: GetFavoritesMediaUseCase.Output = {
        items: [],
        total: 0,
        page: 1,
        limit: 10,
      };

      (getFavoritesMediaUseCase.execute as jest.Mock).mockResolvedValue(mockOutput);

      const result = await controller.getFavorites(userId);

      expect(getFavoritesMediaUseCase.execute).toHaveBeenCalledWith({
        userId,
        page: undefined,
        limit: undefined,
      });
      expect(result).toEqual(mockOutput);
    });

    it('should handle errors when getting favorites', async () => {
      const userId = 'user-123';
      const error = new Error('Failed to get favorites');

      (getFavoritesMediaUseCase.execute as jest.Mock).mockRejectedValue(error);

      await expect(controller.getFavorites(userId)).rejects.toThrow(error);
      expect(getFavoritesMediaUseCase.execute).toHaveBeenCalled();
    });
  });

  describe('removeFavorite', () => {
    it('should remove a favorite media for a user', async () => {
      const userId = 'user-123';
      const mediaId = 'media-456';

      (removeFavoriteMediaUseCase.execute as jest.Mock).mockResolvedValue(undefined);

      await controller.removeFavorite(userId, mediaId);

      expect(removeFavoriteMediaFactory.removeFavoriteMediaUseCaseFactory).toHaveBeenCalled();
      expect(removeFavoriteMediaUseCase.execute).toHaveBeenCalledWith({
        userId,
        mediaId,
      });
    });

    it('should handle errors when removing a favorite', async () => {
      const userId = 'user-123';
      const mediaId = 'media-456';
      const error = new Error('Failed to remove favorite');

      (removeFavoriteMediaUseCase.execute as jest.Mock).mockRejectedValue(error);

      await expect(controller.removeFavorite(userId, mediaId)).rejects.toThrow(error);
      expect(removeFavoriteMediaUseCase.execute).toHaveBeenCalledWith({
        userId,
        mediaId,
      });
    });
  });
});
