import { Controller, Post, Body } from '@nestjs/common';
import { ToonsService } from './toons.service';
import { CreateToonDto } from './dto/request';

@Controller('toons')
export class ToonsController {
  constructor(private readonly toonsService: ToonsService) {}

  @Post()
  async createToon(@Body() data: CreateToonDto) {
    console.log(data);
    return 0;
  }
}
