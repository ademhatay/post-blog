import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';
import { AppConfigService } from '../config';

@Module({
    imports: [
        UsersModule,
        JwtModule.register({}),
    ],
    providers: [AuthService, JwtAccessStrategy, AppConfigService],
    controllers: [AuthController],
})
export class AuthModule { }
