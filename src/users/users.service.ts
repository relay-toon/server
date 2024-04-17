import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { ProviderInfo } from './types';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getUserByProvider(info: ProviderInfo) {
    return this.usersRepository.getUserByProvider(info);
  }

  async createUser(info: ProviderInfo) {
    return this.usersRepository.createUser({ ...info });
  }

  async setRefreshToken(userId: string, refreshToken: string) {
    return this.usersRepository.setRefreshToken(userId, refreshToken);
  }

  async getRefreshToken(userId: string) {
    return this.usersRepository.getRefreshToken(userId);
  }
}
