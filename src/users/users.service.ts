import fs from 'fs';
import yaml from 'yaml';
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
    const nameFile = fs.readFileSync('names.yaml', 'utf8');
    const nameData = yaml.parse(nameFile);
    const adjective =
      nameData.adjectives[
        Math.floor(Math.random() * nameData.adjectives.length)
      ];
    const animal =
      nameData.animals[Math.floor(Math.random() * nameData.animals.length)];

    const name = `${adjective} ${animal}`;
    return this.usersRepository.createUser({ ...info, name });
  }
}
