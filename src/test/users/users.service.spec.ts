import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from 'src/users/users.service';
import { UsersRepository } from 'src/users/users.repository';

describe('UsersService', () => {
  let usersService: UsersService;
  let uesrsRespository: jest.Mocked<UsersRepository>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: {
            createUser: jest.fn(),
          },
        },
      ],
    }).compile();
    usersService = module.get(UsersService);
    uesrsRespository = module.get(UsersRepository);
  });

  describe('createUser', () => {
    it('무작위 이름을 생성한다', async () => {
      // given
      const info = { provider: 'kakao', providerId: '1234' };

      // when
      await usersService.createUser(info);
      await usersService.createUser(info);

      // then
      const [firstCall, secondCall] = uesrsRespository.createUser.mock.calls;
      expect(firstCall[0].name).not.toBe(secondCall[0].name);
    });
  });
});
