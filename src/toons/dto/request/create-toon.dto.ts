import { MinLength, MaxLength, Max, IsInt, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateToonDto {
  @ApiProperty({ example: '아기 호랑이' })
  @MinLength(1)
  @MaxLength(25)
  title: string;

  @ApiProperty({ example: 4 })
  @Max(6)
  headCount: number;

  @ApiProperty({ example: 3, description: '단위: 초', required: false })
  @IsOptional()
  @IsInt()
  timer?: number;
}
