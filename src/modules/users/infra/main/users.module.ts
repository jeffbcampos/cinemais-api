import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/infra/prisma/prisma.module';
import { UsersController } from '../controllers/users.controller';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
})
export class UsersModule {}
