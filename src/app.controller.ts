import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  async healthCheck(): Promise<{ status: number; message: string }> {
    return this.appService.healthCheck();
  }
}
