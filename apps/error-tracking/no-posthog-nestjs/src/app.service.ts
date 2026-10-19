import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export type HealthStatus = {
  status: 'ok';
  environment: string;
  uptime: number;
};

@Injectable()
export class AppService {
  constructor(private readonly config: ConfigService) {}

  getHello(): string {
    return 'Hello World!';
  }

  getHealth(): HealthStatus {
    return {
      status: 'ok',
      environment: this.config.get<string>('NODE_ENV', 'development'),
      uptime: Math.round(process.uptime()),
    };
  }
}
