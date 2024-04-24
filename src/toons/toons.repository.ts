import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

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

        return tx.toon.update({
          where: {
            id: toonId,
          },
          data: {
            lockId: uuidv4(),
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
}
