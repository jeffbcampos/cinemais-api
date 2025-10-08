import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/infra/prisma/prisma.module';
import { UsersController } from '../controllers/users.controller';
import { PrismaService } from 'src/shared/infra/prisma/prisma.service';
import { UserPrismaRepository } from '../repositories/prisma/user-prisma.repository';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [
    {
      provide: 'UserPrismaRepository',
      useFactory: (prismaService: PrismaService) => {
        return new UserPrismaRepository(prismaService);
      },
      inject: [PrismaService],
    }
  ],
  exports: ['UserPrismaRepository'],
})
export class UsersModule {}
