import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, HttpCode } from '@nestjs/common';
import { MatchesService } from '../services/matches.service';
import { CreateMatchDto } from '../dto/create-match.dto';
import { UpdateMatchDto } from '../dto/update-match.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { MatchResponseDto } from '../dto/response-match.dto';
import { ApiResponses } from '../../utils/swaggerResponses/swaggerDecoratorHelper';
import {
  createMatchApiResponses,
  matchApiResponse,
  matchDeleteApiResponse,
  matchesApiResponse,
} from '../../utils/swaggerResponses/match/responseMatch';

@ApiTags('Matches')
@ApiBearerAuth()
@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new match',
    description: 'Register a new match in the system',
  })
  @ApiResponses(createMatchApiResponses)
  create(@Body() createMatchDto: CreateMatchDto): Promise<MatchResponseDto> {
    return this.matchesService.create(createMatchDto);
  }

  @Get()
  @ApiOperation({
    summary: 'List matches',
    description: 'Retrieve a list of all registered matches',
  })
  @ApiResponses(matchesApiResponse)
  findAll(): Promise<MatchResponseDto[]> {
    return this.matchesService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Retrieve a specific match by ID',
    description: 'Get match details using its ID',
  })
  @ApiResponses(matchApiResponse)
  @ApiParam({
    name: 'id',
    description: 'ID of the match to retrieve',
    type: 'string',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<MatchResponseDto> {
    return this.matchesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update match details',
    description: 'Modify the details of a registered match',
  })
  @ApiResponses(matchApiResponse)
  @ApiParam({
    name: 'id',
    description: 'ID of the match to update',
    type: 'string',
  })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateMatchDto: UpdateMatchDto): Promise<MatchResponseDto> {
    return this.matchesService.update(id, updateMatchDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Delete a match',
    description: 'Remove a match from the system',
  })
  @ApiResponses(matchDeleteApiResponse)
  @ApiParam({
    name: 'id',
    description: 'ID of the match to delete',
    type: 'string',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.matchesService.remove(id);
  }
}
