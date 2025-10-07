import { ApiProperty } from "@nestjs/swagger";
import { Media } from "src/modules/media/domain/entities/media.entity";

export interface GetFavoritesMediaDto {
  userId: string;
  page?: number;
  limit?: number;
}

export class GetFavoritesMediaResponseDto {
    @ApiProperty({
      example: [
        {
          id: 'uuid-v4-example',
          title: 'Inception',
          description: 'A mind-bending thriller by Christopher Nolan.',
          type: 'movie',
          releaseYear: new Date('2010-07-16'),
          genre: 'Science Fiction',
          createdAt: new Date('2023-01-01T00:00:00Z'),
          updatedAt: new Date('2023-01-01T00:00:00Z'),
          deletedAt: null,
        },
      ],
    })
    items: Media[];

    @ApiProperty()
    total: number;

    @ApiProperty()
    page: number;

    @ApiProperty()
    limit: number;
}