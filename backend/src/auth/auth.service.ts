import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AppConfigService } from '../config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwt: JwtService,
    private config: AppConfigService,
  ) {}

  private signAccessToken(user: { id: number; email: string; role: 'USER' | 'ADMIN' }): string {
    return this.jwt.sign(
      { sub: user.id, email: user.email, role: user.role },
      { secret: this.config.jwt.accessSecret, expiresIn: this.config.jwt.accessExpire },
    );
  }

  private signRefreshToken(user: { id: number; email: string; role: 'USER' | 'ADMIN' }): string {
    return this.jwt.sign(
      { sub: user.id, email: user.email, role: user.role, typ: 'refresh' },
      { secret: this.config.jwt.refreshSecret, expiresIn: this.config.jwt.refreshExpire },
    );
  }

  async login(email: string, password: string) {
    const user = this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const accessToken = this.signAccessToken(user);
    const refreshToken = this.signRefreshToken(user);

    return {
      user: { id: user.id, name: user.name, username: user.username, email: user.email, role: user.role },
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = await this.jwt.verifyAsync<{ sub: number; email: string; role: 'USER' | 'ADMIN' }>(
        refreshToken,
        { secret: this.config.jwt.refreshSecret },
      );
      const user = this.usersService.findOne(payload.sub);
      if (!user) throw new UnauthorizedException('User not found');

      const newAccess = this.signAccessToken(user);
      const newRefresh = this.signRefreshToken(user);
      return { accessToken: newAccess, refreshToken: newRefresh };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
