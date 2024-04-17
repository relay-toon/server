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
        name: true,
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
}
