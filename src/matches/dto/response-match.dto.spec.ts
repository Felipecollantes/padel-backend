import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { MatchResponseDto, PlayerDto } from './response-match.dto';

describe('MatchResponseDto', () => {
  it('should validate match properties correctly', async () => {
    const matchDto = plainToInstance(MatchResponseDto, {
      id: '371d951d-d8b0-4912-860e-74ba0be1af56',
      leagueId: '18b0618f-1bf1-4106-993c-8b23d1cd356f',
      startTime: new Date(),
      isCompleted: false,
      isCancelled: false,
      teamOnePlayers: [{ id: 'fb00f78d-a930-45b9-b810-9f12f7ea6596', name: 'Pablo', surname: 'Surname test' }],
      teamTwoPlayers: [{ id: 'fb00f78d-a930-45b9-b810-9f12f7ea6597', name: 'Player2', surname: 'Surname2' }],
      setsWonByTeamOne: 0,
      setsWonByTeamTwo: 0,
      gamesWonByTeamOne: 0,
      gamesWonByTeamTwo: 0,
    });

    const errors = await validate(matchDto);
    expect(errors).toHaveLength(0);
  });

  it('should validate all fields correctly', async () => {
    const dto = new MatchResponseDto();
    dto.id = 'fb00f78d-a930-45b9-b810-9f12f7ea6596';
    dto.leagueId = 'fb00f78d-a930-45b9-b810-9f12f7ea6596';
    dto.startTime = new Date();
    dto.isCompleted = false;
    dto.isCancelled = false;
    dto.setsWonByTeamOne = 0;
    dto.setsWonByTeamTwo = 0;
    dto.gamesWonByTeamOne = 0;
    dto.gamesWonByTeamTwo = 0;

    // Example of creating a player DTO
    const playerDto = new PlayerDto();
    playerDto.id = 'fb00f78d-a930-45b9-b810-9f12f7ea6596';
    playerDto.name = 'John';
    playerDto.surname = 'Doe';

    dto.teamOnePlayers = [playerDto];
    dto.teamTwoPlayers = [playerDto];

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation if id is not UUID', async () => {
    const dto = new MatchResponseDto();
    dto.id = 'invalid-uuid';

    const errors = await validate(dto);
    const idError = errors.find((error) => error.property === 'id');
    expect(idError).toBeDefined();
    expect(idError.constraints.isUuid).toBeDefined();
  });
});

describe('PlayerDto', () => {
  it('should validate player properties correctly', async () => {
    const playerDto = plainToInstance(PlayerDto, {
      id: 'fb00f78d-a930-45b9-b810-9f12f7ea6596',
      name: 'Pablo',
      surname: 'Surname test',
    });

    const errors = await validate(playerDto);
    expect(errors).toHaveLength(0);
  });

  it('should validate all fields correctly', async () => {
    const dto = new PlayerDto();
    dto.id = 'fb00f78d-a930-45b9-b810-9f12f7ea6596';
    dto.name = 'John';
    dto.surname = 'Doe';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation if id is not a UUID', async () => {
    const dto = new PlayerDto();
    dto.id = 'invalid-uuid';
    dto.name = 'John';
    dto.surname = 'Doe';

    const errors = await validate(dto);
    expect(errors).not.toHaveLength(0);
    const idError = errors.find((error) => error.property === 'id');
    expect(idError).toBeDefined();
    expect(idError.constraints.isUuid).toBeDefined();
  });

  it('should fail validation if name is empty', async () => {
    const dto = new PlayerDto();
    dto.id = 'fb00f78d-a930-45b9-b810-9f12f7ea6596';
    dto.name = ''; // Empty name
    dto.surname = 'Doe';

    const errors = await validate(dto);
    const nameError = errors.find((error) => error.property === 'name');
    expect(nameError).toBeDefined();
    expect(nameError.constraints.isNotEmpty).toBeDefined();
  });

  it('should fail validation if surname is empty', async () => {
    const dto = new PlayerDto();
    dto.id = 'fb00f78d-a930-45b9-b810-9f12f7ea6596';
    dto.name = 'John';
    dto.surname = null; // Empty surname

    const errors = await validate(dto);
    const surnameError = errors.find((error) => error.property === 'surname');
    expect(surnameError).toBeDefined();
    expect(surnameError.constraints.isNotEmpty).toBeDefined();
  });
});
