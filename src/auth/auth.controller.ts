import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { KakaoAuthGuard } from './guards';
import { KakaoRequest } from './requests';

@Controller('auth')
export class AuthController {
  @Get('kakao')
  @UseGuards(KakaoAuthGuard)
  async kakaoLogin(@Req() req: KakaoRequest) {
    console.log(req.user.kakaoId);
    return;
  }
}
