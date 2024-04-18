import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Get,
  Param,
} from '@nestjs/common';
import { ToonsService } from './toons.service';
import { JwtRequest } from 'src/auth/requests';
import { JwtAuthGuard } from 'src/auth/guards';
import { CreateToonDto } from './dto/request';
import { ToonDto, ToonWithParticipantsDto } from './dto/response';
import {
  ApiTags,
  ApiCookieAuth,
  ApiOperation,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Toons')
@Controller('toons')
export class ToonsController {
  constructor(private readonly toonsService: ToonsService) {}

  @ApiOperation({ summary: '툰 생성' })
  @ApiBody({ type: CreateToonDto })
  @ApiCookieAuth('accessToken')
  @ApiResponse({ status: 201, description: 'created', type: ToonDto })
  @Post()
  @UseGuards(JwtAuthGuard)
  async createToon(@Req() req: JwtRequest, @Body() data: CreateToonDto) {
    return this.toonsService.createToon(req.user.userId, data);
  }

  @ApiOperation({ summary: '툰 조회' })
  @ApiResponse({ status: 200, type: ToonWithParticipantsDto })
  @Get(':toonId')
  async getToon(@Param('toonId') toonId: string) {
    return this.toonsService.getToon(toonId);
  }
}
