import { ApiProperty } from '@nestjs/swagger';

export class ParticipantDto {
  @ApiProperty({ example: '익명의 원숭이' })
  name: string;
}
