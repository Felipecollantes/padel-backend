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
import { ApiTags, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import {
  leagueApiResponses,
  leagueDeleteApiResponses,
  leaguesApiResponses,
} from '../../utils/swaggerResponses/league/response';
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
  @ApiResponses(leagueApiResponses)
  create(@Body() createLeagueDto: CreateLeagueDto) {
    return this.leagueService.create(createLeagueDto);
  }

  @Get()
  @ApiResponses(leaguesApiResponses)
  findAll(): Promise<LeagueResponseDto[]> {
    return this.leagueService.findAll();
  }

  @Get('league/:param')
  @ApiResponses(leagueApiResponses)
  @ApiParam({name: 'param'})
  findOne(@Param('param') param: string) {
    return this.leagueService.findOne(param);
  }

  @Get(':name')
  @ApiResponses(leaguesApiResponses)
  @ApiParam({name: 'name'})
  findLeagues(@Param('name') name: string): Promise<LeagueResponseDto[]> {
    return this.leagueService.findLeagues(name);
  }

  @Patch(':id')
  @ApiResponses(leagueApiResponses)
  @ApiParam({name: 'id'})
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateLeagueDto: UpdateLeagueDto,
  ): Promise<LeagueResponseDto> {
    return this.leagueService.update(id, updateLeagueDto);
  }

  @Delete(':id')
  @ApiResponses(leagueDeleteApiResponses)
  @ApiParam({name: 'id'})
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<League> {
    return this.leagueService.remove(id);
  }
}
