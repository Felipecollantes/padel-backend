import { MatchResponseDto } from '../../../matches/dto/response-match.dto';
import { LeagueResponseDto } from '../../../league/dto/response-league.dto';

export const matchCreatedResponse = {
  status: 201,
  description: 'The match has been successfully created.',
  type: MatchResponseDto,
  example: {
    id: '3934e2aa-ed15-43ae-8d0d-2e0ca4cf2252',
    leagueId: '18b0618f-1bf1-4106-993c-8b23d1cd356f',
    startTime: '2023-12-29T17:09:49.000Z',
    isCompleted: false,
    isCancelled: false,
    teamOnePlayers: [
      {
        id: '5ed08574-05e6-47ec-bc95-8e97aa271618',
        name: 'Pablo',
        surname: 'Testing password',
      },
      {
        id: '506cdf67-010c-4c05-9c95-1c834f5ff484',
        name: 'Vicente',
        surname: 'Testing password',
      },
    ],
    teamTwoPlayers: [
      {
        id: '6dc29adb-517a-4a2d-ae36-0b96a4def775',
        name: 'Alejandro',
        surname: 'Testing password',
      },
      {
        id: '506cdf67-010c-4c05-9c95-1c834f5ff484',
        name: 'Vicente',
        surname: 'Testing password',
      },
    ],
    setsWonByTeamOne: 0,
    setsWonByTeamTwo: 0,
    gamesWonByTeamOne: 0,
    gamesWonByTeamTwo: 0,
  },
};

export const matchResponse = {
  status: 200,
  description: 'The match',
  type: MatchResponseDto,
  example: {
    id: '3934e2aa-ed15-43ae-8d0d-2e0ca4cf2252',
    leagueId: '18b0618f-1bf1-4106-993c-8b23d1cd356f',
    startTime: '2023-12-29T17:09:49.000Z',
    isCompleted: false,
    isCancelled: false,
    teamOnePlayers: [
      {
        id: '5ed08574-05e6-47ec-bc95-8e97aa271618',
        name: 'Pablo',
        surname: 'Testing password',
      },
      {
        id: '506cdf67-010c-4c05-9c95-1c834f5ff484',
        name: 'Vicente',
        surname: 'Testing password',
      },
    ],
    teamTwoPlayers: [
      {
        id: '6dc29adb-517a-4a2d-ae36-0b96a4def775',
        name: 'Alejandro',
        surname: 'Testing password',
      },
      {
        id: '506cdf67-010c-4c05-9c95-1c834f5ff484',
        name: 'Vicente',
        surname: 'Testing password',
      },
    ],
    setsWonByTeamOne: 0,
    setsWonByTeamTwo: 0,
    gamesWonByTeamOne: 0,
    gamesWonByTeamTwo: 0,
  },
};

export const matchesResponse = {
  status: 200,
  description: 'The matches list.',
  isArray: true,
  type: MatchResponseDto,
  example: [{
    id: '3934e2aa-ed15-43ae-8d0d-2e0ca4cf2252',
    leagueId: '18b0618f-1bf1-4106-993c-8b23d1cd356f',
    startTime: '2023-12-29T17:09:49.000Z',
    isCompleted: false,
    isCancelled: false,
    teamOnePlayers: [
      {
        id: '5ed08574-05e6-47ec-bc95-8e97aa271618',
        name: 'Pablo',
        surname: 'Testing password',
      },
      {
        id: '506cdf67-010c-4c05-9c95-1c834f5ff484',
        name: 'Vicente',
        surname: 'Testing password',
      },
    ],
    teamTwoPlayers: [
      {
        id: '6dc29adb-517a-4a2d-ae36-0b96a4def775',
        name: 'Alejandro',
        surname: 'Testing password',
      },
      {
        id: '506cdf67-010c-4c05-9c95-1c834f5ff484',
        name: 'Vicente',
        surname: 'Testing password',
      },
    ],
    setsWonByTeamOne: 0,
    setsWonByTeamTwo: 0,
    gamesWonByTeamOne: 0,
    gamesWonByTeamTwo: 0,
  }],
};

export const matchDeleteResponse = {
  status: 204,
  description: 'The match has been successfully deactivate.',
  type: MatchResponseDto,
  example: {}
};

export const matchBadRequestResponse = {
  status: 400,
  description: 'Bad Request. The input data is invalid.',
};

export const matchNotFoundResponse = {
  status: 404,
  description: 'League not found.',
};

export const createMatchApiResponses = [
  matchCreatedResponse,
  matchBadRequestResponse,
  matchNotFoundResponse,
];

export const matchApiResponse = [
  matchResponse,
  matchBadRequestResponse,
  matchNotFoundResponse,
];

export const matchesApiResponse = [
  matchesResponse,
  matchBadRequestResponse,
  matchNotFoundResponse,
];

export const matchDeleteApiResponse = [
  matchDeleteResponse,
  matchBadRequestResponse,
  matchNotFoundResponse,
];



