import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from 'src/auth/auth.controller';
import { AuthService } from 'src/auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { KakaoRequest } from 'src/auth/requests';
import { Response } from 'express';

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
});
