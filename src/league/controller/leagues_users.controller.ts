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

@Controller('leagues_participants_users')
@Auth()
export class LeagueUserController {
  constructor(private readonly leagueService: LeagueService) {}

  @Post()
  create(@Body() createLeagueDto: CreateLeagueDto) {
    return this.leagueService.create(createLeagueDto);
  }

  @Get()
  findAll() {
    return this.leagueService.findAll();
  }

  @Get('league/:param')
  findOne(@Param('param') param: string) {
    return this.leagueService.findOne(param);
  }

  @Get(':param')
  findLeagues(@Param('param') param: string) {
    return this.leagueService.findLeagues(param);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateLeagueDto: UpdateLeagueDto,
  ) {
    return this.leagueService.update(id, updateLeagueDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.leagueService.remove(id);
  }
}
