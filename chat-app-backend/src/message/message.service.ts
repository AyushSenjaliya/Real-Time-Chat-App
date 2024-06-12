import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessageService {
  constructor(private readonly prisma: PrismaService) {}

  async createMessage(senderId: number, receiverId: number, content: string) {
    return this.prisma.message.create({
      data: {
        content: content,
        senderId: senderId,
        receiverId: receiverId,
      },
    });
  }

  async getMessages() {
    return this.prisma.message.findMany({
      include: {
        sender: true,
      },
    });
  }
}
