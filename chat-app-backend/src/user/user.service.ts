import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  async findAll() {
    return this.prisma.user.findMany();
  }
  constructor(private readonly prisma: PrismaService) {}

  async register(name: string) {
    return this.prisma.user.create({
      data: {
        name: name,
      },
    });
  }
}
