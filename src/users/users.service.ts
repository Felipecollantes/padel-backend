import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { validate as isUUID } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/shared/dtos/pagination.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from 'src/auth/interfaces/jwt.payload.interface';
import { JwtService } from '@nestjs/jwt';

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
      const { friendship = [], password, ...userDetails } = createUserDto;
      const user = this.userRepository.create({
        ...userDetails,
        password: bcrypt.hashSync(password, 10),
        friendship: friendship.map((user) => user),
      });
      await this.userRepository.save(user);
      delete user.password;
      // await this.insertNewFriendShip(user);

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
        relations: { friendship: true },
      });
    } else {
      user = await this.findOneByName(param);
    }

    if (!user) throw new NotFoundException(`User with ${param} not found`);
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.preload({
      id: id,
      ...updateUserDto,
    });
    if (!user) throw new NotFoundException(`User with id: ${id} not found`);

    try {
      await this.userRepository.save(user);
      return user;
    } catch (err) {
      this.handleExceptions(err);
    }
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
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
      .leftJoinAndSelect('user.friendship', 'friendship')
      // .leftJoinAndSelect('user.comments', 'comments')
      .where('UPPER(user.name) =:name', {
        name: param.toUpperCase(),
      })
      .getOne();
  }

  // async insertNewFriendShip(user: User) {
  //   if (user && user.friendship.length > 0) {
  //     for (const friend of user.friendship) {
  //       try {
  //         let userFriend = await this.findOne(friend.id);
  //         // if (!userFriend)
  //         //   throw new NotFoundException(`User with ${friend.id} not found`);
  //         userFriend = {
  //           ...userFriend,
  //           friendship: [...userFriend.friendship, user],
  //         };
  //         await this.update(friend.id, userFriend);
  //       } catch (e) {
  //         this.logger.error(e);
  //       }
  //     }
  //   }
  // }

  private getJwtToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    console.log(error);
    throw new InternalServerErrorException('Please check server log');
  }
}
