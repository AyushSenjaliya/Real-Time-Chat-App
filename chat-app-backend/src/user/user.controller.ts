import { Controller, Post, Body, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() body: any) {
    const { name } = body;
    return this.userService.register(name);
  }

  @Get()
  async findAll() {
    return this.userService.findAll();
  }
}
