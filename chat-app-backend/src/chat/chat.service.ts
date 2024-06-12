import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async createMessage(senderId: number, receiverId: number, content: string) {
    return this.prisma.message.create({
      data: {
        content,
        receiver: { connect: { id: receiverId } },
        sender: { connect: { id: senderId } },
      },
      include: {
        sender: true,
      },
    });
  }

  async getMessages() {
    return this.prisma.message.findMany({
      include: {
        sender: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }
}
