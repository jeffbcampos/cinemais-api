import { ApiProperty } from "@nestjs/swagger";
import { Media } from "../../domain/entities/media.entity";

export class FindAllMediasDto {
  page?: number;
  limit?: number;
}

export class FindAllMediasResponseDto {
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
            releaseYear: 2010,
            genre: 'Sci-Fi',
            createdAt: '2023-10-01T12:00:00.000Z',
            updatedAt: '2023-10-01T12:00:00.000Z',
            deletedAt: null,
          }
        },
      },      
      page: { type: 'number', example: 1 },
      limit: { type: 'number', example: 10 },
      total: { type: 'number', example: 50 },
    },
    })
    items: Media[];
    total: number;
    page: number;
    limit: number;
}
