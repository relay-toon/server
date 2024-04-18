import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ToonsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createToon(userId: string, data: Prisma.ToonCreateWithoutOwnerInput) {
    return this.prisma.toon.create({
      data: {
        ...data,
        owner: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async getToon(toonId: string) {
    return this.prisma.toon.findUnique({
      where: {
        id: toonId,
      },
      include: {
        participants: {
          select: {
            name: true,
          },
        },
      },
    });
  }
}
