import { Module } from '@nestjs/common';
import { MediaController } from '../controllers/media/media.controller';
import { PrismaModule } from 'src/shared/infra/prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [MediaController],
})
export class MediaModule {}
