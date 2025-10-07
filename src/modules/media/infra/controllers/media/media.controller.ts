import { Body, Controller, Get, HttpCode, Param, Post, Query } from '@nestjs/common';
import { ApiBody, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateMediaDto } from 'src/modules/media/application/dto/create-media.dto';
import { FindAllMediasDto, FindAllMediasResponseDto } from 'src/modules/media/application/dto/find-all-medias.dto';
import { FindMediaByIdDto } from 'src/modules/media/application/dto/find-media-by-id.dto';
import { createMediaUseCaseFactory } from 'src/modules/media/application/factories/create-media.usecase.factory';
import { findAllMediasUseCaseFactory } from 'src/modules/media/application/factories/find-all-medias.usecase.factory';
import { findMediaByIdUsecaseFactory } from 'src/modules/media/application/factories/find-media-by-id.usecase.factory';
import { Media } from 'src/modules/media/domain/entities/media.entity';

@ApiTags('Media')
@Controller('media')
export class MediaController {

    @HttpCode(201)
    @Post('')
    @ApiResponse({
        status: 201,
        type: Media,
    })
    createMedia(@Body() body: CreateMediaDto)  {
        const usecase = createMediaUseCaseFactory();
        return usecase.execute(body);
    }

    @HttpCode(200)
    @Get('')
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiResponse({
        status: 200,
        type: FindAllMediasResponseDto,
    })
    findAllMedia(
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ) {
        const usecase = findAllMediasUseCaseFactory();
        return usecase.execute({ page, limit });
    }

    @HttpCode(200)
    @Get(':id')
    @ApiParam({ name: 'id', required: true, type: String })
    @ApiResponse({
        status: 200,
        type: Media,
    })
    findMediaById(@Param() id: FindMediaByIdDto) {
        const usecase = findMediaByIdUsecaseFactory();
        return usecase.execute(id);
    }
}
