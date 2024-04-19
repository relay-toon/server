import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class SuggestionService {
  constructor(private prisma: PrismaService) {}

  async createSuggestion(data: Prisma.SuggestionCreateInput) {
    return this.prisma.suggestion.create({ data });
  }
}
