import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';

@Module({
  controllers: [MessageController],
  providers: [MessageService, PrismaService],
})
export class MessageModule {}
