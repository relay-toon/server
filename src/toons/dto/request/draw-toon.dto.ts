import { ApiProperty } from '@nestjs/swagger';
import { MinLength, MaxLength, IsOptional, IsUUID } from 'class-validator';

export class DrawToonDto {
  @ApiProperty({ example: '익명의 원숭이', description: '닉네임' })
  @MinLength(1)
  @MaxLength(12)
  name: string;

  @ApiProperty({
    example: 'b2aca21c-7749-45cb-8df7-f1a2de8ff73c',
    description: '유저 아이디',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiProperty({ type: 'file' })
  image: Express.Multer.File;
}
