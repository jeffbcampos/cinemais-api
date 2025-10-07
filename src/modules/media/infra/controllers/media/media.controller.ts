import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateMediaDto } from 'src/modules/media/application/dto/create-media.dto';
import { FindAllMediasDto } from 'src/modules/media/application/dto/find-all-medias.dto';
import { createMediaUseCaseFactory } from 'src/modules/media/application/factories/create-media.usecase.factory';
import { findAllMediasUseCaseFactory } from 'src/modules/media/application/factories/find-all-medias.usecase.factory';

@ApiTags('Media')
@Controller('media')
export class MediaController {

    @HttpCode(201)
    @Post('')
    createMedia(@Body() body: CreateMediaDto)  {
        const usecase = createMediaUseCaseFactory();
        return usecase.execute(body);
    }

    @HttpCode(200)
    @Get('')
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    findAllMedia(
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ) {
        const usecase = findAllMediasUseCaseFactory();
        return usecase.execute({ page, limit });
    }
}
