import { ApiProperty } from '@nestjs/swagger';

export class MyInfoDto {
  @ApiProperty({ example: '46fb9037-4eb8-4b7b-b4a1-142bef6bbd91' })
  id: string;

  @ApiProperty({ example: '마포 반고흐', nullable: true })
  name: string | null;

  @ApiProperty({ example: 'kakao' })
  provider: string;
}
