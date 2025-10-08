import { Module } from '@nestjs/common';
import { MediaController } from '../controllers/media.controller';
import { PrismaModule } from 'src/shared/infra/prisma/prisma.module';
import { MediaPrismaRepository } from '../repositories/prisma/media-prisma.repository';
import { PrismaService } from 'src/shared/infra/prisma/prisma.service';

@Module({
    imports: [PrismaModule],
    controllers: [MediaController],
    providers: [
        {
            provide: 'MediaPrismaRepository',
            useFactory: (prismaService: PrismaService) => {
                return new MediaPrismaRepository(prismaService);
            },
            inject: [PrismaService],
        }
    ],
})
export class MediaModule {}
