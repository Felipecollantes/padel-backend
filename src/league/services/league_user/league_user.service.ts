import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserLeague } from '../../entities/leagues_users.entity';
import { Repository } from 'typeorm';
import { LeagueUsersResponseDto } from '../../dto/response-league_users.dto';

@Injectable()
export class LeagueUserService {

  constructor(
    @InjectRepository(UserLeague)
    private readonly userLeagueRepository: Repository<UserLeague>
  ) {}


  async findLeaguesUsers(id: string): Promise<LeagueUsersResponseDto[]> {
    const usersLeague = await this.userLeagueRepository.find({
      where: { leaguesId: id },
      relations: { user: true },
    });

    return this.mapAll(usersLeague)
  }

  async remove(leaguesId: string, usersId: string): Promise<UserLeague> {
    const userLeague: UserLeague = await this.userLeagueRepository.findOne(
      { where: { usersId: usersId, leaguesId: leaguesId } }
    );

    if (!userLeague) {
      throw new NotFoundException('Participation not found');
    }

    userLeague.isActive = false;
    await this.userLeagueRepository.save(userLeague);
    return userLeague
  }

  mapAll(userLeague: UserLeague[]): LeagueUsersResponseDto[] {
    return userLeague.map((userLeague) => ({
      usersId: userLeague.usersId,
      totalMatches: userLeague.totalMatches,
      matchesWon: userLeague.matchesWon,
      matchesTied: userLeague.matchesTied,
      matchesLost: userLeague.matchesLost,
      points: userLeague.points,
      email: userLeague.user.email,
      name: userLeague.user.name,
      surname: userLeague.user.surname,
      isActive: userLeague.user.isActive,
    }));
  }
}
