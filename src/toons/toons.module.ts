import { Module } from '@nestjs/common';
import { ToonsController } from './toons.controller';
import { ToonsService } from './toons.service';
import { ToonsRepository } from './toons.repository';
import { AwsModule } from 'src/aws/aws.module';

@Module({
  imports: [AwsModule],
  controllers: [ToonsController],
  providers: [ToonsService, ToonsRepository],
})
export class ToonsModule {}
