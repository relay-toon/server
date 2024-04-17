import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { ProviderInfo } from 'src/users/types';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(info: ProviderInfo) {
    const user = await this.validateUser(info);
    const accessToken = this.generateAccessToken(user.id);
    const refreshToken = await this.generateRefreshToken(user.id);
    return { accessToken, refreshToken };
  }

  async validateUser(info: ProviderInfo) {
    const user = await this.usersService.getUserByProvider(info);
    if (!user) {
      return this.usersService.createUser(info);
    }
    return user;
  }

  generateAccessToken(userId: string): string {
    const payload = {
      userId,
    };
    return this.jwtService.sign(payload);
  }

  async generateRefreshToken(userId: string): Promise<string> {
    const payload = {
      userId,
    };

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRE'),
    });

    await this.usersService.setRefreshToken(userId, refreshToken);

    return refreshToken;
  }

  async refresh(refreshToken: string) {
    try {
      // 1차 검증
      const decodedRefreshToken = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });
      const userId = decodedRefreshToken.userId;

      // 데이터베이스에서 User 객체 가져오기
      const savedToken = await this.usersService.getRefreshToken(userId);

      if (!savedToken) {
        throw new Error('Refresh token not found');
      }

      // 2차 검증
      if (savedToken !== refreshToken) {
        throw new Error('Refresh token not matching');
      }

      // 새로운 accessToken 생성
      const accessToken = this.generateAccessToken(userId);

      return accessToken;
    } catch (err) {
      throw new Error('Unauthorized');
    }
  }
}
