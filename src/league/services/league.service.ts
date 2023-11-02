import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLeagueDto } from '../dto/create-league.dto';
import { UpdateLeagueDto } from '../dto/update-league.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { League } from '../entities/league.entity';
import { In, Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { UserLeague } from '../entities/leagues_users.entity';
import { LeagueResponseDto } from '../dto/response-league.dto';
import { LeagueUsersResponseDto } from '../dto/response-league_users.dto';
import { Match } from 'src/matches/entities/match.entity';
import { MatchResponseDto, PlayerDto } from 'src/matches/dto/response-match.dto';

@Injectable()
export class LeagueService {
  constructor(
    @InjectRepository(League)
    private readonly leagueRepository: Repository<League>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserLeague)
    private readonly userLeagueRepository: Repository<UserLeague>,
  ) {}

  async create(createLeagueDto: CreateLeagueDto) {
    const league = await this.prepareLeagueForCreation(createLeagueDto);
    return this.leagueRepository.save(league);
  }

  async findAll(): Promise<LeagueResponseDto[]> {
    const leagues = await this.leagueRepository.find({
      relations: { matches: true },
    });
    console.log('leagues', leagues);
    return Promise.all(leagues.map((league) => this.mapLeagueToDTO(league)));
  }

  async findOne(param: string): Promise<LeagueResponseDto> {
    const league = isUUID(param) ? await this.findLeagueById(param) : await this.findLeagueByName(param);
    if (!league) throw new NotFoundException(`League with ${param} not found`);
    return this.mapLeagueToDTO(league);
  }

  async findLeagues(param: string): Promise<LeagueResponseDto[]> {
    const leagues: League[] = await this.findByName(param);
    if (leagues.length === 0) throw new NotFoundException(`No leagues found matching ${param}`);
    return Promise.all(leagues.map((league) => this.mapLeagueToDTO(league)));
  }

  async update(id: string, updateLeagueDto: UpdateLeagueDto): Promise<LeagueResponseDto> {
    const league = await this.prepareLeagueForUpdate(id, updateLeagueDto);
    await this.leagueRepository.save(league);
    return this.mapLeagueToDTO(league);
  }

  async remove(id: string): Promise<League> {
    const league = await this.findLeagueById(id);
    if (!league) throw new NotFoundException(`League with id: ${id} not found`);
    league.isActive = false;
    return this.leagueRepository.save(league);
  }
  private async prepareLeagueForCreation(dto: CreateLeagueDto): Promise<League> {
    const existingLeague = await this.leagueRepository.findOne({
      where: { name: dto.name },
    });
    if (existingLeague) throw new ConflictException('Ya existe una liga con este nombre.');

    const users = dto.participants ? await this.getUsersByIds(dto.participants) : [];
    return this.leagueRepository.create({ ...dto, participants: users });
  }

  private async prepareLeagueForUpdate(id: string, dto: UpdateLeagueDto): Promise<League> {
    const league = await this.findLeagueById(id);
    const users = dto.participants ? await this.getUsersByIds(dto.participants) : league.participants;
    return { ...league, ...dto, participants: users };
  }

  private async getUsersByIds(ids: string[]): Promise<User[]> {
    for (const id of ids) {
      if (!isUUID(id)) {
        throw new BadRequestException('El ID proporcionado no es válido.');
      }
    }
    const users = await this.userRepository.find({
      where: { id: In(ids) },
    });
    const foundIds = users.map((user) => user.id);
    const missingIds = ids.filter((id) => !foundIds.includes(id));

    if (missingIds.length) {
      throw new BadRequestException(`No se encontraron usuarios para los siguientes ID: ${missingIds.join(', ')}`);
    }
    return users;
  }

  private async findLeagueById(id: string): Promise<League> {
    return this.leagueRepository.findOne({
      where: { id: id },
      relations: ['participants', 'matches', 'matches.teamOnePlayers', 'matches.teamTwoPlayers'],
    });
  }

  private async findLeagueByName(name: string): Promise<League> {
    return this.leagueRepository
      .createQueryBuilder('league')
      .leftJoinAndSelect('league.participants', 'participants')
      .leftJoinAndSelect('league.matches', 'matches')
      .leftJoinAndSelect('matches.teamOnePlayers', 'teamOnePlayers')
      .leftJoinAndSelect('matches.teamTwoPlayers', 'teamTwoPlayers')
      .where('UPPER(league.name) ILIKE :name', {
        name: `%${name.toUpperCase()}%`,
      })
      .getOne();
  }

  private async mapLeagueToDTO(league: League): Promise<LeagueResponseDto> {
    const participants = await this.getAndMapParticipants(league);
    return {
      id: league.id,
      name: league.name,
      isActive: league.isActive,
      totalMatches: league.totalMatches,
      createdAt: league.createdAt,
      participants: participants,
      matches: league.matches.map((match) => this.transformToDto(match, league)),
    };
  }

  private async getAndMapParticipants(league: League): Promise<LeagueUsersResponseDto[]> {
    const userLeagues = await this.getUserLeaguesForLeague(league);
    return this.mapUserLeague(userLeagues);
  }

  private async getUserLeaguesForLeague(league: League): Promise<UserLeague[]> {
    return this.userLeagueRepository
      .createQueryBuilder('userLeague')
      .leftJoinAndSelect('userLeague.user', 'user')
      .where('userLeague.leaguesId = :leaguesId', { leaguesId: league.id })
      .orderBy('userLeague.points', 'DESC')
      .getMany();
  }

  private mapUserLeague(userLeague: UserLeague[]): LeagueUsersResponseDto[] {
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

  private async findByName(param: string): Promise<League[]> {
    const queryBuilder = this.leagueRepository.createQueryBuilder('league');

    return await queryBuilder
      .leftJoinAndSelect('league.participants', 'participants')
      .leftJoinAndSelect('league.matches', 'matches')
      .where('UPPER(league.name) ILIKE :name', {
        name: `%${param.toUpperCase()}%`,
      })
      .getMany();
  }

  /**
   * Transforms a match entity to a response DTO.
   * @param {Match} match - Match entity.
   * @returns {MatchResponseDto} - Transformed match data.
   */
  private transformToDto(match: Match, league: League): MatchResponseDto {
    return {
      id: match.id,
      leagueId: league.id,
      startTime: match.startTime,
      isCompleted: match.isCompleted,
      isCancelled: match.isCancelled,
      teamOnePlayers: match.teamOnePlayers.map((player) => this.mapPlayer(player)),
      teamTwoPlayers: match.teamTwoPlayers.map((player) => this.mapPlayer(player)),
      setsWonByTeamOne: match.setsWonByTeamOne,
      setsWonByTeamTwo: match.setsWonByTeamTwo,
      gamesWonByTeamOne: match.gamesWonByTeamOne,
      gamesWonByTeamTwo: match.gamesWonByTeamTwo,
    };
  }

  private mapPlayer(user: User): PlayerDto {
    return {
      id: user.id,
      name: user.name,
      surname: user.surname,
    };
  }
}
