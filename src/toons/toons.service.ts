import { Injectable } from '@nestjs/common';
import { ToonsRepository } from './toons.repository';

@Injectable()
export class ToonsService {
  constructor(private readonly toonsRepository: ToonsRepository) {}

  async createToon(
    userId: string,
    data: { title: string; headCount: number; timer?: number },
  ) {
    return this.toonsRepository.createToon(userId, data);
  }
}
