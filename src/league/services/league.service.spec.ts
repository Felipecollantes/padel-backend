import { Test, TestingModule } from '@nestjs/testing';
import { LeagueService } from './league.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { League } from '../entities/league.entity';
import { User } from 'src/users/entities/user.entity';
import { UserLeague } from '../entities/leagues_users.entity';
import { Repository } from 'typeorm';
import { CreateLeagueDto } from '../dto/create-league.dto';
import { Match } from 'src/matches/entities/match.entity';

describe('LeagueService', () => {
  let service: LeagueService;
  let leagueRepository: Repository<League>;
  /* eslint-disable @typescript-eslint/no-unused-vars */
  let userRepository: Repository<User>;
  let userLeagueRepository: Repository<UserLeague>;

  const player = new User();
  player.id = 'player-id';
  player.name = 'John';
  player.surname = 'Doe';

  const match = new Match();
  match.teamOnePlayers = [player, player];
  match.teamTwoPlayers = [player, player];

  const mockLeague = new League();
  mockLeague.matches = [match];

  const teamOnePlayers = [new User(), new User()];
  const teamTwoPlayers = [new User(), new User()];

  const mockMatches = [
    { ...new Match(), teamOnePlayers, teamTwoPlayers },
    { ...new Match(), teamOnePlayers, teamTwoPlayers },
  ];

  const mockLeagueRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockResolvedValue(new League()),
    findOne: jest.fn(),
    find: jest.fn().mockResolvedValue([{ ...new League(), matches: mockMatches }]),
    createQueryBuilder: jest.fn(() => ({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(undefined),
      getMany: jest.fn().mockResolvedValue([]),
    })),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
    find: jest.fn().mockResolvedValue([]),
    createQueryBuilder: jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([]),
    })),
  };

  const mockUserLeagueRepository = {
    findOne: jest.fn(),
    find: jest.fn().mockResolvedValue([]),
    createQueryBuilder: jest.fn(() => ({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([]),
    })),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeagueService,
        {
          provide: getRepositoryToken(League),
          useValue: mockLeagueRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(UserLeague),
          useValue: mockUserLeagueRepository,
        },
      ],
    }).compile();

    service = module.get<LeagueService>(LeagueService);
    leagueRepository = module.get(getRepositoryToken(League));
    userRepository = module.get(getRepositoryToken(User));
    userLeagueRepository = module.get(getRepositoryToken(UserLeague));
  });

  it('should successfully create a new league', async () => {
    const createLeagueDto = new CreateLeagueDto();
    createLeagueDto.name = 'New League';

    const mockLeague = new League();
    mockLeague.name = createLeagueDto.name;
    mockLeague.participants = [];

    jest.spyOn(leagueRepository, 'create').mockReturnValue(mockLeague);
    jest.spyOn(leagueRepository, 'save').mockResolvedValue(mockLeague);

    const result = await service.create(createLeagueDto);

    expect(result).toEqual(mockLeague);
    expect(leagueRepository.create).toHaveBeenCalledWith({
      ...createLeagueDto,
      participants: expect.any(Array),
    });
    expect(leagueRepository.save).toHaveBeenCalledWith(mockLeague);
  });

  // it('should return all leagues', async () => {
  //   // Crear objetos mock de League con la propiedad matches definida
  //   const mockLeagues = [
  //     { ...new League(), matches: [new Match()] }, // Asume que Match es una clase con constructor
  //     { ...new League(), matches: [new Match()] },
  //   ];

  //   jest.spyOn(leagueRepository, 'find').mockResolvedValue(mockLeagues);

  //   // Llamar al método findAll del servicio
  //   const result = await service.findAll();

  //   // Verificar que el resultado es un array y que el método find fue llamado
  //   expect(result).toEqual(expect.any(Array)); // Ajusta esta expectativa a lo que debería ser el resultado
  //   expect(leagueRepository.find).toHaveBeenCalled();
  // });

  it('should throw NotFoundException if no leagues are found', async () => {
    mockLeagueRepository.find.mockResolvedValue([]);

    await expect(service.findAll()).rejects.toThrow();
  });
});
