import { Injectable } from '@nestjs/common';
import { ToonsRepository } from './toons.repository';
import type { DrawToonDto } from './dto/request';
import { AwsService } from 'src/aws/aws.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ToonsService {
  constructor(
    private readonly toonsRepository: ToonsRepository,
    private readonly awsService: AwsService,
    private readonly configService: ConfigService,
  ) {}

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

    return toon;
  }

  async drawToon(
    toonId: string,
    drawToonDto: DrawToonDto,
    image: Express.Multer.File,
  ) {
    const key = `toons/${toonId}.png`;
    this.awsService.uploadImage(key, image);
    const imageUrl = `${this.configService.get('AWS_S3_URL')}/toons/${toonId}.png`;
    return this.toonsRepository.drawToon(toonId, drawToonDto, imageUrl);
  }

  async getOwnedToons(userId: string, completed: boolean, page: number) {
    if (page === 1) {
      return this.toonsRepository.getOwnedToonsWithCount(userId, completed);
    } else {
      return this.toonsRepository.getOwnedToons(userId, completed, page);
    }
  }

  async getParticipatedToons(userId: string, completed: boolean, page: number) {
    if (page === 1) {
      return this.toonsRepository.getParticipatedToonsWithCount(
        userId,
        completed,
      );
    } else {
      return this.toonsRepository.getParticipatedToons(userId, completed, page);
    }
  }
}
