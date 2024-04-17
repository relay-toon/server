import { ApiProperty } from '@nestjs/swagger';

export class ToonDto {
  @ApiProperty({ example: 'b2aca21c-7749-45cb-8df7-f1a2de8ff73c' })
  id: string;

  @ApiProperty({ example: '아기 호랑이' })
  title: string;

  @ApiProperty({ example: '40d91eec-f47f-49b9-941c-a58aeec54d53' })
  ownerId: string;

  @ApiProperty({ example: 4 })
  headCount: number;

  @ApiProperty({ example: 3, nullable: true })
  timer: number | null;

  @ApiProperty({ example: 'https://example.com/image.png', nullable: true })
  image: string | null;

  @ApiProperty({ example: false })
  completed: boolean;

  @ApiProperty({ example: false })
  isDrawing: boolean;

  @ApiProperty({ example: '2024-04-17T14:55:19.430Z' })
  createdAt: Date;
}
