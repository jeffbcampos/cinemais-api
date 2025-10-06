import { Injectable } from '@nestjs/common';
import { STATUS_CODES } from 'http';

@Injectable()
export class AppService {
  healthCheck(): { status: number; message: string } {
    return {
      status: 200,
      message: 'OK',
    }
  }
}
