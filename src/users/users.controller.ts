import {
  Controller,
  Put,
  Get,
  UseGuards,
  Req,
  Body,
  HttpCode,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards';
import { JwtRequest } from 'src/auth/requests';
import { NameDto } from './dto/request';
import { MyInfoDto } from './dto/response';
import {
  ApiCookieAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: '내 정보 조회' })
  @ApiCookieAuth('accessToken')
  @ApiResponse({ status: 200, type: MyInfoDto })
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req: JwtRequest) {
    return this.usersService.getUserById(req.user.userId);
  }

  @ApiOperation({ summary: '내 이름 수정' })
  @ApiCookieAuth('accessToken')
  @ApiBody({ type: NameDto })
  @ApiResponse({ status: 201 })
  @Put('me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  async updateUserName(@Req() req: JwtRequest, @Body('name') name: string) {
    return this.usersService.updateUserName(req.user.userId, name);
  }
}
