import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ProviderInfo } from 'src/users/types';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: JwtService;
  let configService: ConfigService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        ConfigService,
        {
          provide: UsersService,
          useValue: {
            getUserByProvider: jest.fn(),
            createUser: jest.fn(),
            setRefreshToken: jest.fn(),
          },
        },
      ],
    }).compile();
    authService = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('validateUser', () => {
    it('유저가 존재할 때 유저를 반환한다', async () => {
      // given
      const info: ProviderInfo = {
        provider: 'kakao',
        providerId: '1234',
      };
      const user = {
        id: '1',
        name: null,
        provider: 'kakao',
        providerId: '1234',
        refreshToken: null,
      };
      usersService.getUserByProvider.mockResolvedValue(user);

      // when
      const result = await authService.validateUser(info);

      // then
      expect(result).toEqual(user);
    });

    it('유저가 존재하지 않을 때 유저를 생성하고 반환한다', async () => {
      // given
      const info: ProviderInfo = {
        provider: 'kakao',
        providerId: '1234',
      };
      usersService.getUserByProvider.mockResolvedValue(null);
      const createdUser = { id: '1' };
      usersService.createUser.mockResolvedValue(createdUser);

      // when
      const result = await authService.validateUser(info);

      // then
      expect(usersService.createUser).toHaveBeenCalledWith(info);
      expect(result).toEqual(createdUser);
    });
  });
});
