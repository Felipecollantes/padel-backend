import { Controller, Get, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth/auth.decorator';
import { ApiTags, ApiParam, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { LeagueUserService } from '../services/league_user/league_user.service';
import { LeagueUsersResponseDto } from '../dto/response-league_users.dto';
import { UserLeague } from '../entities/leagues_users.entity';
import { ApiResponses } from '../../utils/swaggerResponses/swaggerDecoratorHelper';
import { leagueUsersApiResponse } from '../../utils/swaggerResponses/league/responseLeagueUsers';
@ApiTags('Leagues - Participants')
@ApiBearerAuth()
@Controller('leagues_participants_users')
@Auth()
export class LeagueUserController {
  constructor(private readonly leagueUserService: LeagueUserService) {}

  @Get(':id')
  @ApiOperation({
    summary: 'Get participants by ID league',
    description: 'Retrieve a participants by a specific ID league',
  })
  @ApiResponses(leagueUsersApiResponse)
  @ApiParam({ name: 'id' })
  findLeaguesUsers(@Param('id', ParseUUIDPipe) id: string): Promise<LeagueUsersResponseDto[]> {
    return this.leagueUserService.findLeaguesUsers(id);
  }
  @Delete(':leaguesId/:usersId')
  @ApiOperation({
    summary: 'Deactivate participant',
    description: 'Deactivate a specific participant from the system',
  })
  @ApiParam({
    name: 'leaguesId',
    description: 'ID of the league',
    required: true,
    type: 'string',
  })
  @ApiParam({
    name: 'usersId',
    description: 'ID of the user',
    required: true,
    type: 'string',
  })
  remove(
    @Param('leaguesId', ParseUUIDPipe) leaguesId: string,
    @Param('usersId', ParseUUIDPipe) usersId: string,
  ): Promise<UserLeague> {
    return this.leagueUserService.remove(leaguesId, usersId);
  }
}
