import { Test, TestingModule } from '@nestjs/testing';
import { MatchesService } from './matches.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateMatchDto } from '../dto/create-match.dto';
import { MatchResponseDto } from '../dto/response-match.dto';
import { League } from 'src/league/entities/league.entity';
import { UserLeague } from 'src/league/entities/leagues_users.entity';
import { User } from 'src/users/entities/user.entity';
import { Match } from '../entities/match.entity';

describe('MatchesService', () => {
  let service: MatchesService;
  let matchRepository: Repository<Match>;
  let leagueRepository: Repository<League>;
  let userRepository: Repository<User>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let userLeagueRepository: Repository<UserLeague>;

  const players = [
    {
      id: 'player-id-1',
      email: 'player1@example.com',
      password: 'hashedpassword',
      name: 'Player',
      surname: 'One',
      isActive: true,
      createdAt: new Date(),
      lastLogin: new Date(),
      elo: 1200,
      roles: ['user'],
      leagues: [],
      teamOneMatches: [],
      teamTwoMatches: [],
      friendship: [],
      // ... cualquier otra propiedad que necesites
    },
    {
      id: 'player-id-2',
      email: 'player2@example.com',
      password: 'hashedpassword',
      name: 'Player',
      surname: 'Two',
      isActive: true,
      createdAt: new Date(),
      lastLogin: new Date(),
      elo: 1200,
      roles: ['user'],
      leagues: [],
      teamOneMatches: [],
      teamTwoMatches: [],
      friendship: [],
      // ... cualquier otra propiedad que necesites
    },
    // ... más objetos User para cada jugador que necesites
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchesService,
        {
          provide: getRepositoryToken(Match),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(League),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(UserLeague),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<MatchesService>(MatchesService);
    matchRepository = module.get(getRepositoryToken(Match));
    leagueRepository = module.get(getRepositoryToken(League));
    userRepository = module.get(getRepositoryToken(User));
    userLeagueRepository = module.get(getRepositoryToken(UserLeague));

    const queryBuilderMock: Partial<SelectQueryBuilder<User>> = {
      where: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue(players),
      // Añade aquí otros métodos encadenados si son necesarios para tu prueba
    };

    userRepository.createQueryBuilder = jest.fn(() => queryBuilderMock as SelectQueryBuilder<User>);
  });

  it('should create a match and return match details', async () => {
    const createMatchDto = new CreateMatchDto();
    createMatchDto.leagueId = 'some-league-id';
    createMatchDto.teamOnePlayersIds = ['player-1', 'player-2'];
    createMatchDto.teamTwoPlayersIds = ['player-3', 'player-4'];
    createMatchDto.startTime = new Date(Date.now() + 86400000); // Fecha futura

    const match = new Match();
    match.league = new League();
    match.league.id = createMatchDto.leagueId;
    match.startTime = createMatchDto.startTime;
    match.teamOnePlayers = createMatchDto.teamOnePlayersIds.map((id) => {
      const user = new User();
      user.id = id;
      return user;
    });
    match.teamTwoPlayers = createMatchDto.teamTwoPlayersIds.map((id) => {
      const user = new User();
      user.id = id;
      return user;
    });

    jest.spyOn(matchRepository, 'create').mockReturnValue(match);
    jest.spyOn(matchRepository, 'save').mockResolvedValue(match);
    jest.spyOn(leagueRepository, 'findOne').mockResolvedValue(new League());
    jest.spyOn(userRepository, 'find').mockResolvedValue(match.teamOnePlayers.concat(match.teamTwoPlayers));

    const result = await service.create(createMatchDto);

    expect(result).toBeInstanceOf(MatchResponseDto);
    expect(result.leagueId).toBe(createMatchDto.leagueId);
    expect(result.teamOnePlayers.length).toBe(2);
    expect(result.teamTwoPlayers.length).toBe(2);
    expect(matchRepository.create).toHaveBeenCalledWith(expect.any(Object));
    expect(matchRepository.save).toHaveBeenCalledWith(expect.any(Match));
  });

  // otros tests...
});
