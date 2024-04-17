import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { KakaoAuthGuard, NaverAuthGuard } from './guards';
import { KakaoRequest, NaverRequest } from './requests';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
