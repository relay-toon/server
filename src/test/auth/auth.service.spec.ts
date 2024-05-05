import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
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
        {
          provide: UsersService,
          useValue: {
            getUserByProvider: jest.fn(),
            createUser: jest.fn(),
            setRefreshToken: jest.fn(),
            getRefreshToken: jest.fn(),
          },
        },
      ],
      imports: [
        ConfigModule,
        JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            secret: configService.get<string>('JWT_SECRET'),
            signOptions: { expiresIn: configService.get<string>('JWT_EXPIRE') },
          }),
          inject: [ConfigService],
        }),
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

  describe('generateAccessToken', () => {
    it('유저 아이디를 받아서 액세스 토큰을 생성한다', () => {
      // given
      const userId = '1';

      // when
      const accessToken = authService.generateAccessToken(userId);

      // then
      const decoded = jwtService.decode(accessToken);
      expect(decoded.userId).toEqual(userId);
    });

    it('올바른 secret을 사용하여 검증할 수 있다', () => {
      // given
      const userId = '1';

      // when
      const accessToken = authService.generateAccessToken(userId);

      // then
      const decoded = jwtService.verify(accessToken, {
        secret: configService.get('JWT_SECRET'),
      });
      expect(decoded.userId).toEqual(userId);
    });

    it('올바르지 않은 secret을 사용하여 검증할 경우 에러가 발생한다', () => {
      // given
      const userId = '1';

      // when
      const accessToken = authService.generateAccessToken(userId);

      // then
      expect(() => {
        jwtService.verify(accessToken, {
          secret: 'wrong-secret',
        });
      }).toThrow();
    });
  });

  describe('generateRefreshToken', () => {
    it('유저 아이디를 받아서 리프레시 토큰을 생성하고 저장한다', async () => {
      // given
      const userId = '1';

      // when
      const refreshToken = await authService.generateRefreshToken(userId);

      // then
      const savedToken = jwtService.decode(refreshToken);
      expect(savedToken.userId).toEqual(userId);
      expect(usersService.setRefreshToken).toHaveBeenCalledWith(
        userId,
        refreshToken,
      );
    });

    it('refreshToken은 accessToken과 다른 secret을 사용한다', async () => {
      // given
      const userId = '1';

      // when
      const refreshToken = await authService.generateRefreshToken(userId);

      // then
      const decoded = jwtService.verify(refreshToken, {
        secret: configService.get('JWT_REFRESH_SECRET'),
      });
      expect(decoded.userId).toEqual(userId);

      expect(() => {
        jwtService.verify(refreshToken, {
          secret: configService.get('JWT_SECRET'),
        });
      }).toThrow();
    });
  });

  describe('refresh', () => {
    it('유효하지 않은 refreshToken을 받으면 에러를 던진다', async () => {
      // given
      const refreshToken = 'invalid-token';

      // when
      const result = authService.refresh(refreshToken);

      // then
      await expect(result).rejects.toThrow('Unauthorized');
    });

    it('데이터베이스에 refreshToken이 없으면 에러를 던진다', async () => {
      // given
      const refreshToken = 'valid-token';
      jwtService.verify = jest.fn().mockReturnValue({ userId: '1' });
      usersService.getRefreshToken.mockResolvedValue(null);

      // when
      const result = authService.refresh(refreshToken);

      // then
      await expect(result).rejects.toThrow('Unauthorized');
    });

    it('데이터베이스에 저장된 refreshToken과 일치하지 않으면 에러를 던진다', async () => {
      // given
      const refreshToken = 'v1';
      jwtService.verify = jest.fn().mockReturnValue({ userId: '1' });
      usersService.getRefreshToken.mockResolvedValue('v2');

      // when
      const result = authService.refresh(refreshToken);

      // then
      await expect(result).rejects.toThrow('Unauthorized');
    });

    it('새로운 accessToken을 생성하여 반환한다', async () => {
      // given
      const refreshToken = 'valid-token';
      jwtService.verify = jest.fn().mockReturnValue({ userId: '1' });
      usersService.getRefreshToken.mockResolvedValue(refreshToken);

      // when
      const result = await authService.refresh(refreshToken);

      // then
      const decoded = jwtService.decode(result);
      expect(decoded.userId).toEqual('1');
    });
  });
});
