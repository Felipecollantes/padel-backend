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
@ApiTags('Leagues')
@ApiBearerAuth()
@Controller('leagues')
@Auth()
export class LeagueController {
  constructor(private readonly leagueService: LeagueService) {}

  @Post()
  create(@Body() createLeagueDto: CreateLeagueDto) {
    return this.leagueService.create(createLeagueDto);
  }

  @Get()
  findAll() {
    return this.leagueService.findAll();
  }

  @ApiParam({name: 'id'})
  @Get('league/:id')
  findOne(@Param('id') param: string) {
    return this.leagueService.findOne(param);
  }

  @ApiParam({name: 'param'})
  @Get(':param')
  findLeagues(@Param('param') param: string) {
    return this.leagueService.findLeagues(param);
  }

  @ApiParam({name: 'id'})
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateLeagueDto: UpdateLeagueDto,
  ) {
    return this.leagueService.update(id, updateLeagueDto);
  }

  @ApiParam({name: 'id'})
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.leagueService.remove(id);
  }
}
