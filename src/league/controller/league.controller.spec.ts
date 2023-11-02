import { Test, TestingModule } from '@nestjs/testing';
import { LeagueController } from './league.controller';
import { LeagueService } from '../services/league.service';
import { CreateLeagueDto } from '../dto/create-league.dto';
import { UpdateLeagueDto } from '../dto/update-league.dto';
import { LeagueResponseDto } from '../dto/response-league.dto';
import { AuthGuard, PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { ConfigService } from '@nestjs/config';

describe('LeagueController', () => {
  let controller: LeagueController;
  let service: LeagueService;
  type MockLeagueService = {
    [P in keyof LeagueService]: jest.Mock;
  };

  const userRepositoryMock = {
    findOneBy: jest.fn(),
  };

  const configServiceMock = {
    get: jest.fn((key) => (key === 'JWT_SECRET' ? 'mockSecret' : null)),
  };

  const mockLeagueService: MockLeagueService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findLeagues: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [LeagueController],
      providers: [
        {
          provide: getRepositoryToken(User),
          useValue: userRepositoryMock,
        },
        {
          provide: LeagueService,
          useValue: mockLeagueService,
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

    controller = module.get<LeagueController>(LeagueController);
    service = module.get<LeagueService>(LeagueService);
  });

  it('should call create method with expected params', async () => {
    const createDto = new CreateLeagueDto();
    await controller.create(createDto);
    expect(service.create).toHaveBeenCalledWith(createDto);
  });

  it('should call findAll method and return an array of leagues', async () => {
    const leagueResponseArray: LeagueResponseDto[] = [];
    mockLeagueService.findAll.mockResolvedValue(leagueResponseArray);
    expect(await controller.findAll()).toBe(leagueResponseArray);
  });

  it('should call findOne method with expected param', async () => {
    const leagueResponse = new LeagueResponseDto();
    mockLeagueService.findOne.mockResolvedValue(leagueResponse);
    const param = 'some-id';
    expect(await controller.findOne(param)).toBe(leagueResponse);
    expect(service.findOne).toHaveBeenCalledWith(param);
  });

  it('should call findLeagues method with expected name', async () => {
    const leagueResponseArray: LeagueResponseDto[] = [];
    mockLeagueService.findLeagues.mockResolvedValue(leagueResponseArray);
    const name = 'league-name';
    expect(await controller.findLeagues(name)).toBe(leagueResponseArray);
    expect(service.findLeagues).toHaveBeenCalledWith(name);
  });

  it('should call update method with expected params', async () => {
    const id = 'some-id';
    const updateDto = new UpdateLeagueDto();
    const leagueResponse = new LeagueResponseDto();

    mockLeagueService.update.mockResolvedValue(leagueResponse);
    const result = await controller.update(id, updateDto);

    expect(result).toBe(leagueResponse);
    expect(mockLeagueService.update).toHaveBeenCalledWith(id, updateDto);
  });

  it('should call remove method with expected id', async () => {
    const leagueResponse = new LeagueResponseDto();
    mockLeagueService.remove.mockResolvedValue(leagueResponse);
    const id = 'some-id';
    expect(await controller.remove(id)).toBe(leagueResponse);
    expect(service.remove).toHaveBeenCalledWith(id);
  });
});
