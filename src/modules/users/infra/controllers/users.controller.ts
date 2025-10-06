import { Body, Controller, Delete, Get, HttpCode, Param, Post, Query } from '@nestjs/common';
import { CreateFavoriteMediaDto } from '../../application/dto/create-favorite-media.dto';
import { createFavoriteMediaUseCaseFactory } from '../../application/factories/create-favorite-media.usecase.factory';
import { getFavoritesMediaUseCaseFactory } from '../../application/factories/get-favorites-media.usecase.factory';
import { media } from '@prisma/client';
import { GetFavoritesMediaDto } from '../../application/dto/get-favorites-media.dto';
import { GetFavoritesMediaUseCase } from '../../application/usecases/get-favorites-media.usecase';
import { removeFavoriteMediaUseCaseFactory } from '../../application/factories/remove-favorite-media.usecase.factory';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
          mediaId: { type: 'string', example: 'uuid-of-the-media' },
        },
      required: ['mediaId'],
    }
  })
  @HttpCode(204)
  @Post('/:userId/favorites')
  createFavorite(
    @Param('userId') userId: string,
    @Body() body: CreateFavoriteMediaDto,
  ): Promise<void> {
    const usecase = createFavoriteMediaUseCaseFactory();
    return usecase.execute({ ...body, userId });
  }

  @HttpCode(200)
  @Get('/:userId/favorites')
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getFavorites(
    @Param('userId') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<GetFavoritesMediaUseCase.Output> {
    const usecase = getFavoritesMediaUseCaseFactory();
    return usecase.execute({ userId, page, limit });
  }

  
  @HttpCode(204)
  @Delete('/:userId/favorites/:mediaId')
  removeFavorite(
    @Param('userId') userId: string,
    @Param('mediaId') mediaId: string,
  ): Promise<void> {
    const usecase = removeFavoriteMediaUseCaseFactory();
    return usecase.execute({ userId, mediaId });
  }
}
