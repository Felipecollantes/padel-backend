import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserLeague } from '../../entities/leagues_users.entity';
import { Repository } from 'typeorm';
import { LeagueUserService } from './league_user.service';
import { NotFoundException } from '@nestjs/common';

describe('LeagueUserService', () => {
  let service: LeagueUserService;
  let repository: Repository<UserLeague>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        LeagueUserService,
        {
          provide: getRepositoryToken(UserLeague),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<LeagueUserService>(LeagueUserService);
    repository = module.get<Repository<UserLeague>>(getRepositoryToken(UserLeague));
  });

  // TODO ARREGLAR ESTE

  // it('findLeaguesUsers should return an array of LeagueUsersResponseDto', async () => {
  //   const userLeagueArray: UserLeague[] = [
  //     {
  //       leaguesId: 'a22044aa-7d9b-4315-b712-aa8c4ddc3658',
  //       usersId: 'cf51f8f4-3e2c-46ed-aaa2-b291e749c169',
  //       totalMatches: 0,
  //       matchesWon: 0,
  //       matchesTied: 0,
  //       matchesLost: 0,
  //       points: 0,
  //       isActive: false,
  //     },
  //     {
  //       usersId: 'e9534d48-6645-4e0b-aa7d-1c88acef8992',
  //       totalMatches: 0,
  //       matchesWon: 0,
  //       matchesTied: 0,
  //       matchesLost: 0,
  //       points: 0,
  //       email: 'pablotest@gmail.com',
  //       name: 'Pablo',
  //       surname: 'test',
  //       isActive: true,
  //     },
  //     {
  //       usersId: '0e69c93a-9a7f-4578-9035-8849e531b3c9',
  //       totalMatches: 0,
  //       matchesWon: 0,
  //       matchesTied: 0,
  //       matchesLost: 0,
  //       points: 0,
  //       email: 'vicentetest@gmail.com',
  //       name: 'Vicente',
  //       surname: 'test',
  //       isActive: true,
  //     },
  //     {
  //       usersId: '0a145bab-3591-4645-a1f2-45e859336fee',
  //       totalMatches: 0,
  //       matchesWon: 0,
  //       matchesTied: 0,
  //       matchesLost: 0,
  //       points: 0,
  //       email: 'aljeandrotest@gmail.com',
  //       name: 'Alejandro',
  //       surname: 'test',
  //       isActive: true,
  //     },
  //   ];
  //   jest.spyOn(repository, 'find').mockResolvedValueOnce(userLeagueArray);

  //   const result = await service.findLeaguesUsers('existing-league-id');
  //   expect(result).toBeInstanceOf(Array);
  //   expect(result).toHaveLength(userLeagueArray.length);
  //   console.log(repository);
  //   expect(repository.find).toHaveBeenCalledWith({
  //     where: { leaguesId: 'existing-league-id' },
  //     relations: { user: true },
  //   });
  // });

  it('remove should deactivate a userLeague and return it', async () => {
    const userLeague = new UserLeague(); // Aquí debes crear tu instancia de UserLeague para la prueba
    jest.spyOn(repository, 'findOne').mockResolvedValueOnce(userLeague);
    jest.spyOn(repository, 'save').mockResolvedValueOnce(userLeague);

    const result = await service.remove('fb00f78d-a930-45b9-b810-9f12f7ea6596', 'fb00f78d-a930-45b9-b810-9f12f7ea6595');
    expect(result).toEqual(userLeague);
    expect(userLeague.isActive).toBeFalsy();
    expect(repository.findOne).toHaveBeenCalledWith({
      where: { usersId: 'fb00f78d-a930-45b9-b810-9f12f7ea6595', leaguesId: 'fb00f78d-a930-45b9-b810-9f12f7ea6596' },
    });
    expect(repository.save).toHaveBeenCalledWith(userLeague);
  });

  it('findLeaguesUsers should throw NotFoundException if league does not exist', async () => {
    jest.spyOn(repository, 'find').mockResolvedValueOnce([]);

    await expect(service.findLeaguesUsers('non-existent-league-id')).rejects.toThrow(NotFoundException);
  });

  it('remove should throw NotFoundException if userLeague does not exist', async () => {
    jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

    await expect(service.remove('non-existent-leagues-id', 'some-users-id')).rejects.toThrow(NotFoundException);
  });

  // Esta prueba asume que has configurado una base de datos en memoria para pruebas de integración
  // it('remove should also remove related entities if cascade is set to true', async () => {
  //   // Suponiendo que tienes métodos de ayuda para crear datos en la base de datos de prueba
  //   const league = await helperCreateLeagueWithParticipantsAndMatches();

  //   await service.remove(league.id, league.participants[0].id);

  //   // Verifica que las relaciones también se hayan eliminado
  //   const relatedMatches = await matchRepository.find({ where: { leagueId: league.id } });
  //   expect(relatedMatches).toHaveLength(0);

  //   const remainingParticipants = await userLeagueRepository.find({ where: { leaguesId: league.id } });
  //   expect(remainingParticipants).not.toContain(league.participants[0]);
  // });

  it('mapAll should properly map UserLeague entities to LeagueUsersResponseDto', () => {
    const userLeagues = [
      // Crea instancias de UserLeague con datos de prueba
    ];
    const dtos = service.mapAll(userLeagues);

    // Verifica que la asignación sea correcta
    dtos.forEach((dto, index) => {
      expect(dto.usersId).toBe(userLeagues[index].usersId);
      expect(dto.email).toBe(userLeagues[index].user.email);
      // Añade más expectativas según sea necesario
    });
  });
});
