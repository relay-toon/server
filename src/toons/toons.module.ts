import { Module } from '@nestjs/common';
import { ToonsController } from './toons.controller';
import { ToonsService } from './toons.service';

@Module({
  controllers: [ToonsController],
  providers: [ToonsService],
})
export class ToonsModule {}
