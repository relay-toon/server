import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { KakaoAuthGuard, NaverAuthGuard } from './guards';
import { KakaoRequest, NaverRequest } from './requests';

@Controller('auth')
export class AuthController {
  @Get('kakao')
  @UseGuards(KakaoAuthGuard)
  async kakaoLogin(@Req() req: KakaoRequest) {
    console.log(req.user.kakaoId);
    return;
  }

  @Get('naver')
  @UseGuards(NaverAuthGuard)
  async naverLogin(@Req() req: NaverRequest) {
    console.log(req.user.naverId);
    return;
  }
}
