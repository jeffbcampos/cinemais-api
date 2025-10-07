import { ApiProperty } from '@nestjs/swagger';
import { MediaType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateMediaDto {
  @ApiProperty({ example: 'Inception' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'A mind-bending thriller' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ enum: MediaType, example: 'movie' })
  @IsEnum(MediaType, { message: 'Tipo deve ser movie ou series' })
  type: MediaType;

  @ApiProperty({ example: 'Sci-Fi' })
  @IsString()
  @IsNotEmpty()
  genre: string;

  @ApiProperty({ example: 2010 })
  @IsNumber({}, { message: 'Ano de lançamento deve ser um número' })
  @Min(1900, { message: 'Ano de lançamento deve ser maior ou igual a 1900' })
  releaseYear: number;
}