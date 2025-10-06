import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  healthCheck(): { status: number; message: string } {
    return {
      status: 200,
      message: 'OK',
    };
  }
}
