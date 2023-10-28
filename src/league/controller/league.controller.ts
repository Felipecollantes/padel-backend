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
import { ApiTags, ApiParam, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import {
  createLeagueApiResponses,
  leaguesApiResponses,
} from '../../utils/swaggerResponses/league/response';
import { ApiResponses } from '../../utils/swaggerResponses/swaggerDecoratorHelper';
import { LeagueResponseDto } from '../dto/response-league.dto';
@ApiTags('Leagues')
@ApiBearerAuth()
@Controller('leagues')
@Auth()
export class LeagueController {
  constructor(private readonly leagueService: LeagueService) {}

  @Post()
  @ApiResponses(createLeagueApiResponses)
  create(@Body() createLeagueDto: CreateLeagueDto): Promise<LeagueResponseDto> {
    return this.leagueService.create(createLeagueDto);
  }

  @Get()
  @ApiResponses(leaguesApiResponses)
  findAll(): Promise<LeagueResponseDto[]> {
    return this.leagueService.findAll();
  }

  @ApiParam({name: 'id'})
  @Get('league/:id')
  findOne(@Param('id') param: string) {
    return this.leagueService.findOne(param);
  }

  @ApiParam({name: 'param'})
  @Get(':param')
  findLeagues(@Param('param') param: string): Promise<LeagueResponseDto[]> {
    return this.leagueService.findLeagues(param);
  }

  @ApiParam({name: 'id'})
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateLeagueDto: UpdateLeagueDto,
  ): Promise<LeagueResponseDto> {
    return this.leagueService.update(id, updateLeagueDto);
  }

  @ApiParam({name: 'id'})
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<LeagueResponseDto> {
    return this.leagueService.remove(id);
  }
}
