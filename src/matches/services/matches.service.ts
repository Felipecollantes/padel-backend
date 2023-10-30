import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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

// ------------------- Public Methods -------------------

  /**
   * Create a new match record.
   * @param {CreateMatchDto} createMatchDto - Match creation data.
   * @returns {Promise<MatchResponseDto>} - The created match data.
   */
  async create(createMatchDto: CreateMatchDto): Promise<MatchResponseDto> {
    await this.validateMatchDetails(createMatchDto);
    return await this.saveMatch(createMatchDto);
  }

  /**
   * Retrieve all matches.
   * @returns {Promise<MatchResponseDto[]>} - List of matches.
   */
  async findAll(): Promise<MatchResponseDto[]> {
    const matches = await this.matchRepository.find({
      relations: ['league', 'teamOnePlayers', 'teamTwoPlayers'],
    });
    return matches.map(match => this.transformToDto(match));
  }

  /**
   * Retrieve a single match by its ID.
   * @param {string} id - Match ID.
   * @returns {Promise<MatchResponseDto>} - Match data.
   * @throws {NotFoundException} - If the match is not found.
   */
  async findOne(id: string): Promise<MatchResponseDto> {
    const match = await this.matchRepository.findOne({
      where: { id: id },
      relations: { league: true, teamOnePlayers: true, teamTwoPlayers: true },
    });

    if (!match) {
      throw new NotFoundException('Partido no encontrado');
    }

    return this.transformToDto(match);
  }

  /**
   * Update an existing match.
   * @param {string} id - Match ID.
   * @param {UpdateMatchDto} updateMatchDto - Match update data.
   * @returns {Promise<MatchResponseDto>} - Updated match data.
   */
  async update(id: string, updateMatchDto: UpdateMatchDto): Promise<MatchResponseDto> {
    await this.validateMatchDetails(updateMatchDto);

    const { leagueId, teamOnePlayersIds, teamTwoPlayersIds, ...matchDetails } = updateMatchDto;
    const league = await this.findLeague(leagueId);
    const { teamOnePlayers, teamTwoPlayers } = await this.getTeamsPlayers(teamOnePlayersIds, teamTwoPlayersIds);

    const matchUpdate = await this.matchRepository.preload({
      id,
      league,
      teamOnePlayers,
      teamTwoPlayers,
      ...matchDetails,
    });

    try {
      await this.matchRepository.save(matchUpdate);
      return this.transformToDto(matchUpdate);
    } catch (err) {
      this.handleExceptions(err);
    }
  }

  /**
   * Remove a match by its ID.
   * @param {string} id - Match ID.
   * @throws {NotFoundException} - If the match is not found.
   */
  async remove(id: string): Promise<void> {
    const result = await this.matchRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Partido no encontrado');
    }
  }




  async findLeague(leagueId: string) {
    const league = await this.leagueRepository.findOne({
      where: { id: leagueId },
    });
    if (!league)
      throw new NotFoundException('Liga no encontrada');
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
      throw new NotFoundException(`Usuario no encontrado`);
    }
  }



  private mapPlayer(user: User): PlayerDto {
    return {
      id: user.id,
      name: user.name,
      surname: user.surname
    };
  }







  // ------------------- Validation Methods -------------------

  /**
   * Validates provided match details.
   * @param {CreateMatchDto | UpdateMatchDto} dto - Match data.
   */
  private async validateMatchDetails(dto: CreateMatchDto | UpdateMatchDto): Promise<void> {
    this.validateStartTime(dto.startTime);
    this.validatePlayerCount(dto.teamOnePlayersIds, dto.teamTwoPlayersIds);
    this.validateDistinctPlayers(dto.teamOnePlayersIds, dto.teamTwoPlayersIds);
    await this.ensureAllPlayersExist(...dto.teamOnePlayersIds, ...dto.teamTwoPlayersIds);
  }

  /**
   * Validates that the start time of a match is in the future.
   * @param {Date} startTime - Proposed start time for the match.
   * @throws {BadRequestException} - If time isn't in the future.
   */
  private validateStartTime(startTime: Date): void {
    if (startTime <= new Date()) {
      throw new BadRequestException('La hora de inicio debe ser en el futuro.');
    }
  }

  /**
   * Validates the total count of players between both teams.
   * @param {string[]} teamOnePlayersIds - Team one player IDs.
   * @param {string[]} teamTwoPlayersIds - Team two player IDs.
   * @throws {BadRequestException} - If total player count isn't 4.
   */
  private validatePlayerCount(teamOnePlayersIds: string[], teamTwoPlayersIds: string[]): void {
    const totalPlayers = teamOnePlayersIds.length + teamTwoPlayersIds.length;
    if (totalPlayers !== 4) {
      throw new BadRequestException('Debe haber exactamente 4 jugadores entre ambos equipos');
    }
  }

  /**
   * Validates that players are unique between both teams.
   * @param {string[]} teamOnePlayersIds - Team one player IDs.
   * @param {string[]} teamTwoPlayersIds - Team two player IDs.
   * @throws {BadRequestException} - If players are not distinct between teams.
   */
  private validateDistinctPlayers(teamOnePlayersIds: string[], teamTwoPlayersIds: string[]): void {
    const allPlayerIds = [...teamOnePlayersIds, ...teamTwoPlayersIds];
    const uniquePlayerIds = [...new Set(allPlayerIds)];
    if (allPlayerIds.length !== uniquePlayerIds.length) {
      throw new BadRequestException('Todos los jugadores deben ser distintos entre equipos');
    }
  }

  // ------------------- Helper Methods -------------------

  /**
   * Ensure all provided player IDs exist.
   * @param {...string[]} playerIds - Player IDs.
   * @throws {NotFoundException} - If one or more players don't exist.
   */
  private async ensureAllPlayersExist(...playerIds: string[]): Promise<void> {
    const existingPlayers = await this.userRepository.find({
      where: { id: In(playerIds) },
    });
    if (existingPlayers.length !== playerIds.length) {
      throw new NotFoundException('Uno o más jugadores no existen');
    }
  }

  /**
   * Transforms a match entity to a response DTO.
   * @param {Match} match - Match entity.
   * @returns {MatchResponseDto} - Transformed match data.
   */
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
}
