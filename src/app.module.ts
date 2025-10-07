import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/infra/main/users.module';
import { PrismaModule } from './shared/infra/prisma/prisma.module';
import { UsersController } from './modules/users/infra/controllers/users.controller';
import { MediaModule } from './modules/media/infra/main/media.module';
import { MediaController } from './modules/media/infra/controllers/media/media.controller';

@Module({
  imports: [UsersModule, PrismaModule, MediaModule],
  controllers: [AppController, UsersController, MediaController],
  providers: [AppService],
})
export class AppModule {}
