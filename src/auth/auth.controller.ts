import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { KakaoAuthGuard, NaverAuthGuard } from './guards';
import { KakaoRequest, NaverRequest } from './requests';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  cookieOptions = {
    httpOnly: true,
    secure: true,
    domain: this.configService.get('COOKIE_DOMAIN'),
  };

  @ApiOperation({ summary: '카카오 로그인' })
  @ApiResponse({
    status: 301,
    description: '카카오 로그인 성공 / 홈으로 리다이렉트',
    headers: {
      'Set-Cookie': {
        description:
          'accessToken, refreshToken, isLoggedIn - isLoggedIn만 httpOnly: false',
      },
    },
  })
  @Get('kakao')
  @UseGuards(KakaoAuthGuard)
  async kakaoLogin(@Req() req: KakaoRequest, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.authService.login({
      provider: 'kakao',
      providerId: req.user.kakaoId,
    });
    res.cookie('accessToken', accessToken, this.cookieOptions);
    res.cookie('refreshToken', refreshToken, this.cookieOptions);
    res.cookie('isLoggedIn', true, { ...this.cookieOptions, httpOnly: false });
    return res.redirect(this.configService.get('CLIENT_URL')!);
  }

  @Get('naver')
  @UseGuards(NaverAuthGuard)
  async naverLogin(@Req() req: NaverRequest, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.authService.login({
      provider: 'naver',
      providerId: req.user.naverId,
    });
    res.cookie('accessToken', accessToken, this.cookieOptions);
    res.cookie('refreshToken', refreshToken, this.cookieOptions);
    res.cookie('isLoggedIn', true, { ...this.cookieOptions, httpOnly: false });
    return res.redirect(this.configService.get('CLIENT_URL')!);
  }
}
