import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMatchDto } from '../dto/create-match.dto';
import { UpdateMatchDto } from '../dto/update-match.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Match } from '../entities/match.entity';
import { League } from 'src/league/entities/league.entity';
import { User } from 'src/users/entities/user.entity';
import { MatchResponseDto, PlayerDto } from '../dto/response-match.dto';

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

  async create(createMatchDto: CreateMatchDto): Promise<MatchResponseDto> {
    this.validateStartTime(createMatchDto.startTime);
    this.validatePlayerCount(createMatchDto.teamOnePlayersIds, createMatchDto.teamTwoPlayersIds);
    this.validateDistinctPlayers(createMatchDto.teamOnePlayersIds, createMatchDto.teamTwoPlayersIds);
    await this.ensureAllPlayersExist([...createMatchDto.teamOnePlayersIds, ...createMatchDto.teamTwoPlayersIds])
    return await this.saveMatch(createMatchDto);
  }

  async findAll(): Promise<MatchResponseDto[]> {
    const matches = await this.matchRepository.find({
      relations: { league: true, teamOnePlayers: true, teamTwoPlayers: true },
    });
    return matches.map(match => this.transformToDto(match));
  }

  async findOne(id: string): Promise<MatchResponseDto> {
    const match = await this.matchRepository.findOne({
      where: { id: id },
      relations: { league: true, teamOnePlayers: true, teamTwoPlayers: true },
    });
    if (!match) throw new NotFoundException(`Match with id: ${id} not found`);
    return this.transformToDto(match);
  }

  async update(id: string, updateMatchDto: UpdateMatchDto): Promise<MatchResponseDto> {
    const { leagueId, teamOnePlayersIds, teamTwoPlayersIds, ...matchDetails } =
      updateMatchDto;
    this.validateStartTime(updateMatchDto.startTime);
    this.validatePlayerCount(updateMatchDto.teamOnePlayersIds, updateMatchDto.teamTwoPlayersIds);
    this.validateDistinctPlayers(updateMatchDto.teamOnePlayersIds, updateMatchDto.teamTwoPlayersIds);

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

      return this.transformToDto(matchUpdate);
    } catch (err) {
      this.handleExceptions(err);
    }
  }

  async remove(id: string): Promise<void> {
    const result = await this.matchRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Match with ID ${id} not found`);
    }
  }

  async findLeague(leagueId: string) {
    const league = await this.leagueRepository.findOne({
      where: { id: leagueId },
    });
    if (!league)
      throw new NotFoundException(`League with id: ${leagueId} not found`);
    return league;
  }

  private async getTeamsPlayers(
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


  private validateStartTime(startTime: Date) {
    if (startTime <= new Date()) {
      throw new BadRequestException('La hora de inicio debe ser en el futuro.');
    }
  }

  private validatePlayerCount(teamOnePlayersIds: string[], teamTwoPlayersIds: string[]) {
    const totalPlayers = teamOnePlayersIds.length + teamTwoPlayersIds.length;
    if (totalPlayers !== 4) {
      throw new BadRequestException('Debe haber exactamente 4 jugadores entre ambos equipos.');
    }
  }

  private validateDistinctPlayers(teamOnePlayersIds: string[], teamTwoPlayersIds: string[]) {
    const allPlayerIds = [...teamOnePlayersIds, ...teamTwoPlayersIds];
    const uniquePlayerIds = [...new Set(allPlayerIds)];

    if (allPlayerIds.length !== uniquePlayerIds.length) {
      throw new BadRequestException('Todos los jugadores deben ser distintos en ambos equipos.');
    }
  }

  private async ensureAllPlayersExist(playerIds: string[]): Promise<void> {
    const existingPlayers = await this.userRepository.find({
      where: { id: In(playerIds) },
    });
    if (existingPlayers.length !== playerIds.length) {
      throw new HttpException('Uno o más jugadores no existen.', HttpStatus.NOT_FOUND);
    }
  }

  private async saveMatch(createMatchDto: CreateMatchDto): Promise<MatchResponseDto> {
    const {
      leagueId,
      teamOnePlayersIds,
      teamTwoPlayersIds,
      ...matchDetails
    } = createMatchDto;

    const match = this.matchRepository.create({
      ...matchDetails,
      teamOnePlayers: [],
      teamTwoPlayers: [],
    });

    match.league = await this.findLeague(leagueId);
    const { teamOnePlayers, teamTwoPlayers } = await this.getTeamsPlayers(teamOnePlayersIds, teamTwoPlayersIds);

    match.teamOnePlayers = teamOnePlayers;
    match.teamTwoPlayers = teamTwoPlayers;

    await this.matchRepository.save(match);
    delete match.league
    return {
      ...match,
      teamOnePlayers: match.teamOnePlayers.map(this.mapPlayer),
      teamTwoPlayers: match.teamTwoPlayers.map(this.mapPlayer),
      leagueId
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

  private transformToDto(match: Match): MatchResponseDto {
    return {
      id: match.id,
      leagueId: match.league.id,
      startTime: match.startTime,
      isCompleted: match.isCompleted,
      isCancelled: match.isCancelled,
      teamOnePlayers: match.teamOnePlayers.map(player => this.mapPlayer(player)),
      teamTwoPlayers: match.teamTwoPlayers.map(player => this.mapPlayer(player)),
      setsWonByTeamOne: match.setsWonByTeamOne,
      setsWonByTeamTwo: match.setsWonByTeamTwo,
      gamesWonByTeamOne: match.gamesWonByTeamOne,
      gamesWonByTeamTwo: match.gamesWonByTeamTwo
    };
  }

  private mapPlayer(user: User): PlayerDto {
    return {
      id: user.id,
      name: user.name,
      surname: user.surname
    };
  }
}
