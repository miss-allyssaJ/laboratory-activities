import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello(); // still works at GET /
  }

  @Get('api/hello')
  getApiHello() {
    return { message: 'Hello from NestJS 🚀' }; // new endpoint at GET /api/hello
  }
}
