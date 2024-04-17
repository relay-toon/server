import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { ProviderInfo } from 'src/users/types';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async login(info: ProviderInfo) {
    const user = await this.validateUser(info);
    const accessToken = this.generateAccessToken(user.id);
    const refreshToken = await this.generateRefreshToken(user);
    return { accessToken, refreshToken };
  }

  async validateUser(info: ProviderInfo) {
    const user = await this.usersService.getUserByProvider(info);
    if (!user) {
      return this.usersService.create(info);
    }
    return user;
  }
}
