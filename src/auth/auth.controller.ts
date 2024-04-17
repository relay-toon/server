import {
  Controller,
  Get,
  UseGuards,
  Req,
  Res,
  UnauthorizedException,
  HttpCode,
} from '@nestjs/common';
import { Response } from 'express';
import { KakaoAuthGuard, NaverAuthGuard, GoogleAuthGuard } from './guards';
import {
  KakaoRequest,
  NaverRequest,
  GoogleRequest,
  JwtRequest,
  DefaultRequest,
} from './requests';
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

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleLogin(@Req() req: GoogleRequest, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.authService.login({
      provider: 'google',
      providerId: req.user.googleId,
    });
    res.cookie('accessToken', accessToken, this.cookieOptions);
    res.cookie('refreshToken', refreshToken, this.cookieOptions);
    res.cookie('isLoggedIn', true, { ...this.cookieOptions, httpOnly: false });
    return res.redirect(this.configService.get('CLIENT_URL')!);
  }

  @ApiOperation({ summary: 'accessToken 재발급' })
  @ApiResponse({
    status: 200,
    description: 'accessToken 재발급',
    headers: {
      'Set-Cookie': {
        description: 'accessToken',
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'unauthorized - jwt 토큰 인증 실패' })
  @Get('refresh')
  async refresh(@Req() req: JwtRequest, @Res() res: Response) {
    try {
      const newAccessToken = await this.authService.refresh(
        req.cookies.refreshToken,
      );
      res.cookie('accessToken', newAccessToken, this.cookieOptions);
      return res.send();
    } catch (err) {
      res.clearCookie('accessToken', this.cookieOptions);
      res.clearCookie('refreshToken', this.cookieOptions);
      res.clearCookie('isLoggedIn', { ...this.cookieOptions, httpOnly: false });
      throw new UnauthorizedException();
    }
  }

  @ApiOperation({ summary: '로그아웃' })
  @ApiResponse({
    status: 204,
    description: '로그아웃 성공, 쿠키 삭제',
  })
  @ApiUnauthorizedResponse({ description: 'unauthorized - jwt 토큰 인증 실패' })
  @Get('logout')
  @HttpCode(204)
  async logout(@Req() req: DefaultRequest, @Res() res: Response) {
    res.clearCookie('accessToken', this.cookieOptions);
    res.clearCookie('refreshToken', this.cookieOptions);
    res.clearCookie('isLoggedIn', { ...this.cookieOptions, httpOnly: false });
    this.authService.logout(req.cookies.refreshToken);
    return res.send();
  }
}
