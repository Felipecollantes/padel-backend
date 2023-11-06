import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';
import { NotFoundException } from '@nestjs/common';

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<any, any>;
};

describe('UsersService', () => {
  let usersService: UsersService;
  let userRepositoryMock: MockType<Repository<User>>;
  let jwtServiceMock: MockType<JwtService>;

  const mockUser = {
    id: 'uuid-1',
    email: 'user1@example.com',
    name: 'User',
    surname: 'One',
    isActive: true,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    elo: 1000,
    roles: ['user'],
    friendship: [],
    leagues: [],
    teamOneMatches: [],
    teamTwoMatches: [],
  };

  const repositoryMockFactory: () => MockType<Repository<User>> = jest.fn(() => ({
    findOne: jest.fn().mockResolvedValue(undefined),
    find: jest.fn().mockResolvedValue([]),
    create: jest.fn().mockReturnValue({}),
    save: jest.fn().mockResolvedValue(undefined as unknown as User),
    createQueryBuilder: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(undefined),
    })),
    preload: jest.fn().mockImplementation((userData) => {
      if (userData.id === 'non-existing-id') {
        return null;
      }
      return {
        ...mockUser,
        password: 'hashed-password',
      };
    }),
  }));

  const jwtServiceMockFactory: () => MockType<JwtService> = jest.fn(() => ({
    sign: jest.fn(() => 'mocked-jwt-token'),
  }));

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
        {
          provide: JwtService,
          useFactory: jwtServiceMockFactory,
        },
      ],
    }).compile();

    usersService = moduleRef.get<UsersService>(UsersService);
    userRepositoryMock = moduleRef.get(getRepositoryToken(User));
    jwtServiceMock = moduleRef.get(JwtService);
  });

  it('should create a new user and return the created user data with a token', async () => {
    const createUserDto: CreateUserDto = {
      email: 'felipetest@example.com',
      password: 'Test1234!',
      name: 'Felipe',
      surname: 'Test',
    };

    const expectedUser: Partial<User> = {
      id: 'some-uuid',
      email: createUserDto.email,
      name: createUserDto.name,
      surname: createUserDto.surname,
      isActive: true,
      createdAt: new Date(),
      lastLogin: null,
      elo: 1200,
      roles: ['user'],
      friendship: [],
      leagues: [],
      teamOneMatches: [],
      teamTwoMatches: [],
    };
    userRepositoryMock.create.mockReturnValue({
      ...expectedUser,
      password: await bcrypt.hash(createUserDto.password, 10),
    });
    userRepositoryMock.save.mockResolvedValue(expectedUser);
    jwtServiceMock.sign.mockReturnValue('some-token');
    const result = await usersService.create(createUserDto);
    expect(result).toEqual({
      ...expectedUser,
      token: 'some-token',
    });
    expect(userRepositoryMock.create).toHaveBeenCalledWith({
      ...createUserDto,
      password: expect.any(String),
      createdAt: expect.any(String),
      friendship: [],
    });

    expect(userRepositoryMock.save).toHaveBeenCalledWith({
      ...expectedUser,
    });

    expect(jwtServiceMock.sign).toHaveBeenCalledWith({
      id: 'some-uuid',
    });
  });

  it('should return a paginated list of users', async () => {
    const mockUsers = [
      {
        id: 'uuid-1',
        email: 'user1@example.com',
        name: 'User',
        surname: 'One',
        isActive: true,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        elo: 1000,
        roles: ['user'],
        friendship: [],
        leagues: [],
        teamOneMatches: [],
        teamTwoMatches: [],
      },
      {
        id: 'uuid-2',
        email: 'user2@example.com',
        name: 'User',
        surname: 'Two',
        isActive: true,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        elo: 1100,
        roles: ['user'],
        friendship: [],
        leagues: [],
        teamOneMatches: [],
        teamTwoMatches: [],
      },
    ];

    userRepositoryMock.find.mockResolvedValue(mockUsers);

    const paginationDto = { limit: 10, offset: 0 };
    const result = await usersService.findAll(paginationDto);

    expect(result).toHaveLength(mockUsers.length);
    expect(userRepositoryMock.find).toHaveBeenCalledWith({
      take: paginationDto.limit,
      skip: paginationDto.offset,
      select: ['id', 'email', 'name', 'surname', 'isActive', 'createdAt', 'lastLogin', 'elo', 'roles'],
      relations: { friendship: true },
    });
  });

  it('should return a single user by id', async () => {
    const mockUser = {
      id: 'uuid-1',
      email: 'user1@example.com',
      name: 'User',
      surname: 'One',
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      elo: 1000,
      roles: ['user'],
      friendship: [],
      leagues: [],
      teamOneMatches: [],
      teamTwoMatches: [],
    };

    userRepositoryMock.createQueryBuilder.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(mockUser), // Asume que mockUser es el usuario que esperas obtener
    });

    const result = await usersService.findOne('uuid-1');

    expect(result).toEqual(mockUser);
    // expect(userRepositoryMock.findOne).toHaveBeenCalledWith({
    //   where: { id: 'uuid-1' },
    //   select: ['id', 'email' /* ... otros campos */],
    //   relations: { friendship: true },
    // });
  });

  it('should throw NotFoundException if user is not found', async () => {
    userRepositoryMock.createQueryBuilder.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(null), // Devuelve null para simular que no se encontró al usuario
    });

    // Espera que se lance la excepción
    await expect(usersService.findOne('non-existing-id')).rejects.toThrow(NotFoundException);
  });

  it('should update a user successfully', async () => {
    const updateUserDto = {
      name: 'UpdatedName',
      id: 'uuid-1',
      email: 'user1@example.com',
      surname: 'One',
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      elo: 1000,
      roles: ['user'],
      friendship: [],
      leagues: [],
      teamOneMatches: [],
      teamTwoMatches: [],
    };
    const mockUser = {
      id: 'uuid-1',
      email: 'user1@example.com',
      name: 'User',
      surname: 'One',
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      elo: 1000,
      roles: ['user'],
      friendship: [],
      leagues: [],
      teamOneMatches: [],
      teamTwoMatches: [],
    };
    userRepositoryMock.preload.mockImplementation(async (userData) => {
      console.log('preload called with:', userData);
    });

    userRepositoryMock.preload.mockResolvedValue({
      ...mockUser,
      password: 'hashed-password',
    });

    // userRepositoryMock.preload.mockResolvedValue({
    //   ...mockUser,
    //   ...updateUserDto,
    //   // password: 'hashed-password',
    // // });
    // userRepositoryMock.save.mockResolvedValue({ ...mockUser, ...updateUserDto });

    // const result = await usersService.update('uuid-1', updateUserDto);

    // expect(result).toEqual({ ...mockUser, ...updateUserDto });
    // expect(userRepositoryMock.preload).toHaveBeenCalledWith({ id: 'uuid-1', ...updateUserDto });
    // expect(userRepositoryMock.save).toHaveBeenCalledWith({ ...mockUser, ...updateUserDto });
    const result = await usersService.update(mockUser.id, updateUserDto);

    expect(result).toEqual({ ...mockUser, ...updateUserDto });
    expect(userRepositoryMock.preload).toHaveBeenCalledWith({ id: mockUser.id, ...updateUserDto });
    expect(userRepositoryMock.save).toHaveBeenCalledWith({ ...mockUser, ...updateUserDto });
  });

  // it('should throw NotFoundException if user to update does not exist', async () => {
  //   // userRepositoryMock.preload.mockImplementation(async (userData) => {
  //   //   if (userData.id === 'non-existing-id') {
  //   //     return null;
  //   //   } else {
  //   //     return { ...mockUser, password: 'hashed-password' };
  //   //   }
  //   // });
  //   userRepositoryMock.preload.mockResolvedValue(null);

  //   await expect(usersService.update('non-existing-id', {})).rejects.toThrow(NotFoundException);
  // });
});
