import { ApiProperty } from '@nestjs/swagger';
import { ToonDto } from './toon.dto';
import { ParticipantDto } from './participant.dto';

export class ToonWithParticipantsDto extends ToonDto {
  @ApiProperty({ type: [ParticipantDto] })
  participants: ParticipantDto[];
}
