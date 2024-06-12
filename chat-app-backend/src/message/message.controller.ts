import { Controller, Post, Body, Get } from '@nestjs/common';
import { MessageService } from './message.service';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  async createMessage(
    @Body('senderId') senderId: number,
    @Body('receiverId') receiverId: number,
    @Body('content') content: string,
  ) {
    return this.messageService.createMessage(senderId, receiverId, content);
  }

  @Get()
  async getMessages() {
    return this.messageService.getMessages();
  }
}
