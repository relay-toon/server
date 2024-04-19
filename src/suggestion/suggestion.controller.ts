import { Controller, Post, Body } from '@nestjs/common';
import { SuggestionService } from './suggestion.service';
import { CreateSuggestionDto } from './dto/request';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('suggestion')
@Controller('suggestion')
export class SuggestionController {
  constructor(private readonly suggestionService: SuggestionService) {}

  @Post()
  @ApiOperation({ summary: '건의하기' })
  @ApiResponse({ status: 201, description: 'Created' })
  async create(@Body() createSuggestionDto: CreateSuggestionDto) {
    return this.suggestionService.createSuggestion(createSuggestionDto);
  }
}
