import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() body: any) {
    const { username, password } = body;
    return this.authService.register(username, password);
  }

  @Post('login')
  login(@Body() body: any) {
    const { username, password } = body;
    return this.authService.login(username, password);
  }
}
