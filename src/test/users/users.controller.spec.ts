import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from 'src/users/users.controller';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';

import { JwtRequest } from 'src/auth/requests';
import { Response } from 'express';

describe('UsersController', () => {
  let usersController: UsersController;
  let configService: ConfigService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        ConfigService,
        {
          provide: UsersService,
          useValue: {
            deleteUser: jest.fn(),
          },
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('deleteUser', () => {
    it('쿠키를 삭제한다', async () => {
      // given
      const req = { user: { userId: 1 } } as unknown as JwtRequest;
      const res = { clearCookie: jest.fn() } as unknown as Response;

      // when
      await usersController.deleteUser(req, res);

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
    });
  });
});
