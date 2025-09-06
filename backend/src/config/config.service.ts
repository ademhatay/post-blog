import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get port(): number {
    return this.configService.get<number>('port');
  }

  get nodeEnv(): string {
    return this.configService.get<string>('nodeEnv');
  }

  get jwt() {
    return {
      accessSecret: this.configService.get<string>('jwt.accessSecret'),
      refreshSecret: this.configService.get<string>('jwt.refreshSecret'),
      accessExpire: this.configService.get<string>('jwt.accessExpire'),
      refreshExpire: this.configService.get<string>('jwt.refreshExpire'),
    };
  }

  get cors() {
    return this.configService.get('cors');
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }
}
