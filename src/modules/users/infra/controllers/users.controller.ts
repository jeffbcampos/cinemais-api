import { Body, Controller, Get, HttpCode, Param, Post, Query } from '@nestjs/common';
import { CreateFavoriteMediaDto } from '../../application/dto/create-favorite-media.dto';
import { createFavoriteMediaUseCaseFactory } from '../../application/factories/create-favorite-media.usecase.factory';
import { getFavoritesMediaUseCaseFactory } from '../../application/factories/get-favorites-media.usecase.factory';
import { media } from '@prisma/client';
import { GetFavoritesMediaDto } from '../../application/dto/get-favorites-media.dto';
import { GetFavoritesMediaUseCase } from '../../application/usecases/get-favorites-media.usecase';

@Controller('users')
export class UsersController {
  @HttpCode(204)
  @Post('/:userId/favorites')
  createFavorite(
    @Param('userId') userId: string,
    @Body() body: CreateFavoriteMediaDto,
  ): Promise<void> {
    const usecase = createFavoriteMediaUseCaseFactory();
    return usecase.execute({ ...body, userId });
  }

  @Get('/:userId/favorites')
  getFavorites(
    @Param('userId') userId: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<GetFavoritesMediaUseCase.Output> {
    const usecase = getFavoritesMediaUseCaseFactory();
    return usecase.execute({ userId, page, limit });
  }
}
