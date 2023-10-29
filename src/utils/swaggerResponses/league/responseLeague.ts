import { LeagueResponseDto } from '../../../league/dto/response-league.dto';

export const leagueCreatedResponse = {
  status: 200,
  description: 'The league has been successfully created.',
  type: LeagueResponseDto,
  example: {
    name: "Champions League",
    isActive: true,
    totalMatches: 10,
    matchesWon: 7,
    matchesTied: 2,
    matchesLost: 1,
    points: 23,
    participants: [],
    id: "fb00f78d-a930-45b9-b810-9f12f7ea6596",
    createdAt: "2023-10-28T09:08:06.757Z"
  }
};

export const leaguesResponse = {
  status: 200,
  description: 'The league has been successfully created.',
  isArray: true,
  type: LeagueResponseDto,
  example: [
    {
    name: "Champions League",
    isActive: true,
    totalMatches: 10,
    matchesWon: 7,
    matchesTied: 2,
    matchesLost: 1,
    points: 23,
      participants: [
        {
          id: "506cdf67-010c-4c05-9c95-1c834f5ff484",
          email: "nameTest@gmail.com",
          name: "Name",
          surname: "Testing",
          isActive: true,
          createdAt: "2023-10-15T10:46:22.791Z",
          lastLogin: null,
          elo: 1200,
          roles: [
            "user"
          ]
        },
      ],
    id: "fb00f78d-a930-45b9-b810-9f12f7ea6596",
    createdAt: "2023-10-28T09:08:06.757Z"
  },
    {
      name: "Padel League",
      isActive: true,
      totalMatches: 1,
      matchesWon: 7,
      matchesTied: 2,
      matchesLost: 1,
      points: 23,
      participants: [
        {
          id: "506cdf67-010c-4c05-9c95-1c834f5ff484",
          email: "nameTest@gmail.com",
          name: "Name",
          surname: "Testing",
          isActive: true,
          createdAt: "2023-10-15T10:46:22.791Z",
          lastLogin: null,
          elo: 1200,
          roles: [
            "user"
          ]
        },
      ],
      id: "fb00f78d-a930-45b9-b810-9f12f7ea6596",
      createdAt: "2023-10-28T09:08:06.757Z"
    }
  ]
};

export const leagueDeleteResponse = {
  status: 201,
  description: 'The league has been successfully deactivate.',
  type: LeagueResponseDto,
  example: {
    name: "Champions League",
    isActive: false,
    totalMatches: 10,
    matchesWon: 7,
    matchesTied: 2,
    matchesLost: 1,
    points: 23,
    participants: [],
    id: "fb00f78d-a930-45b9-b810-9f12f7ea6596",
    createdAt: "2023-10-28T09:08:06.757Z"
  }
};


export const leagueBadRequestResponse = {
  status: 400,
  description: 'Bad Request. The input data is invalid.',
};

export const leagueNotFoundResponse = {
  status: 404,
  description: 'League not found.',
};


export const leagueApiResponses = [
  leagueCreatedResponse,
  leagueBadRequestResponse,
  leagueNotFoundResponse,
];

export const leaguesApiResponses = [
  leaguesResponse,
  leagueBadRequestResponse,
  leagueNotFoundResponse,
];

export const leagueDeleteApiResponses = [
  leagueDeleteResponse,
  leagueBadRequestResponse,
  leagueNotFoundResponse,
];