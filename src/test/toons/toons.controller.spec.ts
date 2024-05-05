import { Test, TestingModule } from '@nestjs/testing';
import { ToonsController } from 'src/toons/toons.controller';
import { ToonsService } from 'src/toons/toons.service';
import { HttpException } from '@nestjs/common';

describe('ToonsController', () => {
  let toonsController: ToonsController;
  let toonsService: jest.Mocked<ToonsService>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ToonsController],
      providers: [
        {
          provide: ToonsService,
          useValue: {
            lockToon: jest.fn(),
          },
        },
      ],
    }).compile();
    toonsController = module.get<ToonsController>(ToonsController);
    toonsService = module.get(ToonsService);
  });

  describe('lockToon', () => {
    it('Already locked 에러가 발생하면 423 에러를 던진다', async () => {
      // given
      const toonId = 'toonId';
      toonsService.lockToon.mockRejectedValue(new Error('Already locked'));

      // when
      const result = toonsController.lockToon(toonId);

      // then
      await expect(result).rejects.toThrow(HttpException);
      await expect(result).rejects.toMatchObject({ status: 423 });
    });

    it('Already completed 에러가 발생하면 409 에러를 던진다', async () => {
      // given
      const toonId = 'toonId';
      toonsService.lockToon.mockRejectedValue(new Error('Already completed'));

      // when
      const result = toonsController.lockToon(toonId);

      // then
      await expect(result).rejects.toThrow(HttpException);
      await expect(result).rejects.toMatchObject({ status: 409 });
    });
  });
});
