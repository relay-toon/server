import { ApiProperty } from '@nestjs/swagger';
import { ToonDto } from './toon.dto';

export class ToonsDto {
  @ApiProperty({ type: [ToonDto] })
  toons: ToonDto[];

  @ApiProperty({ example: 1, minimum: 1, type: Number, required: false })
  totalPage?: number;
}
