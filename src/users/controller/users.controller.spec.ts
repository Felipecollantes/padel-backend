import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from '../services/users.service';

import { AuthGuard, PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { INestApplication } from '@nestjs/common';
import { PaginationDto } from 'src/shared/dtos/pagination.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let service: UsersService;
  let app: INestApplication;

  // Mock data
  // const mockUsers = [{ id: '1', email: 'test@example.com', name: 'Test User', surname: 'User' }];

  // type MockUserService = {
  //   [P in keyof UsersService]: jest.Mock;
  // };

  // Mock service methods
  // const mockUsersService = {
  //   create: jest.fn().mockImplementation((dto: CreateUserDto) => Promise.resolve({ id: '1', ...dto })),
  //   createFriendship: jest.fn().mockImplementation((dto: CreateFriendshipDto) => Promise.resolve({ ...dto })),
  //   findAll: jest.fn().mockImplementation(() => Promise.resolve(mockUsers)),
  //   findOne: jest
  //     .fn()
  //     .mockImplementation((param: string) => Promise.resolve(mockUsers.find((user) => user.id === param))),
  //   findUsers: jest.fn().mockImplementation(() => Promise.resolve(mockUsers)),
  //   update: jest
  //     .fn()
  //     .mockImplementation((id: string, dto: UpdateUserDto) =>
  //       Promise.resolve({ ...mockUsers.find((user) => user.id === id), ...dto }),
  //     ),
  //   remove: jest.fn().mockImplementation((id: string) => Promise.resolve({ id })),
  // };

  const configServiceMock = {
    get: jest.fn((key) => (key === 'JWT_SECRET' ? 'mockSecret' : null)),
  };

  const userRepositoryMock = {
    findOneBy: jest.fn(),
  };

  const mockUserService = {
    create: jest.fn(),
    createFriendship: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findUsers: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [UsersController],
      providers: [
        {
          provide: getRepositoryToken(User),
          useValue: userRepositoryMock,
        },
        {
          provide: UsersService,
          useValue: mockUserService,
        },
        {
          provide: ConfigService,
          useValue: configServiceMock,
        },
        JwtStrategy,
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({ canActivate: () => true })
      .compile();

    app = module.createNestApplication();
    await app.init();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Add tests for each endpoint
  it('should call create method with expected params', async () => {
    const createUserDto: CreateUserDto = {
      email: 'test@example.com',
      password: 'Test@1234',
      name: 'Test',
      surname: 'User',
    };

    await controller.create(createUserDto);
    expect(service.create).toHaveBeenCalledWith(createUserDto);
  });

  it('should call findAll method and return an array of leagues', async () => {
    const userResponseArray: User[] = [];
    const paginationDto = new PaginationDto();
    paginationDto.offset = 1;
    paginationDto.limit = 10;
    mockUserService.findAll.mockResolvedValue(userResponseArray);
    expect(await controller.findAll(paginationDto)).toBe(userResponseArray);
  });

  it('should call findOne method with expected param (ID)', async () => {
    const responseUserDto = new User();
    mockUserService.findOne.mockResolvedValue(responseUserDto);
    const param = '1';
    expect(await controller.findOne(param)).toBe(responseUserDto);
    expect(service.findOne).toHaveBeenCalledWith(param);
  });

  it('should call findOne method with expected param (NAME)', async () => {
    const responseUserDto = new User();
    mockUserService.findOne.mockResolvedValue(responseUserDto);
    const param = 'Felipe';
    expect(await controller.findOne(param)).toBe(responseUserDto);
    expect(service.findOne).toHaveBeenCalledWith(param);
  });

  it('should call findUsers method with expected param (NAME)', async () => {
    const responseUserDto = new User();
    mockUserService.findUsers.mockResolvedValue(responseUserDto);
    const param = 'Felipe';
    expect(await controller.findUsers(param)).toBe(responseUserDto);
    expect(service.findUsers).toHaveBeenCalledWith(param);
  });

  it('should call update method with expected params', async () => {
    const updateUserDto: UpdateUserDto = {
      email: 'updated@example.com',
      password: 'NewPass123!',
      name: 'UpdatedName',
      surname: 'UpdatedSurname',
      currentPassword: 'CurrentPass123!',
      updateActive: true,
      updateElo: 1500,
      updateRoles: ['user', 'admin'],
    };
    mockUserService.update.mockResolvedValue(updateUserDto);
    const param = 'Felipe';
    expect(await controller.update(param, updateUserDto)).toBe(updateUserDto);
    expect(service.update).toHaveBeenCalledWith(param, updateUserDto);
  });

  it('should call remove method with expected param (ID)', async () => {
    const user = {
      id: 'cf51f8f4-3e2c-46ed-aaa2-b291e749c169',
      email: 'felipetest@gmail.com',
      name: 'Felipe',
      surname: 'test',
      isActive: true,
      createdAt: new Date(),
      lastLogin: new Date(),
      elo: 1200,
      roles: ['user'],
      friendship: [],
    };
    mockUserService.remove.mockResolvedValue(user);
    const param = '1';
    expect(await controller.remove(param)).toBe(user);
    expect(service.remove).toHaveBeenCalledWith(param);
  });
});
