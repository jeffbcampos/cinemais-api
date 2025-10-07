import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateMediaDto } from 'src/modules/media/application/dto/create-media.dto';
import { createMediaUseCaseFactory } from 'src/modules/media/application/factories/create-media.usecase.factory';

@ApiTags('Media')
@Controller('media')
export class MediaController {

    @HttpCode(201)
    @Post('')
    createMedia(@Body() body: CreateMediaDto)  {
        const usecase = createMediaUseCaseFactory();
        return usecase.execute(body);
    }
}
