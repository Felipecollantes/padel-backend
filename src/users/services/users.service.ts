import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { validate as isUUID } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/shared/dtos/pagination.dto';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from 'src/auth/interfaces/jwt.payload.interface';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { CreateFriendshipDto } from '../dto/create-friendship.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger('UsersService');
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userDetails } = createUserDto;
      const user = this.userRepository.create({
        ...userDetails,
        password: bcrypt.hashSync(password, 10),
        createdAt: new Date().toISOString(),
        friendship: [],
      });
      await this.userRepository.save(user);
      delete user.password;

      return {
        ...user,
        token: this.getJwtToken({ id: user.id }),
      };
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    return this.userRepository.find({
      take: limit,
      skip: offset,
      select: ['id', 'email', 'name', 'surname', 'isActive', 'createdAt', 'lastLogin', 'elo', 'roles'],
      relations: { friendship: true },
    });
  }

  /**
   * Method that returns a user searched for by an id or by a name
   * @param param id or name
   */
  async findOne(param: string) {
    let user: User;
    if (isUUID(param)) {
      user = await this.userRepository.findOne({
        where: { id: param },
        select: ['id', 'email', 'name', 'surname', 'isActive', 'createdAt', 'lastLogin', 'elo', 'roles'],
        relations: { friendship: true },
      });
    } else {
      user = await this.findOneByName(param);
    }

    if (!user) throw new NotFoundException(`User with ${param} not found`);
    delete user.password;
    return user;
  }

  async findUsers(param: string) {
    let users: User[];

    if (isUUID(param)) {
      users = await this.userRepository.find({
        where: { id: param },
        select: ['id', 'email', 'name', 'surname', 'isActive', 'createdAt', 'lastLogin', 'elo', 'roles'],
        relations: { friendship: true },
      });
    } else {
      users = await this.findByName(param);
    }

    if (users.length === 0) throw new NotFoundException(`No users found matching ${param}`);
    return users;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { password, currentPassword, updateActive, updateElo, updateRoles, ...userDetails } = updateUserDto;
    const user = await this.userRepository.findOne({
      where: { id: id },
      relations: { friendship: true },
    });
    if (password && currentPassword) {
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);

      if (!isCurrentPasswordValid) {
        throw new BadRequestException('Current password is incorrect');
      }
    }
    const userUpdate = await this.userRepository.preload({
      id: id,
      password: password ? bcrypt.hashSync(password, 10) : user.password,
      isActive: updateActive,
      elo: updateElo,
      roles: updateRoles,
      ...userDetails,
    });
    try {
      await this.userRepository.save(userUpdate);
      return userUpdate;
    } catch (err) {
      this.handleExceptions(err);
    }
  }

  async createFriendship(createFriendshipDto: CreateFriendshipDto) {
    try {
      const [user, friend] = await Promise.all([
        this.findOne(createFriendshipDto.idUser),
        this.findOne(createFriendshipDto.idFriendship),
      ]);

      const updateUser = { ...user, friendship: [...user.friendship, friend] };
      const updateFriend = {
        ...friend,
        friendship: [...friend.friendship, user],
      };

      await Promise.all([this.update(updateUser.id, updateUser), this.update(updateFriend.id, updateFriend)]);
      return updateUser;
    } catch (err) {
      this.handleExceptions(err);
    }
  }

  async remove(id: string) {
    const user = await this.userRepository.preload({
      id: id,
      isActive: false,
    });
    if (!user) throw new NotFoundException(`User with id: ${id} not found`);
    try {
      await this.userRepository.save(user);
      return user;
    } catch (err) {
      this.handleExceptions(err);
    }
  }

  private handleExceptions(exceptions: any) {
    this.logger.error(exceptions);
    if (exceptions.code === '23505') {
      throw new BadRequestException(exceptions.detail);
    }
    if (exceptions.code === '23503') {
      throw new NotFoundException(`User not found`);
    }
  }

  /**
   * Method that returns a user searched for by name
   * @param param name
   */
  async findOneByName(param: string): Promise<User> {
    // Creates a new query builder that can be used to build a SQL query.
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    // We handle the possibility of searching with spaces and in upper or lower case
    return await queryBuilder
      .select([
        'user.id',
        'user.email',
        'user.name',
        'user.surname',
        'user.isActive',
        'user.createdAt',
        'user.lastLogin',
        'user.elo',
        'user.roles',
      ])
      .leftJoinAndSelect('user.friendship', 'friendship')
      .where('UPPER(user.name) ILIKE :name', {
        name: `%${param.toUpperCase()}%`,
      })
      .getOne();
  }

  async findByName(param: string): Promise<User[]> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    return await queryBuilder
      .select([
        'user.id',
        'user.email',
        'user.name',
        'user.surname',
        'user.isActive',
        'user.createdAt',
        'user.lastLogin',
        'user.elo',
        'user.roles',
      ])
      .leftJoinAndSelect('user.friendship', 'friendship')
      .where('UPPER(user.name) ILIKE :name', {
        name: `%${param.toUpperCase()}%`,
      })
      .getMany();
  }

  private getJwtToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    throw new InternalServerErrorException('Please check server log');
  }
}
