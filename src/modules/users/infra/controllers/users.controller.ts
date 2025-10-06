import { Body, Controller, HttpCode, Param, Post } from '@nestjs/common';
import { CreateFavoriteMediaDto } from '../../application/dto/create-favorite-media.dto';
import { createFavoriteMediaUseCaseFactory } from '../../application/factories/create-favorite-media.usecase.factory';

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
}
