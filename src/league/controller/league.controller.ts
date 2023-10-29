import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { LeagueService } from '../services/league.service';
import { CreateLeagueDto } from '../dto/create-league.dto';
import { UpdateLeagueDto } from '../dto/update-league.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ApiTags, ApiParam, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import {
  leagueApiResponses,
  leagueDeleteApiResponses,
  leaguesApiResponses,
} from '../../utils/swaggerResponses/league/responseLeague';
import { ApiResponses } from '../../utils/swaggerResponses/swaggerDecoratorHelper';
import { LeagueResponseDto } from '../dto/response-league.dto';
import { League } from '../entities/league.entity';

@ApiTags('Leagues')
@ApiBearerAuth()
@Controller('leagues')
@Auth()
export class LeagueController {
  constructor(private readonly leagueService: LeagueService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new league', description: 'Create a new league' })
  @ApiResponses(leagueApiResponses)
  create(@Body() createLeagueDto: CreateLeagueDto) {
    return this.leagueService.create(createLeagueDto);
  }

  @Get()
  @ApiOperation({ summary: 'List leagues', description: 'Get a list of all leagues' })
  @ApiResponses(leaguesApiResponses)
  findAll(): Promise<LeagueResponseDto[]> {
    return this.leagueService.findAll();
  }

  @Get('league/:param')
  @ApiOperation({ summary: 'Get league by param (name or ID)', description: 'Retrieve a league by a specific parameter (name or ID)' })
  @ApiResponses(leagueApiResponses)
  @ApiParam({name: 'param', description: 'Parameter to search the league by name or id', type: 'string'})
  findOne(@Param('param') param: string) {
    return this.leagueService.findOne(param);
  }

  @Get(':name')
  @ApiOperation({ summary: 'Search leagues by name', description: 'Search and list leagues by name' })
  @ApiResponses(leaguesApiResponses)
  @ApiParam({name: 'name', description: 'Name of the league to search', type: 'string'})
  findLeagues(@Param('name') name: string): Promise<LeagueResponseDto[]> {
    return this.leagueService.findLeagues(name);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update league', description: 'Update details of a specific league' })
  @ApiResponses(leagueApiResponses)
  @ApiParam({name: 'id', description: 'ID of the league to update', type: 'string'})
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateLeagueDto: UpdateLeagueDto,
  ): Promise<LeagueResponseDto> {
    return this.leagueService.update(id, updateLeagueDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deactivate league', description: 'Deactivate a specific league from the system' })
  @ApiResponses(leagueDeleteApiResponses)
  @ApiParam({name: 'id', description: 'ID of the league to delete', type: 'string'})
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<League> {
    return this.leagueService.remove(id);
  }
}
