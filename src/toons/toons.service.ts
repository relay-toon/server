import { Injectable } from '@nestjs/common';
import { ToonsRepository } from './toons.repository';

@Injectable()
export class ToonsService {
  constructor(private readonly toonsRepository: ToonsRepository) {}

  async createToon(
    userId: string,
    data: { title: string; headCount: number; timer?: number },
  ) {
    return this.toonsRepository.createToon(userId, {
      ...data,
    });
  }

  async getToon(toonId: string) {
    return this.toonsRepository.getToonWithParticipants(toonId);
  }

  async lockToon(toonId: string) {
    const toon = await this.toonsRepository.lockToon(toonId);

    setTimeout(
      async () => {
        const currentToon = await this.toonsRepository.getToon(toonId);
        if (currentToon!.lockId === toon.lockId) {
          await this.toonsRepository.unlockToon(toonId);
        }
      },
      toon.timer ? 1000 * 60 * 5 : 1000 * 60 * 30,
    );

    return toon.lockId;
  }
}
