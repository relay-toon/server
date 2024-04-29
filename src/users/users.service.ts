import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { ProviderInfo } from './types';
import { adjectives, animals } from './names';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getUserByProvider(info: ProviderInfo) {
    return this.usersRepository.getUserByProvider(info);
  }

  async createUser(info: ProviderInfo) {
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];

    const animal = animals[Math.floor(Math.random() * animals.length)];

    const name = `${adjective} ${animal}`;
    return this.usersRepository.createUser({ ...info, name });
  }

  async setRefreshToken(userId: string, refreshToken: string | null) {
    return this.usersRepository.setRefreshToken(userId, refreshToken);
  }

  async getRefreshToken(userId: string) {
    return this.usersRepository.getRefreshToken(userId);
  }

  async getUserById(userId: string) {
    return this.usersRepository.getUserById(userId);
  }

  async updateUserName(userId: string, name: string) {
    return this.usersRepository.updateUserName(userId, name);
  }

  async deleteUser(userId: string) {
    return this.usersRepository.deleteUser(userId);
  }
}
