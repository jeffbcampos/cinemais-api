import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MediaType } from '@prisma/client';
import { PrismaService } from 'src/shared/infra/prisma/prisma.service';
import { UserRepository } from './user-prisma.repository';

describe('UserRepository', () => {
  let repository: UserRepository;
  let prismaService: PrismaService;

  const mockUser = {
    id: 'user-123',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'hashed_password',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const mockMedia = {
    id: 'media-456',
    title: 'Inception',
    description: 'A mind-bending thriller',
    type: MediaType.movie,
    genre: 'Sci-Fi',
    releaseYear: 2010,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const mockFavorite = {
    id: 'favorite-789',
    userId: 'user-123',
    mediaId: 'media-456',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const mockPrismaService = {
    users: {
      findUnique: jest.fn(),
    },
    media: {
      findUnique: jest.fn(),
    },
    favorite: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = module.get<UserRepository>(UserRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('createFavoriteMedia', () => {
    it('deve criar um favorito com sucesso', async () => {
      const input = {
        userId: 'user-123',
        mediaId: 'media-456',
      };

      mockPrismaService.users.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.media.findUnique.mockResolvedValue(mockMedia);
      mockPrismaService.favorite.findFirst.mockResolvedValue(null);
      mockPrismaService.favorite.create.mockResolvedValue(mockFavorite);

      await repository.createFavoriteMedia(input);

      expect(mockPrismaService.users.findUnique).toHaveBeenCalledWith({
        where: { id: input.userId },
      });
      expect(mockPrismaService.media.findUnique).toHaveBeenCalledWith({
        where: { id: input.mediaId },
      });
      expect(mockPrismaService.favorite.findFirst).toHaveBeenCalledWith({
        where: {
          userId: input.userId,
          mediaId: input.mediaId,
        },
      });
      expect(mockPrismaService.favorite.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: input.userId,
          mediaId: input.mediaId,
          id: expect.any(String),
        }),
      });
    });

    it('deve lançar NotFoundException quando o usuário não existe', async () => {
      const input = {
        userId: 'non-existent-user',
        mediaId: 'media-456',
      };

      mockPrismaService.users.findUnique.mockResolvedValue(null);

      await expect(repository.createFavoriteMedia(input)).rejects.toThrow(
        NotFoundException,
      );
      await expect(repository.createFavoriteMedia(input)).rejects.toThrow(
        'User not found',
      );
      expect(mockPrismaService.users.findUnique).toHaveBeenCalledWith({
        where: { id: input.userId },
      });
      expect(mockPrismaService.media.findUnique).not.toHaveBeenCalled();
    });

    it('deve lançar NotFoundException quando a mídia não existe', async () => {
      const input = {
        userId: 'user-123',
        mediaId: 'non-existent-media',
      };

      mockPrismaService.users.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.media.findUnique.mockResolvedValue(null);

      await expect(repository.createFavoriteMedia(input)).rejects.toThrow(
        NotFoundException,
      );
      await expect(repository.createFavoriteMedia(input)).rejects.toThrow(
        'Media not found',
      );
      expect(mockPrismaService.users.findUnique).toHaveBeenCalledWith({
        where: { id: input.userId },
      });
      expect(mockPrismaService.media.findUnique).toHaveBeenCalledWith({
        where: { id: input.mediaId },
      });
      expect(mockPrismaService.favorite.findFirst).not.toHaveBeenCalled();
    });

    it('deve lançar ConflictException quando o favorito já existe', async () => {
      const input = {
        userId: 'user-123',
        mediaId: 'media-456',
      };

      mockPrismaService.users.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.media.findUnique.mockResolvedValue(mockMedia);
      mockPrismaService.favorite.findFirst.mockResolvedValue(mockFavorite);

      await expect(repository.createFavoriteMedia(input)).rejects.toThrow(
        ConflictException,
      );
      await expect(repository.createFavoriteMedia(input)).rejects.toThrow(
        'Media already favorited by this user',
      );
      expect(mockPrismaService.users.findUnique).toHaveBeenCalledWith({
        where: { id: input.userId },
      });
      expect(mockPrismaService.media.findUnique).toHaveBeenCalledWith({
        where: { id: input.mediaId },
      });
      expect(mockPrismaService.favorite.findFirst).toHaveBeenCalledWith({
        where: {
          userId: input.userId,
          mediaId: input.mediaId,
        },
      });
      expect(mockPrismaService.favorite.create).not.toHaveBeenCalled();
    });
  });

  describe('getUserFavorites', () => {
    it('deve retornar os favoritos do usuário com paginação', async () => {
      const input = {
        userId: 'user-123',
        page: 1,
        limit: 10,
      };

      const mockFavoritesWithMedia = [
        {
          ...mockFavorite,
          media: mockMedia,
        },
      ];

      mockPrismaService.users.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.favorite.findMany.mockResolvedValue(
        mockFavoritesWithMedia,
      );
      mockPrismaService.favorite.count.mockResolvedValue(1);

      const result = await repository.getUserFavorites(input);

      expect(result).toEqual({
        items: [mockMedia],
        page: 1,
        limit: 10,
        total: 1,
      });
      expect(mockPrismaService.users.findUnique).toHaveBeenCalledWith({
        where: { id: input.userId },
      });
      expect(mockPrismaService.favorite.findMany).toHaveBeenCalledWith({
        where: { userId: input.userId },
        include: { media: true },
        skip: 0,
        take: 10,
      });
      expect(mockPrismaService.favorite.count).toHaveBeenCalledWith({
        where: { userId: input.userId },
      });
    });

    it('deve retornar os favoritos com valores padrão de paginação quando não fornecidos', async () => {
      const input = {
        userId: 'user-123',
      };

      const mockFavoritesWithMedia = [
        {
          ...mockFavorite,
          media: mockMedia,
        },
      ];

      mockPrismaService.users.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.favorite.findMany.mockResolvedValue(
        mockFavoritesWithMedia,
      );
      mockPrismaService.favorite.count.mockResolvedValue(1);

      const result = await repository.getUserFavorites(input);

      expect(result).toEqual({
        items: [mockMedia],
        page: 1,
        limit: 10,
        total: 1,
      });
      expect(mockPrismaService.favorite.findMany).toHaveBeenCalledWith({
        where: { userId: input.userId },
        include: { media: true },
        skip: 0,
        take: 10,
      });
    });

    it('deve calcular corretamente o skip para paginação', async () => {
      const input = {
        userId: 'user-123',
        page: 3,
        limit: 5,
      };

      mockPrismaService.users.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.favorite.findMany.mockResolvedValue([]);
      mockPrismaService.favorite.count.mockResolvedValue(0);

      await repository.getUserFavorites(input);

      expect(mockPrismaService.favorite.findMany).toHaveBeenCalledWith({
        where: { userId: input.userId },
        include: { media: true },
        skip: 10, // (3 - 1) * 5 = 10
        take: 5,
      });
    });

    it('deve retornar lista vazia quando usuário não tem favoritos', async () => {
      const input = {
        userId: 'user-123',
        page: 1,
        limit: 10,
      };

      mockPrismaService.users.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.favorite.findMany.mockResolvedValue([]);
      mockPrismaService.favorite.count.mockResolvedValue(0);

      const result = await repository.getUserFavorites(input);

      expect(result).toEqual({
        items: [],
        page: 1,
        limit: 10,
        total: 0,
      });
    });

    it('deve lançar NotFoundException quando o usuário não existe', async () => {
      const input = {
        userId: 'non-existent-user',
        page: 1,
        limit: 10,
      };

      mockPrismaService.users.findUnique.mockResolvedValue(null);

      await expect(repository.getUserFavorites(input)).rejects.toThrow(
        NotFoundException,
      );
      await expect(repository.getUserFavorites(input)).rejects.toThrow(
        'User not found',
      );
      expect(mockPrismaService.users.findUnique).toHaveBeenCalledWith({
        where: { id: input.userId },
      });
      expect(mockPrismaService.favorite.findMany).not.toHaveBeenCalled();
    });

    it('deve retornar múltiplos favoritos corretamente', async () => {
      const input = {
        userId: 'user-123',
        page: 1,
        limit: 10,
      };

      const mockMedia2 = {
        ...mockMedia,
        id: 'media-789',
        title: 'The Matrix',
      };

      const mockFavoritesWithMedia = [
        { ...mockFavorite, media: mockMedia },
        {
          ...mockFavorite,
          id: 'favorite-999',
          mediaId: 'media-789',
          media: mockMedia2,
        },
      ];

      mockPrismaService.users.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.favorite.findMany.mockResolvedValue(
        mockFavoritesWithMedia,
      );
      mockPrismaService.favorite.count.mockResolvedValue(2);

      const result = await repository.getUserFavorites(input);

      expect(result).toEqual({
        items: [mockMedia, mockMedia2],
        page: 1,
        limit: 10,
        total: 2,
      });
    });
  });

  describe('removeFavoriteMedia', () => {
    it('deve remover um favorito com sucesso', async () => {
      const input = {
        userId: 'user-123',
        mediaId: 'media-456',
      };

      mockPrismaService.users.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.media.findUnique.mockResolvedValue(mockMedia);
      mockPrismaService.favorite.findFirst.mockResolvedValue(mockFavorite);
      mockPrismaService.favorite.delete.mockResolvedValue(mockFavorite);

      await repository.removeFavoriteMedia(input);

      expect(mockPrismaService.users.findUnique).toHaveBeenCalledWith({
        where: { id: input.userId },
      });
      expect(mockPrismaService.media.findUnique).toHaveBeenCalledWith({
        where: { id: input.mediaId },
      });
      expect(mockPrismaService.favorite.findFirst).toHaveBeenCalledWith({
        where: {
          userId: input.userId,
          mediaId: input.mediaId,
        },
      });
      expect(mockPrismaService.favorite.delete).toHaveBeenCalledWith({
        where: { id: mockFavorite.id },
      });
    });

    it('deve lançar NotFoundException quando o usuário não existe', async () => {
      const input = {
        userId: 'non-existent-user',
        mediaId: 'media-456',
      };

      mockPrismaService.users.findUnique.mockResolvedValue(null);

      await expect(repository.removeFavoriteMedia(input)).rejects.toThrow(
        NotFoundException,
      );
      await expect(repository.removeFavoriteMedia(input)).rejects.toThrow(
        'User not found',
      );
      expect(mockPrismaService.users.findUnique).toHaveBeenCalledWith({
        where: { id: input.userId },
      });
      expect(mockPrismaService.media.findUnique).not.toHaveBeenCalled();
    });

    it('deve lançar NotFoundException quando a mídia não existe', async () => {
      const input = {
        userId: 'user-123',
        mediaId: 'non-existent-media',
      };

      mockPrismaService.users.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.media.findUnique.mockResolvedValue(null);

      await expect(repository.removeFavoriteMedia(input)).rejects.toThrow(
        NotFoundException,
      );
      await expect(repository.removeFavoriteMedia(input)).rejects.toThrow(
        'Media not found',
      );
      expect(mockPrismaService.users.findUnique).toHaveBeenCalledWith({
        where: { id: input.userId },
      });
      expect(mockPrismaService.media.findUnique).toHaveBeenCalledWith({
        where: { id: input.mediaId },
      });
      expect(mockPrismaService.favorite.findFirst).not.toHaveBeenCalled();
    });

    it('deve lançar NotFoundException quando o favorito não existe', async () => {
      const input = {
        userId: 'user-123',
        mediaId: 'media-456',
      };

      mockPrismaService.users.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.media.findUnique.mockResolvedValue(mockMedia);
      mockPrismaService.favorite.findFirst.mockResolvedValue(null);

      await expect(repository.removeFavoriteMedia(input)).rejects.toThrow(
        NotFoundException,
      );
      await expect(repository.removeFavoriteMedia(input)).rejects.toThrow(
        'Favorite not found for this user and media',
      );
      expect(mockPrismaService.users.findUnique).toHaveBeenCalledWith({
        where: { id: input.userId },
      });
      expect(mockPrismaService.media.findUnique).toHaveBeenCalledWith({
        where: { id: input.mediaId },
      });
      expect(mockPrismaService.favorite.findFirst).toHaveBeenCalledWith({
        where: {
          userId: input.userId,
          mediaId: input.mediaId,
        },
      });
      expect(mockPrismaService.favorite.delete).not.toHaveBeenCalled();
    });
  });

  describe('createInstance', () => {
    it('deve criar uma instância singleton do repositório', () => {
      const instance1 = UserRepository.createInstance();
      const instance2 = UserRepository.createInstance();

      expect(instance1).toBe(instance2);
      expect(instance1).toBeInstanceOf(UserRepository);
    });
  });
});
