import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway, PrismaService],
})
export class ChatModule {}
