import { ApiProperty } from '@nestjs/swagger';

export class NameDto {
  @ApiProperty({ example: '마포 반고흐' })
  name: string;
}
