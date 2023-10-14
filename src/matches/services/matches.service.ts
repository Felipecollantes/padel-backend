import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMatchDto } from '../dto/create-match.dto';
import { UpdateMatchDto } from '../dto/update-match.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from '../entities/match.entity';
import { League } from 'src/league/entities/league.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(League)
    private readonly leagueRepository: Repository<League>,
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createMatchDto: CreateMatchDto) {
    const { leagueId, teamOnePlayersIds, teamTwoPlayersIds, ...matchDetails } =
      createMatchDto;
    const match = this.matchRepository.create({
      ...matchDetails,
      teamOnePlayers: [],
      teamTwoPlayers: [],
    });
    match.league = await this.findLeague(leagueId);

    const { teamOnePlayers, teamTwoPlayers } = await this.getTeamsPlayers(
      teamOnePlayersIds,
      teamTwoPlayersIds,
    );

    match.teamOnePlayers = teamOnePlayers;
    match.teamTwoPlayers = teamTwoPlayers;

    await this.matchRepository.save(match);

    return match;
  }

  findAll() {
    return this.matchRepository.find({
      relations: { league: true, teamOnePlayers: true, teamTwoPlayers: true },
    });
  }

  async findOne(id: string) {
    const match = await this.matchRepository.findOne({
      where: { id: id },
      relations: { league: true, teamOnePlayers: true, teamTwoPlayers: true },
    });
    if (!match) throw new NotFoundException(`Match with id: ${id} not found`);
    return match;
  }

  async update(id: string, updateMatchDto: UpdateMatchDto) {
    const { leagueId, teamOnePlayersIds, teamTwoPlayersIds, ...matchDetails } =
      updateMatchDto;
    const { teamOnePlayers, teamTwoPlayers } = await this.getTeamsPlayers(
      teamOnePlayersIds,
      teamTwoPlayersIds,
    );
    const league = await this.findLeague(leagueId);
    const matchUpdate = await this.matchRepository.preload({
      id: id,
      league: league,
      teamOnePlayers: teamOnePlayers,
      teamTwoPlayers: teamTwoPlayers,
      ...matchDetails,
    });

    try {
      await this.matchRepository.save(matchUpdate);

      return matchUpdate;
    } catch (err) {
      this.handleExceptions(err);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} match`;
  }

  async findLeague(leagueId: string) {
    const league = await this.leagueRepository.findOne({
      where: { id: leagueId },
    });
    if (!league)
      throw new NotFoundException(`League with id: ${leagueId} not found`);
    return league;
  }

  async getTeamsPlayers(
    teamOnePlayersIds: string[],
    teamTwoPlayersIds: string[],
  ) {
    const teamOnePlayers = await this.userRepository
      .createQueryBuilder('item')
      .where('item.id IN (:...teamOnePlayersIds)', { teamOnePlayersIds })
      .getMany();
    const teamTwoPlayers = await this.userRepository
      .createQueryBuilder('item')
      .where('item.id IN (:...teamTwoPlayersIds)', { teamTwoPlayersIds })
      .getMany();

    if (!teamOnePlayers.length || !teamTwoPlayers.length) {
      throw new NotFoundException(
        'No se encontraron todos los jugadores para crear el partido.',
      );
    }
    return {
      teamOnePlayers,
      teamTwoPlayers,
    };
  }

  private handleExceptions(exceptions: any) {
    if (exceptions.code === '23505') {
      throw new BadRequestException(exceptions.detail);
    }
    if (exceptions.code === '23503') {
      throw new NotFoundException(`User not found`);
    }
  }
}
