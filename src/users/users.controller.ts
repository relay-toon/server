import { Controller, Patch, Get, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards';
import { JwtRequest } from 'src/auth/requests';
import { MyInfoDto } from './dto/response';
import {
  ApiCookieAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
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
}
