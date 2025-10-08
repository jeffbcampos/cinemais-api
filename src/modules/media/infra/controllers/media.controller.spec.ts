import { Test, TestingModule } from "@nestjs/testing";
import { createMediaUseCaseFactory } from "../../application/factories/create-media.usecase.factory";
import { findAllMediasUseCaseFactory } from "../../application/factories/find-all-medias.usecase.factory";
import { findMediaByIdUsecaseFactory } from "../../application/factories/find-media-by-id.usecase.factory";
import { Media } from "../../domain/entities/media.entity";
import { MediaController } from "./media.controller";
import { CreateMediaDto } from "../../application/dto/create-media.dto";
import { MediaType } from "@prisma/client";
import { FindMediaByIdDto } from "../../application/dto/find-media-by-id.dto";


jest.mock('../../application/factories/create-media.usecase.factory');
jest.mock('../../application/factories/find-all-medias.usecase.factory');
jest.mock('../../application/factories/find-media-by-id.usecase.factory');


describe('MediaController', () => {
  let controller: MediaController;

  const mockMedia: Media = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Line 230: O Bug',
    description: 'Ao codar seu teste técnico, um programador descobre um erro na linha 230, num arquivo de apenas 100 linhas e corre contra o tempo para entregar o teste',
    type: 'movie',
    genre: 'Sci-Fi',
    releaseYear: 2010,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    deletedAt: null,
  };

  const mockCreateMediaUseCase = {
    execute: jest.fn(),
  };

  const mockFindAllMediasUseCase = {
    execute: jest.fn(),
  };

  const mockFindMediaByIdUseCase = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    (createMediaUseCaseFactory as jest.Mock).mockReturnValue(mockCreateMediaUseCase);
    (findAllMediasUseCaseFactory as jest.Mock).mockReturnValue(mockFindAllMediasUseCase);
    (findMediaByIdUsecaseFactory as jest.Mock).mockReturnValue(mockFindMediaByIdUseCase);

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MediaController],
    }).compile();

    controller = module.get<MediaController>(MediaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createMedia', () => {
    it('deve criar uma nova mídia', async () => {
      const createMediaDto: CreateMediaDto = {
        title: 'Line 230: O Bug',
        description: 'Ao codar seu teste técnico, um programador descobre um erro na linha 230, num arquivo de apenas 100 linhas e corre contra o tempo para entregar o teste',
        type: MediaType.movie,
        genre: 'Sci-Fi',
        releaseYear: 2010,
      };

      mockCreateMediaUseCase.execute.mockResolvedValue(mockMedia);

      const result = await controller.createMedia(createMediaDto);

      expect(createMediaUseCaseFactory).toHaveBeenCalled();
      expect(mockCreateMediaUseCase.execute).toHaveBeenCalledWith(createMediaDto);
      expect(result).toEqual(mockMedia);
    });

    it('should handle errors when creating media', async () => {
      const createMediaDto: CreateMediaDto = {
        title: 'Inception',
        description: 'A mind-bending thriller',
        type: MediaType.movie,
        genre: 'Sci-Fi',
        releaseYear: 2010,
      };

      const error = new Error('Database error');
      mockCreateMediaUseCase.execute.mockRejectedValue(error);

      await expect(controller.createMedia(createMediaDto)).rejects.toThrow('Database error');
      expect(mockCreateMediaUseCase.execute).toHaveBeenCalledWith(createMediaDto);
    });
  });

  describe('findAllMedia', () => {
    it('should return all medias with pagination', async () => {
      const mockResponse = {
        items: [mockMedia],
        page: 1,
        limit: 10,
        total: 1,
      };

      mockFindAllMediasUseCase.execute.mockResolvedValue(mockResponse);

      const result = await controller.findAllMedia(1, 10);

      expect(findAllMediasUseCaseFactory).toHaveBeenCalled();
      expect(mockFindAllMediasUseCase.execute).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
      });
      expect(result).toEqual(mockResponse);
    });

    it('should return all medias with default pagination when parameters are not provided', async () => {
      const mockResponse = {
        data: [mockMedia],
        meta: {
          total: 1,
          page: undefined,
          limit: undefined,
          totalPages: 1,
        },
      };

      mockFindAllMediasUseCase.execute.mockResolvedValue(mockResponse);

      const result = await controller.findAllMedia();

      expect(findAllMediasUseCaseFactory).toHaveBeenCalled();
      expect(mockFindAllMediasUseCase.execute).toHaveBeenCalledWith({
        page: undefined,
        limit: undefined,
      });
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors when finding all medias', async () => {
      const error = new Error('Database error');
      mockFindAllMediasUseCase.execute.mockRejectedValue(error);

      await expect(controller.findAllMedia(1, 10)).rejects.toThrow('Database error');
      expect(mockFindAllMediasUseCase.execute).toHaveBeenCalled();
    });
  });

  describe('findMediaById', () => {
    it('should return a media by id', async () => {
      const findMediaByIdDto: FindMediaByIdDto = {
        id: '123e4567-e89b-12d3-a456-426614174000',
      };

      mockFindMediaByIdUseCase.execute.mockResolvedValue(mockMedia);

      const result = await controller.findMediaById(findMediaByIdDto);

      expect(findMediaByIdUsecaseFactory).toHaveBeenCalled();
      expect(mockFindMediaByIdUseCase.execute).toHaveBeenCalledWith(findMediaByIdDto);
      expect(result).toEqual(mockMedia);
    });

    it('should handle errors when media is not found', async () => {
      const findMediaByIdDto: FindMediaByIdDto = {
        id: 'non-existent-id',
      };

      const error = new Error('Media not found');
      mockFindMediaByIdUseCase.execute.mockRejectedValue(error);

      await expect(controller.findMediaById(findMediaByIdDto)).rejects.toThrow('Media not found');
      expect(mockFindMediaByIdUseCase.execute).toHaveBeenCalledWith(findMediaByIdDto);
    });

    it('should handle database errors when finding media by id', async () => {
      const findMediaByIdDto: FindMediaByIdDto = {
        id: '123e4567-e89b-12d3-a456-426614174000',
      };

      const error = new Error('Database connection failed');
      mockFindMediaByIdUseCase.execute.mockRejectedValue(error);

      await expect(controller.findMediaById(findMediaByIdDto)).rejects.toThrow('Database connection failed');
      expect(mockFindMediaByIdUseCase.execute).toHaveBeenCalledWith(findMediaByIdDto);
    });
  });
});
