import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { ProviderInfo } from './types';

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  async createUser(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({
      data,
      select: {
        id: true,
      },
    });
  }

  async getUserByProvider(info: ProviderInfo) {
    return this.prisma.user.findFirst({
      where: {
        ...info,
      },
    });
  }

  async setRefreshToken(userId: string, refreshToken: string | null) {
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken,
      },
    });
  }

  async getRefreshToken(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: { refreshToken: true },
    });
    return user?.refreshToken;
  }
}
