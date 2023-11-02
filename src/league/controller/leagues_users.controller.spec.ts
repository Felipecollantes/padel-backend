import { Test, TestingModule } from '@nestjs/testing';
import { LeagueUserService } from '../services/league_user/league_user.service';
import { LeagueUsersResponseDto } from '../dto/response-league_users.dto';
import { UserLeague } from '../entities/leagues_users.entity';
import { LeagueUserController } from './leagues_users.controller';
import { ConfigService } from '@nestjs/config';
import { PassportModule, AuthGuard } from '@nestjs/passport';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { User } from 'src/users/entities/user.entity';

describe('LeagueUserController', () => {
  let controller: LeagueUserController;
  let service: LeagueUserService;

  const userRepositoryMock = {
    findOneBy: jest.fn(),
  };

  const configServiceMock = {
    get: jest.fn((key) => (key === 'JWT_SECRET' ? 'mockSecret' : null)),
  };

  beforeEach(async () => {
    const mockLeagueUserService = {
      findLeaguesUsers: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeagueUserController],
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      providers: [
        {
          provide: LeagueUserService,
          useValue: mockLeagueUserService,
        },
        {
          provide: getRepositoryToken(User),
          useValue: userRepositoryMock,
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

    controller = module.get<LeagueUserController>(LeagueUserController);
    service = module.get<LeagueUserService>(LeagueUserService);
  });

  it('should call findLeaguesUsers method with expected param', async () => {
    const leagueUsersResponseArray: LeagueUsersResponseDto[] = []; // Replace with a populated array as needed.
    jest.spyOn(service, 'findLeaguesUsers').mockResolvedValue(leagueUsersResponseArray);
    const id = 'some-league-id';
    await expect(controller.findLeaguesUsers(id)).resolves.toEqual(leagueUsersResponseArray);
    expect(service.findLeaguesUsers).toHaveBeenCalledWith(id);
  });

  it('should call remove method with expected params', async () => {
    const userLeague: UserLeague = new UserLeague(); // Replace with a valid UserLeague instance.
    jest.spyOn(service, 'remove').mockResolvedValue(userLeague);
    const leaguesId = 'some-league-id';
    const usersId = 'some-user-id';
    await expect(controller.remove(leaguesId, usersId)).resolves.toEqual(userLeague);
    expect(service.remove).toHaveBeenCalledWith(leaguesId, usersId);
  });

  // Add more tests for different scenarios as needed.
});
