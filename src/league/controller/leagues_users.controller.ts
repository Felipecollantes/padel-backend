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
import { LeagueUserService } from '../services/league_user/league_user.service';
import { LeagueUsersResponseDto } from '../dto/response-league_users.dto';
@ApiTags('Leagues - Participants')
@ApiBearerAuth()
@Controller('leagues_participants_users')
@Auth()
export class LeagueUserController {
  constructor(private readonly leagueUserService: LeagueUserService) {}

  // @Post()
  // create(@Body() createLeagueDto: CreateLeagueDto) {
  //   return this.leagueService.create(createLeagueDto);
  // }

  // @Get()
  // findAll() {
  //   return this.leagueService.findAll();
  // }

  // @ApiParam({name: 'param'})
  // @Get('league/:param')
  // findOne(@Param('param') param: string) {
  //   return this.leagueService.findOne(param);
  // }

  @Get(':id')
  @ApiParam({ name: 'id' })
  findLeaguesUsers(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<LeagueUsersResponseDto[]> {
    return this.leagueUserService.findLeaguesUsers(id);
  }
  //
  // @ApiParam({name: 'id'})
  // @Patch(':id')
  // update(
  //   @Param('id', ParseUUIDPipe) id: string,
  //   @Body() updateLeagueDto: UpdateLeagueDto,
  // ) {
  //   return this.leagueService.update(id, updateLeagueDto);
  // }
  //
  // @ApiParam({name: 'id'})
  // @Delete(':id')
  // remove(@Param('id', ParseUUIDPipe) id: string) {
  //   return this.leagueService.remove(id);
  // }
}
