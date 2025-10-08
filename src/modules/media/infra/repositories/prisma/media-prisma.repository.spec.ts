import { NotFoundException } from '@nestjs/common';
import { MediaType } from '@prisma/client';
import { MediaPrismaRepository } from './media-prisma.repository';

describe('MediaPrismaRepository', () => {
  let repository: MediaPrismaRepository;
  let prismaService: any;

  const mockMedia = {
    id: 'media-123',
    title: 'Inception',
    description: 'A mind-bending thriller',
    type: MediaType.movie,
    genre: 'Sci-Fi',
    releaseYear: 2010,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    deletedAt: null,
  };

  const mockMedia2 = {
    id: 'media-456',
    title: 'Breaking Bad',
    description: 'A chemistry teacher turned meth dealer',
    type: MediaType.series,
    genre: 'Drama',
    releaseYear: 2008,
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
    deletedAt: null,
  };

  beforeEach(() => {
    prismaService = {
      media: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        count: jest.fn(),
      },
    } as any;

    repository = new MediaPrismaRepository(prismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('createMedia', () => {
    it('deve criar uma nova mídia com sucesso', async () => {
      const input = {
        title: 'Inception',
        description: 'A mind-bending thriller',
        type: MediaType.movie,
        genre: 'Sci-Fi',
        releaseYear: 2010,
      };

      prismaService.media.create.mockResolvedValue(mockMedia);

      const result = await repository.createMedia(input);

      expect(result).toEqual(mockMedia);
      expect(prismaService.media.create).toHaveBeenCalledWith({
        data: {
          id: expect.any(String),
          title: input.title,
          description: input.description,
          type: input.type,
          releaseYear: input.releaseYear,
          genre: input.genre,
        },
      });
      expect(prismaService.media.create).toHaveBeenCalledTimes(1);
    });

    it('deve criar uma mídia do tipo série', async () => {
      const input = {
        title: 'Breaking Bad',
        description: 'A chemistry teacher turned meth dealer',
        type: MediaType.series,
        genre: 'Drama',
        releaseYear: 2008,
      };

      prismaService.media.create.mockResolvedValue(mockMedia2);

      const result = await repository.createMedia(input);

      expect(result).toEqual(mockMedia2);
      expect(prismaService.media.create).toHaveBeenCalledWith({
        data: {
          id: expect.any(String),
          title: input.title,
          description: input.description,
          type: input.type,
          releaseYear: input.releaseYear,
          genre: input.genre,
        },
      });
    });

    it('deve gerar um UUID único para cada mídia criada', async () => {
      const input = {
        title: 'Test Movie',
        description: 'Test Description',
        type: MediaType.movie,
        genre: 'Action',
        releaseYear: 2024,
      };

      prismaService.media.create.mockResolvedValue(mockMedia);

      await repository.createMedia(input);

      const createCall = prismaService.media.create.mock.calls[0][0];
      expect(createCall.data.id).toBeDefined();
      expect(typeof createCall.data.id).toBe('string');
      expect(createCall.data.id.length).toBeGreaterThan(0);
    });

    it('deve propagar erro do Prisma ao falhar na criação', async () => {
      const input = {
        title: 'Inception',
        description: 'A mind-bending thriller',
        type: MediaType.movie,
        genre: 'Sci-Fi',
        releaseYear: 2010,
      };

      const error = new Error('Database connection failed');
      prismaService.media.create.mockRejectedValue(error);

      await expect(repository.createMedia(input)).rejects.toThrow(
        'Database connection failed',
      );
      expect(prismaService.media.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAllMedia', () => {
    it('deve retornar todas as mídias com paginação', async () => {
      const input = {
        page: 1,
        limit: 10,
      };

      const mockMedias = [mockMedia, mockMedia2];

      prismaService.media.findMany.mockResolvedValue(mockMedias);
      prismaService.media.count.mockResolvedValue(2);

      const result = await repository.findAllMedia(input);

      expect(result).toEqual({
        items: mockMedias,
        page: 1,
        limit: 10,
        total: 2,
      });
      expect(prismaService.media.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
      });
      expect(prismaService.media.count).toHaveBeenCalled();
    });

    it('deve usar valores padrão de paginação quando não fornecidos', async () => {
      const input = {};

      prismaService.media.findMany.mockResolvedValue([mockMedia]);
      prismaService.media.count.mockResolvedValue(1);

      const result = await repository.findAllMedia(input);

      expect(result).toEqual({
        items: [mockMedia],
        page: 1,
        limit: 10,
        total: 1,
      });
      expect(prismaService.media.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
      });
    });

    it('deve calcular corretamente o skip para diferentes páginas', async () => {
      const input = {
        page: 3,
        limit: 5,
      };

      prismaService.media.findMany.mockResolvedValue([]);
      prismaService.media.count.mockResolvedValue(0);

      await repository.findAllMedia(input);

      expect(prismaService.media.findMany).toHaveBeenCalledWith({
        skip: 10, // (3 - 1) * 5 = 10
        take: 5,
      });
    });

    it('deve calcular skip corretamente para página 2', async () => {
      const input = {
        page: 2,
        limit: 10,
      };

      prismaService.media.findMany.mockResolvedValue([]);
      prismaService.media.count.mockResolvedValue(0);

      await repository.findAllMedia(input);

      expect(prismaService.media.findMany).toHaveBeenCalledWith({
        skip: 10, // (2 - 1) * 10 = 10
        take: 10,
      });
    });

    it('deve retornar lista vazia quando não há mídias', async () => {
      const input = {
        page: 1,
        limit: 10,
      };

      prismaService.media.findMany.mockResolvedValue([]);
      prismaService.media.count.mockResolvedValue(0);

      const result = await repository.findAllMedia(input);

      expect(result).toEqual({
        items: [],
        page: 1,
        limit: 10,
        total: 0,
      });
    });

    it('deve converter page e limit para números quando forem strings', async () => {
      const input = {
        page: '2' as any,
        limit: '5' as any,
      };

      prismaService.media.findMany.mockResolvedValue([]);
      prismaService.media.count.mockResolvedValue(0);

      const result = await repository.findAllMedia(input);

      expect(result.page).toBe(2);
      expect(result.limit).toBe(5);
      expect(prismaService.media.findMany).toHaveBeenCalledWith({
        skip: 5, // (2 - 1) * 5 = 5
        take: 5,
      });
    });

    it('deve retornar múltiplas mídias corretamente', async () => {
      const input = {
        page: 1,
        limit: 10,
      };

      const mockMedia3 = {
        ...mockMedia,
        id: 'media-789',
        title: 'The Matrix',
      };

      const mockMedias = [mockMedia, mockMedia2, mockMedia3];

      prismaService.media.findMany.mockResolvedValue(mockMedias);
      prismaService.media.count.mockResolvedValue(3);

      const result = await repository.findAllMedia(input);

      expect(result).toEqual({
        items: mockMedias,
        page: 1,
        limit: 10,
        total: 3,
      });
      expect(result.items).toHaveLength(3);
    });

    it('deve propagar erro do Prisma ao falhar na busca', async () => {
      const input = {
        page: 1,
        limit: 10,
      };

      const error = new Error('Database connection failed');
      prismaService.media.findMany.mockRejectedValue(error);

      await expect(repository.findAllMedia(input)).rejects.toThrow(
        'Database connection failed',
      );
    });
  });

  describe('findMediaById', () => {
    it('deve retornar uma mídia quando encontrada', async () => {
      const input = {
        id: 'media-123',
      };

      prismaService.media.findUnique.mockResolvedValue(mockMedia);

      const result = await repository.findMediaById(input);

      expect(result).toEqual(mockMedia);
      expect(prismaService.media.findUnique).toHaveBeenCalledWith({
        where: { id: input.id },
      });
      expect(prismaService.media.findUnique).toHaveBeenCalledTimes(1);
    });

    it('deve lançar NotFoundException quando a mídia não é encontrada', async () => {
      const input = {
        id: 'non-existent-id',
      };

      prismaService.media.findUnique.mockResolvedValue(null);

      await expect(repository.findMediaById(input)).rejects.toThrow(
        NotFoundException,
      );
      await expect(repository.findMediaById(input)).rejects.toThrow(
        'Media not found',
      );
      expect(prismaService.media.findUnique).toHaveBeenCalledWith({
        where: { id: input.id },
      });
    });

    it('deve retornar uma série quando encontrada', async () => {
      const input = {
        id: 'media-456',
      };

      prismaService.media.findUnique.mockResolvedValue(mockMedia2);

      const result = await repository.findMediaById(input);

      expect(result).toEqual(mockMedia2);
      expect(result?.type).toBe(MediaType.series);
    });

    it('deve propagar erro do Prisma ao falhar na busca', async () => {
      const input = {
        id: 'media-123',
      };

      const error = new Error('Database connection failed');
      prismaService.media.findUnique.mockRejectedValue(error);

      await expect(repository.findMediaById(input)).rejects.toThrow(
        'Database connection failed',
      );
    });

    it('deve buscar mídia com ID diferente', async () => {
      const input = {
        id: 'another-media-id',
      };

      const anotherMedia = {
        ...mockMedia,
        id: 'another-media-id',
        title: 'Another Movie',
      };

      prismaService.media.findUnique.mockResolvedValue(anotherMedia);

      const result = await repository.findMediaById(input);

      expect(result).toEqual(anotherMedia);
      expect(prismaService.media.findUnique).toHaveBeenCalledWith({
        where: { id: 'another-media-id' },
      });
    });
  });

  describe('createInstance', () => {
    it('deve criar uma instância singleton do repositório', () => {
      const instance1 = MediaPrismaRepository.createInstance();
      const instance2 = MediaPrismaRepository.createInstance();

      expect(instance1).toBe(instance2);
      expect(instance1).toBeInstanceOf(MediaPrismaRepository);
    });

    it('deve retornar a mesma instância em múltiplas chamadas', () => {
      const instances = [
        MediaPrismaRepository.createInstance(),
        MediaPrismaRepository.createInstance(),
        MediaPrismaRepository.createInstance(),
      ];

      expect(instances[0]).toBe(instances[1]);
      expect(instances[1]).toBe(instances[2]);
      expect(instances[0]).toBe(instances[2]);
    });
  });
});
