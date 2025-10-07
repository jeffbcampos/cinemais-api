import { ApiProperty } from "@nestjs/swagger";
import { Media } from "src/modules/media/domain/entities/media.entity";

export interface GetFavoritesMediaDto {
  userId: string;
  page?: number;
  limit?: number;
}

export class GetFavoritesMediaResponseDto {
  @ApiProperty({
    type: 'object',
    properties: {
      items: {
        type: 'array',
        items: { 
          example: {
            id: 'uuid',
            title: 'Inception',
            description: 'A mind-bending thriller about dreams within dreams.',
            releaseYear: '2010-07-16T00:00:00.000Z',
            genre: 'Sci-Fi',
            createdAt: '2023-10-01T12:00:00.000Z',
            updatedAt: '2023-10-01T12:00:00.000Z',
            deletedAt: null,
          } 
        },
      },
      total: { type: 'number', example: 50 },
      page: { type: 'number', example: 1 },
      limit: { type: 'number', example: 10 },
    },
  })
    items: Media[];
    total: number;
    page: number;
    limit: number;
}