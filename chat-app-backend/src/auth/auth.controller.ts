import {
  Controller,
  //  Post, Body, NotFoundException
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  // @Post('login')
  // async login(@Body() body: { email: string; password: string }) {
  //   const { email, password } = body;
  //   const user = await this.userService.validateUser(email, password);

  //   if (!user) {
  //     throw new NotFoundException('Invalid email or password');
  //   }

  //   // Login successful, generate JWT token
  //   const token = await this.userService.login(user);
  //   return { access_token: token };
  // }
}
