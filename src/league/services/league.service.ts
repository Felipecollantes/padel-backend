import {
  BadRequestException, ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    const { participants, ...leagueDetails } = createLeagueDto;
    let users: User[] = [];
    const existingLeague = await this.leagueRepository.findOne({
      where: { name: leagueDetails.name }
    });
    if (existingLeague) {
      throw new ConflictException('Ya existe una liga con este nombre.');
    }
    if (participants && participants.length > 0) {
      users = await this.userRepository.find({
        where: { id: In(participants) },
        select:['id', 'email', 'name', 'surname', 'isActive', 'createdAt', 'lastLogin', 'elo', 'roles'],
      });

      if (users.length !== participants.length) {
        throw new BadRequestException('One or more participants not found');
      }
    }

    const league = this.leagueRepository.create({
      ...leagueDetails,
      participants: users.length > 0 ? users : [],
    });

    await this.leagueRepository.save(league);
  }

  async findAll(): Promise<LeagueResponseDto[]> {
    const leagues = await this.leagueRepository.find({
      relations: { participants: true },
    });

    return Promise.all(leagues.map(league => this.mapLeagueToDTO(league)));
  }

  private async mapLeagueToDTO(league: League): Promise<LeagueResponseDto> {
    const participants = await this.getAndMapParticipants(league);
    return {
      id: league.id,
      name: league.name,
      isActive: league.isActive,
      totalMatches: league.totalMatches,
      matchesWon: league.matchesWon,
      matchesTied: league.matchesTied,
      matchesLost: league.matchesLost,
      points: league.points,
      createdAt: league.createdAt,
      participants: participants
    };
  }

  private async getAndMapParticipants(league: League): Promise<LeagueUsersResponseDto[]> {
    const userLeagues = await this.getUserLeaguesForLeague(league);
    return this.mapUserLeague(userLeagues);
  }

  private async getUserLeaguesForLeague(league: League): Promise<UserLeague[]> {
    return this.userLeagueRepository.find({
      where: { leaguesId: league.id },
      relations: { user: true },
    });
  }


  /**
   * Method that returns a user searched for by an id or by a name
   * @param param id or name
   */
  async findOne(param: string): Promise<LeagueResponseDto> {
    let league: League;
    if (isUUID(param)) {
      league = await this.leagueRepository.findOne({
        where: { id: param },
        relations: { participants: true },
      });
    } else {
      league = await this.findOneByName(param);
    }

    if (!league) throw new NotFoundException(`League with ${param} not found`);

    const userLeague: UserLeague[] = await this.userLeagueRepository.find({
      where: { leaguesId: league.id },
      relations: { user: true },
    });

    return {
      ...league,
      participants: this.mapUserLeague(userLeague),
    };
  }

  mapUserLeague(userLeague: UserLeague[]): LeagueUsersResponseDto[] {
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

  async findLeagues(param: string): Promise<LeagueResponseDto[]> {
    let leagues: League[];
    leagues = await this.findByName(param);

    if (leagues.length === 0) {
      throw new NotFoundException(`No leagues found matching ${param}`);
    }

    return Promise.all(leagues.map(league => this.mapLeagueToDTO(league)));

  }

  async update(id: string, updateLeagueDto: UpdateLeagueDto): Promise<LeagueResponseDto> {
    const { participants, ...leagueDetails } = updateLeagueDto;
    const league = await this.findOne(id);

    if (!league) throw new NotFoundException(`League with id: ${id} not found`);

    let newParticipants: User[] = [];
    if (updateLeagueDto.participants) {
      newParticipants = await this.userRepository.find({
        where: { id: In(updateLeagueDto.participants) },
      });

      if (newParticipants.length !== participants.length) {
        throw new BadRequestException('One or more participants not found');
      }
    }

    const update = await this.leagueRepository.preload({
      id: id,
      participants:
        newParticipants.length > 0 ? newParticipants : league.participants,
      ...leagueDetails,
    });

    try {
      await this.leagueRepository.save(update);
      const userLeague: UserLeague[] = await this.userLeagueRepository.find({
        where: { leaguesId: league.id },
        relations: { user: true },
      });
      return {
        ...update,
        participants: this.mapUserLeague(userLeague),
      };
    } catch (err) {
      console.log('Error updating league', err);
    }
  }

  async remove(id: string): Promise<League> {
    const league = await this.leagueRepository.preload({
      id: id,
      isActive: false,
    });
    if (!league) throw new NotFoundException(`User with id: ${id} not found`);
    try {
      await this.leagueRepository.save(league);
      return league;
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * Method that returns a user searched for by name
   * @param param name
   */
  async findOneByName(param: string): Promise<League> {
    // Creates a new query builder that can be used to build a SQL query.
    const queryBuilder = this.leagueRepository.createQueryBuilder('league');
    // We handle the possibility of searching with spaces and in upper or lower case
    return await queryBuilder
      .leftJoinAndSelect('league.participants', 'participants')
      .where('UPPER(league.name) ILIKE :name', {
        name: `%${param.toUpperCase()}%`,
      })
      .getOne();
  }

  async findByName(param: string): Promise<League[]> {
    const queryBuilder = this.leagueRepository.createQueryBuilder('league');

    return await queryBuilder
      .leftJoinAndSelect('league.participants', 'participants')
      .where('UPPER(league.name) ILIKE :name', {
        name: `%${param.toUpperCase()}%`,
      })
      .getMany();
  }
}
