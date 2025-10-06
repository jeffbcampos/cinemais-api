import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/infra/main/users.module';
import { PrismaModule } from './shared/infra/prisma/prisma.module';
import { UsersController } from './modules/users/infra/controllers/users.controller';

@Module({
  imports: [UsersModule, PrismaModule],
  controllers: [AppController, UsersController],
  providers: [AppService],
})
export class AppModule {}
