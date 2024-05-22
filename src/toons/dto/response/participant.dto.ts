import { ApiProperty } from '@nestjs/swagger';

export class ParticipantDto {
  @ApiProperty({ example: 'bdsaa21c-7749-45cb-8df7', nullable: true })
  userId: string | null;

  @ApiProperty({ example: '익명의 원숭이' })
  name: string;
}
