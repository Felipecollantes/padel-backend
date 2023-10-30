import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe, HttpCode,
} from '@nestjs/common';
import { MatchesService } from '../services/matches.service';
import { CreateMatchDto } from '../dto/create-match.dto';
import { UpdateMatchDto } from '../dto/update-match.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MatchResponseDto } from '../dto/response-match.dto';

@ApiTags('Matches')
@ApiBearerAuth()
@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post()
  create(@Body() createMatchDto: CreateMatchDto): Promise<MatchResponseDto> {
    return this.matchesService.create(createMatchDto);
  }

  @Get()
  findAll(): Promise<MatchResponseDto[]> {
    return this.matchesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<MatchResponseDto> {
    return this.matchesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateMatchDto: UpdateMatchDto,
  ): Promise<MatchResponseDto> {
    return this.matchesService.update(id, updateMatchDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.matchesService.remove(id);
  }
}
