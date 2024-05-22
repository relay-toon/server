import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import type { DrawToonDto } from './dto/request';

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

  async getToonWithParticipants(toonId: string) {
    return this.prisma.toon.findUnique({
      where: {
        id: toonId,
      },
      include: {
        participants: {
          select: {
            userId: true,
            name: true,
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
    });
  }

  async lockToon(toonId: string) {
    return this.prisma.$transaction(
      async (tx) => {
        const toon = await tx.toon.findUnique({
          where: {
            id: toonId,
          },
        });

        if (toon!.lockId) {
          throw new Error('Already locked');
        }

        if (toon!.completed) {
          throw new Error('Already completed');
        }

        return tx.toon.update({
          where: {
            id: toonId,
          },
          data: {
            lockId: uuidv4(),
          },
          include: {
            participants: {
              select: {
                name: true,
              },
            },
          },
        });
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      },
    );
  }

  async unlockToon(toonId: string) {
    return this.prisma.toon.update({
      where: {
        id: toonId,
      },
      data: {
        lockId: null,
      },
    });
  }

  async drawToon(toonId: string, drawToonDto: DrawToonDto, image: string) {
    const toon = await this.prisma.toon.update({
      where: {
        id: toonId,
      },
      data: {
        image,
        lockId: null,
        participants: {
          create: {
            name: drawToonDto.name,
            userId: drawToonDto.userId,
          },
        },
      },
      include: {
        participants: {
          select: {
            name: true,
          },
        },
      },
    });
    if (toon.headCount === toon.participants.length) {
      return this.prisma.toon.update({
        where: {
          id: toonId,
        },
        data: {
          completed: true,
        },
        include: {
          participants: {
            select: {
              name: true,
            },
          },
        },
      });
    } else {
      return toon;
    }
  }

  async getOwnedToonsWithCount(userId: string, completed: boolean) {
    const count = await this.prisma.toon.count({
      where: {
        ownerId: userId,
        completed,
      },
    });
    const toons = await this.prisma.toon.findMany({
      where: {
        ownerId: userId,
        completed,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
    });
    return {
      totalPage: Math.ceil(count / 5),
      toons,
    };
  }

  async getOwnedToons(userId: string, completed: boolean, page: number) {
    return {
      toons: await this.prisma.toon.findMany({
        where: {
          ownerId: userId,
          completed,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * 5,
        take: 5,
      }),
    };
  }

  async getParticipatedToonsWithCount(userId: string, completed: boolean) {
    const count = await this.prisma.toon.count({
      where: {
        participants: {
          some: {
            userId,
          },
        },
        completed,
        ownerId: {
          not: userId,
        },
      },
    });
    const toons = await this.prisma.toon.findMany({
      where: {
        participants: {
          some: {
            userId,
          },
        },
        completed,
        ownerId: {
          not: userId,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
    });
    return {
      totalPage: Math.ceil(count / 5),
      toons,
    };
  }

  async getParticipatedToons(userId: string, completed: boolean, page: number) {
    return {
      toons: await this.prisma.toon.findMany({
        where: {
          participants: {
            some: {
              userId,
            },
          },
          completed,
          ownerId: {
            not: userId,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * 5,
        take: 5,
      }),
    };
  }
}
