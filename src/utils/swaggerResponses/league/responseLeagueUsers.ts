import { LeagueUsersResponseDto } from '../../../league/dto/response-league_users.dto';

export const leagueUsersResponse = {
  status: 200,
  description: 'The list users from a league.',
  isArray: true,
  type: LeagueUsersResponseDto,
  example: [
    {
      usersId: '5ed08574-05e6-47ec-bc95-8e97aa271618',
      totalMatches: 0,
      matchesWon: 0,
      matchesTied: 0,
      matchesLost: 0,
      points: 0,
      email: 'pablotest@gmail.com',
      name: 'Pablo',
      surname: 'Testing password',
      isActive: true,
    },
    {
      usersId: '6934a8f8-a613-4eab-923b-404eedfaaa3f',
      totalMatches: 0,
      matchesWon: 0,
      matchesTied: 0,
      matchesLost: 0,
      points: 0,
      email: 'felipetest@gmail.com',
      name: 'Felipe',
      surname: 'Testing password',
      isActive: true,
    },
    {
      usersId: '506cdf67-010c-4c05-9c95-1c834f5ff484',
      totalMatches: 0,
      matchesWon: 0,
      matchesTied: 0,
      matchesLost: 0,
      points: 0,
      email: 'vicentetest@gmail.com',
      name: 'Vicente',
      surname: 'Testing password',
      isActive: true,
    },
    {
      usersId: '6dc29adb-517a-4a2d-ae36-0b96a4def775',
      totalMatches: 0,
      matchesWon: 0,
      matchesTied: 0,
      matchesLost: 0,
      points: 0,
      email: 'alejandrootest@gmail.com',
      name: 'Alejandro',
      surname: 'Testing password',
      isActive: true,
    },
  ],
};

export const leagueBadRequestResponse = {
  status: 400,
  description: 'Bad Request. The input data is invalid.',
};

export const leagueNotFoundResponse = {
  status: 404,
  description: 'League not found.',
};

export const leagueUsersApiResponse = [leagueUsersResponse, leagueBadRequestResponse, leagueNotFoundResponse];
