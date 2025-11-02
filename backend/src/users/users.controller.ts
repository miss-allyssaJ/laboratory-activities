import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('register')
  async register(@Body() body: { username: string; password: string }) {
    const user = await this.usersService.createUser(body.username, body.password);
    return { message: 'User created successfully', user };
  }
}
