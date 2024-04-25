import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Get,
  Param,
  HttpException,
  Put,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ToonsService } from './toons.service';
import { JwtRequest } from 'src/auth/requests';
import { JwtAuthGuard } from 'src/auth/guards';
import { CreateToonDto, DrawToonDto } from './dto/request';
import { ToonDto, ToonWithParticipantsDto } from './dto/response';
import {
  ApiTags,
  ApiCookieAuth,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiConsumes,
} from '@nestjs/swagger';

@ApiTags('toons')
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

  @ApiOperation({ summary: '락 획득' })
  @ApiResponse({
    status: 200,
    description: 'lockId',
    type: ToonWithParticipantsDto,
  })
  @ApiResponse({ status: 423, description: 'Already locked' })
  @ApiResponse({ status: 409, description: 'Already completed' })
  @Get(':toonId/lock')
  async lockToon(@Param('toonId') toonId: string) {
    try {
      return await this.toonsService.lockToon(toonId);
    } catch (e) {
      if (!(e instanceof Error)) {
        throw new HttpException('Internal Server Error', 500);
      } else {
        if (e.message === 'Already locked') {
          throw new HttpException('Already locked', 423);
        } else if (e.message === 'Already completed') {
          throw new HttpException('Already completed', 409);
        }
      }
    }
  }

  @ApiOperation({ summary: '툰 그리기' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: DrawToonDto })
  @ApiResponse({
    status: 201,
    description: 'created',
    type: ToonWithParticipantsDto,
  })
  @Put(':toonId')
  @HttpCode(201)
  @UseInterceptors(FileInterceptor('image'))
  async drawToon(
    @Param('toonId') toonId: string,
    @Body() drawToonDto: DrawToonDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.toonsService.drawToon(toonId, drawToonDto, image);
  }

  @ApiOperation({ summary: '내 툰 리스트 조회' })
  @ApiCookieAuth('accessToken')
  @ApiResponse({ status: 200, type: [ToonDto] })
  @Get('owned')
  @UseGuards(JwtAuthGuard)
  async getOwnedToons(
    @Req() req: JwtRequest,
    @Query('completed') completed: boolean,
  ) {
    return this.toonsService.getOwnedToons(req.user.userId, completed);
  }

  @ApiOperation({ summary: '참여한 툰 리스트 조회' })
  @ApiCookieAuth('accessToken')
  @ApiResponse({ status: 200, type: [ToonDto] })
  @Get('participated')
  @UseGuards(JwtAuthGuard)
  async getParticipatedToons(
    @Req() req: JwtRequest,
    @Query('completed') completed: boolean,
  ) {
    return this.toonsService.getParticipatedToons(req.user.userId, completed);
  }

  @ApiOperation({ summary: '툰 조회' })
  @ApiResponse({ status: 200, type: ToonWithParticipantsDto })
  @Get(':toonId')
  async getToon(@Param('toonId') toonId: string) {
    return this.toonsService.getToon(toonId);
  }
}
