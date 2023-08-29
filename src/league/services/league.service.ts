import {
  BadRequestException,
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

@Injectable()
export class LeagueService {
  constructor(
    @InjectRepository(League)
    private readonly leagueRepository: Repository<League>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createLeagueDto: CreateLeagueDto) {
    try {
      const { participants, ...leagueDetails } = createLeagueDto;
      const league = this.leagueRepository.create({
        ...leagueDetails,
        participants: [],
      });
      if (participants && participants.length > 0) {
        const users = await this.userRepository.find({
          where: { id: In(participants) },
        });

        if (users.length !== participants.length) {
          throw new BadRequestException('One or more participants not found');
        }

        league.participants = users;
      }

      await this.leagueRepository.save(league);
      return league;
    } catch (error) {
      console.log('error league', error);
    }
  }

  findAll() {
    return this.leagueRepository.find({
      relations: { participants: true },
    });
  }

  /**
   * Method that returns a user searched for by an id or by a name
   * @param param id or name
   */
  async findOne(param: string) {
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
    return league;
  }

  async findLeagues(param: string) {
    let leagues: League[];

    if (isUUID(param)) {
      leagues = await this.leagueRepository.find({
        where: { id: param },
        relations: { participants: true },
      });
    } else {
      leagues = await this.findByName(param);
    }

    if (leagues.length === 0)
      throw new NotFoundException(`No leagues found matching ${param}`);
    return leagues;
  }

  async update(id: string, updateLeagueDto: UpdateLeagueDto) {
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
      return update;
    } catch (err) {
      console.log('Error updating league', err);
    }
  }

  async remove(id: string) {
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
