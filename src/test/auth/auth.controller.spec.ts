import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from 'src/auth/auth.controller';
import { AuthService } from 'src/auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { KakaoRequest, JwtRequest } from 'src/auth/requests';
import { Response } from 'express';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: jest.Mocked<AuthService>;
  let configService: ConfigService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        ConfigService,
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            refresh: jest.fn(),
          },
        },
      ],
    }).compile();
    authController = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('kakaoLogin', () => {
    it('카카오 로그인 성공 시 쿠키를 설정한다', async () => {
      // given
      authService.login.mockResolvedValue({
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      });
      const req = { user: { kakaoId: '1234' } } as unknown as KakaoRequest;
      const res = {
        cookie: jest.fn(),
        redirect: jest.fn(),
      } as unknown as Response;

      // when
      await authController.kakaoLogin(req, res);

      // then
      const cookieOptions = {
        httpOnly: true,
        secure: true,
        domain: configService.get('COOKIE_DOMAIN'),
      };
      expect(res.cookie).toHaveBeenCalledTimes(3);
      expect(res.cookie).toHaveBeenCalledWith(
        'accessToken',
        'accessToken',
        cookieOptions,
      );
      expect(res.cookie).toHaveBeenCalledWith(
        'refreshToken',
        'refreshToken',
        cookieOptions,
      );
      expect(res.cookie).toHaveBeenCalledWith('isLoggedIn', true, {
        ...cookieOptions,
        httpOnly: false,
      });
    });
  });

  describe('refresh', () => {
    it('새로운 액세스 토큰을 쿠키에 설정한다', async () => {
      // given
      const req = {
        cookies: {
          refreshToken: 'refreshToken',
        },
      } as unknown as JwtRequest;
      const res = { cookie: jest.fn(), send: jest.fn() } as unknown as Response;
      authService.refresh.mockResolvedValue('newAccessToken');

      // when
      await authController.refresh(req, res);

      // then
      const cookieOptions = {
        httpOnly: true,
        secure: true,
        domain: configService.get('COOKIE_DOMAIN'),
      };
      expect(res.cookie).toHaveBeenCalledTimes(1);
      expect(res.cookie).toHaveBeenCalledWith(
        'accessToken',
        'newAccessToken',
        cookieOptions,
      );
    });

    it('액세스 토큰 재발급 실패 시 쿠키를 삭제하고 401 에러를 던진다', async () => {
      // given
      const req = {
        cookies: { refreshToken: 'refreshToken' },
      } as unknown as JwtRequest;
      const res = { clearCookie: jest.fn() } as unknown as Response;
      authService.refresh.mockRejectedValue(new Error());

      // when
      try {
        await authController.refresh(req, res);
      } catch (err) {
        // then
        const cookieOptions = {
          httpOnly: true,
          secure: true,
          domain: configService.get('COOKIE_DOMAIN'),
        };
        expect(res.clearCookie).toHaveBeenCalledTimes(3);
        expect(res.clearCookie).toHaveBeenCalledWith(
          'accessToken',
          cookieOptions,
        );
        expect(res.clearCookie).toHaveBeenCalledWith(
          'refreshToken',
          cookieOptions,
        );
        expect(res.clearCookie).toHaveBeenCalledWith('isLoggedIn', {
          ...cookieOptions,
          httpOnly: false,
        });
        expect(err).toBeInstanceOf(UnauthorizedException);
      }
    });
  });
});
