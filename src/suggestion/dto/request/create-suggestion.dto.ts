import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateSuggestionDto {
  @ApiProperty()
  @IsString()
  content: string;
}
